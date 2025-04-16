package com.example.ingestion_tool.dto;

import java.util.List;

public class IngestionRequest {
    private String direction;
    private ClickHouseConfig clickHouseConfig;
    private FileConfig fileConfig;
    private List<String> tables;
    private List<String> columns;
    private String joinCondition;

    // Getters and setters
    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
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

    public List<String> getTables() {
        return tables;
    }

    public void setTables(List<String> tables) {
        this.tables = tables;
    }

    public List<String> getColumns() {
        return columns;
    }

    public void setColumns(List<String> columns) {
        this.columns = columns;
    }

    public String getJoinCondition() {
        return joinCondition;
    }

    public void setJoinCondition(String joinCondition) {
        this.joinCondition = joinCondition;
    }
}
