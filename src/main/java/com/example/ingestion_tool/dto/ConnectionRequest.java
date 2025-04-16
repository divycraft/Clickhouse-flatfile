package com.example.ingestion_tool.dto;

public class ConnectionRequest {
    private String source;
    private ClickHouseConfig clickHouseConfig;
    private FileConfig fileConfig;

    // Getters and setters
    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public ClickHouseConfig getClickHouseConfig() {
        return clickHouseConfig;
    }

    public void setClickHouseConfig(ClickHouseConfig clickHouseConfig) {
        this.clickHouseConfig = clickHouseConfig;
    }

    public FileConfig getFileConfig() {
        return fileConfig;
    }

    public void setFileConfig(FileConfig fileConfig) {
        this.fileConfig = fileConfig;
    }
}
