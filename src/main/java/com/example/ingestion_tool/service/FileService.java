package com.example.ingestion_tool.service;

import com.example.ingestion_tool.dto.ColumnInfo;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;

@Service
public class FileService {

    public List<ColumnInfo> getFileColumns(String filePath, String delimiter) throws IOException {
        List<ColumnInfo> columns = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String headerLine = reader.readLine();
            
            if (headerLine != null) {
                String[] headers = headerLine.split(delimiter);
                
                for (String header : headers) {
                    columns.add(new ColumnInfo(header.trim(), "String"));
                }
            }
        }
        
        return columns;
    }
    
    public List<Map<String, Object>> previewFileData(String filePath, String delimiter, List<String> selectedColumns) throws IOException {
        List<Map<String, Object>> records = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String headerLine = reader.readLine();
            
            if (headerLine != null) {
                String[] headers = headerLine.split(delimiter);
                Map<String, Integer> headerIndexMap = new HashMap<>();
                
                for (int i = 0; i < headers.length; i++) {
                    headerIndexMap.put(headers[i].trim(), i);
                }
                
                String line;
                int count = 0;
                
                while ((line = reader.readLine()) != null && count < 100) {
                    String[] values = line.split(delimiter, -1);
                    Map<String, Object> record = new HashMap<>();
                    
                    for (String column : selectedColumns) {
                        Integer index = headerIndexMap.get(column);
                        
                        if (index != null && index < values.length) {
                            record.put(column, values[index]);
                        } else {
                            record.put(column, null);
                        }
                    }
                    
                    records.add(record);
                    count++;
                }
            }
        }
        
        return records;
    }
    
    public File validateFile(String fileName) {
        File file = new File(fileName);
        
        if (!file.exists() || !file.isFile() || !file.canRead()) {
            throw new IllegalArgumentException("File does not exist or cannot be read: " + fileName);
        }
        
        return file;
    }
}
