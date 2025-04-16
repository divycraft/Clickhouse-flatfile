package com.example.ingestion_tool.dto;

public class ClickHouseConfig {
    private String host;
    private String port;
    private String database;
    private String user;
    private String token;

    // Getters and setters
    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public String getDatabase() {
        return database;
    }

    public void setDatabase(String database) {
        this.database = database;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getJdbcUrl() {
        return String.format("jdbc:clickhouse://%s:%s/%s?ssl=true", host, port, database);
    }
}
