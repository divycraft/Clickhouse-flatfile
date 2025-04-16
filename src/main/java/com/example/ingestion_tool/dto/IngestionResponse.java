package com.example.ingestion_tool.dto;

public class IngestionResponse {
    private boolean success;
    private int count;
    private String message;

    public IngestionResponse(boolean success, int count, String message) {
        this.success = success;
        this.count = count;
        this.message = message;
    }

    // Getters and setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
