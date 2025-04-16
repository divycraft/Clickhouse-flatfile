package com.example.ingestion_tool.controller;

import com.example.ingestion_tool.dto.*;
import com.example.ingestion_tool.service.TransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173/data-ingestion")
public class TransferController {

    @Autowired
    private TransferService transferService;

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> welcome() {
        return ResponseEntity.ok(Map.of("message", "ClickHouse-Flatfile Ingestion API"));
    }
    
    @PostMapping("/connect")
    public ResponseEntity<?> connect(@RequestBody ConnectionRequest request) {
        try {
            Map<String, Object> response = new HashMap<>();
            
            if ("clickhouse".equals(request.getSource())) {
                List<String> tables = transferService.getClickHouseTables(request.getClickHouseConfig());
                response.put("tables", tables);
            } else if ("file".equals(request.getSource())) {
                List<String> columns = transferService.getFileColumns(request.getFileConfig());
                response.put("columns", columns);
            } else {
                return ResponseEntity.badRequest().body("Unsupported source: " + request.getSource());
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error connecting to source: " + e.getMessage());
        }
    }
    
    @PostMapping("/columns")
    public ResponseEntity<?> getColumns(@RequestBody TableColumnsRequest request) {
        try {
            List<String> columns = transferService.getColumns(request);
            Map<String, Object> response = new HashMap<>();
            response.put("columns", columns);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching columns: " + e.getMessage());
        }
    }
    
    @PostMapping("/preview")
    public ResponseEntity<?> previewData(@RequestBody PreviewRequest request) {
        try {
            List<Map<String, Object>> records = transferService.previewData(request);
            Map<String, Object> response = new HashMap<>();
            response.put("records", records);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error previewing data: " + e.getMessage());
        }
    }
    
    @PostMapping("/ingest")
    public ResponseEntity<?> ingestData(@RequestBody IngestionRequest request) {
        try {
            IngestionResponse result = transferService.performIngestion(request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error during ingestion: " + e.getMessage());
        }
    }
}
