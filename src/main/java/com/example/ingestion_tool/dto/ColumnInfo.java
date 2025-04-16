package com.example.ingestion_tool.dto;

public class ColumnInfo {
    private String name;
    private String type;

    public ColumnInfo(String name, String type) {
        this.name = name;
        this.type = type;
    }

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
