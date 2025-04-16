package com.example.ingestion_tool.dto;

import java.util.List;

public class TableColumnsRequest {
    private String source;
    private ClickHouseConfig clickHouseConfig;
    private List<String> tables;
    private String joinCondition;

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

    public List<String> getTables() {
        return tables;
    }

    public void setTables(List<String> tables) {
        this.tables = tables;
    }

    public String getJoinCondition() {
        return joinCondition;
    }

    public void setJoinCondition(String joinCondition) {
        this.joinCondition = joinCondition;
    }
}
