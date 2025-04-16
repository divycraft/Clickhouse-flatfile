package com.example.ingestion_tool.service;

import com.opencsv.CSVReader;
import com.opencsv.CSVWriter;
import com.opencsv.exceptions.CsvValidationException;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

public class CsvUtils {

    /**
     * Writes a ResultSet to a CSV file.
     *
     * @param resultSet The ResultSet to write.
     * @param filePath  The path to the output CSV file.
     * @param delimiter The delimiter to use (e.g., ",").
     * @return The number of rows written.
     * @throws SQLException If a database error occurs.
     * @throws IOException  If an I/O error occurs.
     */
    public static int writeResultSetToCsv(ResultSet resultSet, String filePath, String delimiter)
            throws SQLException, IOException {
        int rowCount = 0;

        try (CSVWriter writer = new CSVWriter(new FileWriter(filePath),
                delimiter.charAt(0),
                CSVWriter.DEFAULT_QUOTE_CHARACTER,
                CSVWriter.DEFAULT_ESCAPE_CHARACTER,
                CSVWriter.DEFAULT_LINE_END)) {

            ResultSetMetaData metaData = resultSet.getMetaData();
            int columnCount = metaData.getColumnCount();

            // Write header
            String[] header = new String[columnCount];
            for (int i = 1; i <= columnCount; i++) {
                header[i - 1] = metaData.getColumnName(i);
            }
            writer.writeNext(header);

            // Write data
            while (resultSet.next()) {
                String[] row = new String[columnCount];
                for (int i = 1; i <= columnCount; i++) {
                    Object value = resultSet.getObject(i);
                    row[i - 1] = value != null ? value.toString() : "";
                }
                writer.writeNext(row);
                rowCount++;
            }
        }

        return rowCount;
    }

    /**
     * Reads a CSV file and inserts its data into ClickHouse using a prepared statement.
     *
     * @param connection  The database connection.
     * @param insertQuery The SQL insert query with placeholders.
     * @param filePath    The path to the input CSV file.
     * @param delimiter   The delimiter used in the CSV file.
     * @param columnCount The number of columns expected.
     * @return The number of rows inserted.
     * @throws SQLException          If a database error occurs.
     * @throws IOException           If an I/O error occurs.
     * @throws CsvValidationException If the CSV file is invalid.
     */
    public static int readCsvAndInsertToClickHouse(Connection connection, String insertQuery,
            String filePath, String delimiter, int columnCount)
            throws SQLException, IOException, CsvValidationException {
        int rowCount = 0;

        try (CSVReader reader = new CSVReader(new FileReader(filePath))) {
            reader.readNext(); // Skip header

            try (PreparedStatement statement = connection.prepareStatement(insertQuery)) {
                while (true) {
                    String[] row = reader.readNext();
                    if (row == null) {
                        break;
                    }

                    // Validate row length
                    if (row.length != columnCount) {
                        throw new IOException("Invalid CSV row: expected " + columnCount + " columns, found " + row.length);
                    }

                    // Set parameters
                    for (int i = 0; i < columnCount; i++) {
                        statement.setString(i + 1, row[i]);
                    }

                    statement.executeUpdate();
                    rowCount++;
                }
            }
        }

        return rowCount;
    }
}
