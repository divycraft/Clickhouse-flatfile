package com.example.ingestion_tool.service;

import com.example.ingestion_tool.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TransferService {

    @Autowired
    private ClickHouseService clickHouseService;
    
    @Autowired
    private FileService fileService;
    
    public List<String> getClickHouseTables(ClickHouseConfig config) throws Exception {
        return clickHouseService.getTables(config);
    }
    
    public List<String> getColumns(TableColumnsRequest request) throws Exception {
        if ("clickhouse".equals(request.getSource())) {
            return clickHouseService.getColumns(
                    request.getClickHouseConfig(),
                    request.getTables(),
                    request.getJoinCondition()
            ).stream().map(ColumnInfo::getName).collect(Collectors.toList());
        } else {
            throw new IllegalArgumentException("Unsupported source: " + request.getSource());
        }
    }
    
    public List<String> getFileColumns(FileConfig config) throws Exception {
        File file = fileService.validateFile(config.getFileName());
        return fileService.getFileColumns(file.getAbsolutePath(), config.getDelimiter())
                .stream().map(ColumnInfo::getName).collect(Collectors.toList());
    }
    
    public List<Map<String, Object>> previewData(PreviewRequest request) throws Exception {
        if ("clickhouse".equals(request.getSource())) {
            return clickHouseService.previewData(
                    request.getClickHouseConfig(),
                    request.getTables(),
                    request.getColumns(),
                    request.getJoinCondition()
            );
        } else {
            File file = fileService.validateFile(request.getFileConfig().getFileName());
            return fileService.previewFileData(
                    file.getAbsolutePath(),
                    request.getFileConfig().getDelimiter(),
                    request.getColumns()
            );
        }
    }
    
    public IngestionResponse performIngestion(IngestionRequest request) throws Exception {
        int count;
        
        if ("clickhouse-to-file".equals(request.getDirection())) {
            File file = new File(request.getFileConfig().getFileName());
            count = clickHouseService.exportToFile(
                    request.getClickHouseConfig(),
                    request.getTables(),
                    request.getColumns(),
                    request.getJoinCondition(),
                    file.getAbsolutePath(),
                    request.getFileConfig().getDelimiter()
            );
            
            return new IngestionResponse(true, count, "Successfully exported data from ClickHouse to file");
        } else if ("file-to-clickhouse".equals(request.getDirection())) {
            File file = fileService.validateFile(request.getFileConfig().getFileName());
            
            // For simplicity, we'll use the first table as the target
            String targetTable = request.getTables().get(0);
            
            count = clickHouseService.importFromFile(
                    request.getClickHouseConfig(),
                    targetTable,
                    request.getColumns(),
                    file.getAbsolutePath(),
                    request.getFileConfig().getDelimiter()
            );
            
            return new IngestionResponse(true, count, "Successfully imported data from file to ClickHouse");
        } else {
            throw new IllegalArgumentException("Unsupported direction: " + request.getDirection());
        }
    }
}
