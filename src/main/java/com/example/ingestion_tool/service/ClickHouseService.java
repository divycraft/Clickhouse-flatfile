package com.example.ingestion_tool.service;

import com.example.ingestion_tool.dto.ClickHouseConfig;
import com.example.ingestion_tool.dto.ColumnInfo;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.*;

@Service
public class ClickHouseService {

    public List<String> getTables(ClickHouseConfig config) throws SQLException {
        List<String> tables = new ArrayList<>();

        try (Connection connection = getConnection(config)) {
            try (Statement statement = connection.createStatement()) {
                // Check what database we're actually connected to

                try {
                    ResultSet rs1 = statement.executeQuery("SHOW TABLES");
                    ResultSetMetaData meta = rs1.getMetaData();
                    int columnCount = meta.getColumnCount();
                    // dumpResultSet(rs1, "SHOW TABLES");
                    while (rs1.next()) {
                        for (int i = 1; i <= columnCount; i++) {
                            tables.add(rs1.getString(i));
                        }
                    }
                } catch (SQLException e) {
                    System.out.println("Error with SHOW TABLES: " + e.getMessage());
                }
            }
        }

        return tables;
    }

    // Helper method to dump all data from a ResultSet
    // private void dumpResultSet(ResultSet rs, String queryName) throws SQLException {
    //     ResultSetMetaData meta = rs.getMetaData();
    //     int columnCount = meta.getColumnCount();

    //     System.out.println("Results for " + queryName + ":");
    //     System.out.println("Column count: " + columnCount);

    //     for (int i = 1; i <= columnCount; i++) {
    //         System.out.print(meta.getColumnName(i) + " | ");
    //     }
    //     System.out.println();

    //     boolean hasRows = false;
    //     while (rs.next()) {
    //         hasRows = true;
    //         for (int i = 1; i <= columnCount; i++) {
    //             System.out.print(rs.getString(i) + " | ");
    //         }
    //         System.out.println();
    //     }

    //     if (!hasRows) {
    //         System.out.println("No rows returned for " + queryName);
    //     }
    // }

    public List<ColumnInfo> getColumns(ClickHouseConfig config, List<String> tables, String joinCondition)
            throws SQLException {
        List<ColumnInfo> columns = new ArrayList<>();

        try (Connection connection = getConnection(config)) {
            if (tables.size() == 1) {
                // Single table
                DatabaseMetaData metaData = connection.getMetaData();
                ResultSet resultSet = metaData.getColumns(config.getDatabase(), null, tables.get(0), "%");

                while (resultSet.next()) {
                    String columnName = resultSet.getString("COLUMN_NAME");
                    String columnType = resultSet.getString("TYPE_NAME");
                    columns.add(new ColumnInfo(columnName, columnType));
                }
            } else if (tables.size() > 1 && joinCondition != null && !joinCondition.isEmpty()) {
                // Multiple tables with join
                StringBuilder query = new StringBuilder();
                query.append("SELECT * FROM ").append(tables.get(0));

                for (int i = 1; i < tables.size(); i++) {
                    query.append(" JOIN ").append(tables.get(i));
                }

                query.append(" ON ").append(joinCondition).append(" LIMIT 0");

                try (PreparedStatement statement = connection.prepareStatement(query.toString())) {
                    ResultSetMetaData metaData = statement.getMetaData();
                    int columnCount = metaData.getColumnCount();

                    for (int i = 1; i <= columnCount; i++) {
                        String columnName = metaData.getColumnName(i);
                        String columnType = metaData.getColumnTypeName(i);
                        columns.add(new ColumnInfo(columnName, columnType));
                    }
                }
            }
        }

        return columns;
    }

    public List<Map<String, Object>> previewData(ClickHouseConfig config, List<String> tables, List<String> columns,
            String joinCondition) throws SQLException {
        List<Map<String, Object>> records = new ArrayList<>();

        try (Connection connection = getConnection(config)) {
            StringBuilder query = new StringBuilder();
            query.append("SELECT ");

            for (int i = 0; i < columns.size(); i++) {
                if (i > 0) {
                    query.append(", ");
                }
                query.append(columns.get(i));
            }

            query.append(" FROM ").append(tables.get(0));

            if (tables.size() > 1 && joinCondition != null && !joinCondition.isEmpty()) {
                for (int i = 1; i < tables.size(); i++) {
                    query.append(" JOIN ").append(tables.get(i));
                }
                query.append(" ON ").append(joinCondition);
            }

            query.append(" LIMIT 100");

            try (PreparedStatement statement = connection.prepareStatement(query.toString());
                    ResultSet resultSet = statement.executeQuery()) {

                ResultSetMetaData metaData = resultSet.getMetaData();
                int columnCount = metaData.getColumnCount();

                while (resultSet.next()) {
                    Map<String, Object> record = new HashMap<>();

                    for (int i = 1; i <= columnCount; i++) {
                        String columnName = metaData.getColumnName(i);
                        Object value = resultSet.getObject(i);
                        record.put(columnName, value);
                    }

                    records.add(record);
                }
            }
        }

        return records;
    }

    public int exportToFile(ClickHouseConfig config, List<String> tables, List<String> columns, String joinCondition,
            String filePath, String delimiter) throws SQLException, Exception {
        int count = 0;

        try (Connection connection = getConnection(config)) {
            StringBuilder query = new StringBuilder();
            query.append("SELECT ");

            for (int i = 0; i < columns.size(); i++) {
                if (i > 0) {
                    query.append(", ");
                }
                query.append(columns.get(i));
            }

            query.append(" FROM ").append(tables.get(0));

            if (tables.size() > 1 && joinCondition != null && !joinCondition.isEmpty()) {
                for (int i = 1; i < tables.size(); i++) {
                    query.append(" JOIN ").append(tables.get(i));
                }
                query.append(" ON ").append(joinCondition);
            }

            try (PreparedStatement statement = connection.prepareStatement(query.toString());
                    ResultSet resultSet = statement.executeQuery()) {

                // Write to CSV file
                count = CsvUtils.writeResultSetToCsv(resultSet, filePath, delimiter);
            }
        }

        return count;
    }

    public int importFromFile(ClickHouseConfig config, String tableName, List<String> columns, String filePath,
            String delimiter) throws SQLException, Exception {
        int count = 0;

        try (Connection connection = getConnection(config)) {
            // Create table if it doesn't exist
            StringBuilder createTableQuery = new StringBuilder();
            createTableQuery.append("CREATE TABLE IF NOT EXISTS ").append(tableName).append(" (");

            for (int i = 0; i < columns.size(); i++) {
                if (i > 0) {
                    createTableQuery.append(", ");
                }
                createTableQuery.append(columns.get(i)).append(" String");
            }

            createTableQuery.append(") ENGINE = MergeTree() ORDER BY tuple()");

            try (Statement statement = connection.createStatement()) {
                statement.execute(createTableQuery.toString());
            }

            // Prepare insert query
            StringBuilder insertQuery = new StringBuilder();
            insertQuery.append("INSERT INTO ").append(tableName).append(" (");

            for (int i = 0; i < columns.size(); i++) {
                if (i > 0) {
                    insertQuery.append(", ");
                }
                insertQuery.append(columns.get(i));
            }

            insertQuery.append(") VALUES (");

            for (int i = 0; i < columns.size(); i++) {
                if (i > 0) {
                    insertQuery.append(", ");
                }
                insertQuery.append("?");
            }

            insertQuery.append(")");

            // Read from CSV and insert into ClickHouse
            count = CsvUtils.readCsvAndInsertToClickHouse(connection, insertQuery.toString(), filePath, delimiter,
                    columns.size());
        }

        return count;
    }

    private Connection getConnection(ClickHouseConfig config) throws SQLException {
        Properties properties = new Properties();
        properties.setProperty("user", config.getUser());
        properties.setProperty("password", config.getToken());
        properties.setProperty("ssl", "false");

        return DriverManager.getConnection(config.getJdbcUrl(), properties);
    }
}
