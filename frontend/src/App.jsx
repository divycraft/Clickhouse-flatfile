"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import ClickHouseConnectionForm from "./components/clickhouse-connection-form"
import FlatFileForm from "./components/flat-file-form"
import TableSelector from "./components/table-selector"
import ColumnSelector from "./components/column-selector"
import IngestionStatus from "./components/ingestion-status"
import DataPreview from "./components/data-preview"
import { Button } from "./components/ui/button"
import { ArrowLeftRight } from 'lucide-react'

export default function Home() {
  const [direction, setDirection] = useState("clickhouse-to-file")
  const [connectionStatus, setConnectionStatus] = useState("idle")
  const [clickHouseConfig, setClickHouseConfig] = useState({
    host: "",
    port: "",
    database: "",
    user: "testuser",
    token: "your-token-123",
  })
  const [fileConfig, setFileConfig] = useState({
    fileName: "",
    delimiter: ",",
  })
  const [availableTables, setAvailableTables] = useState([])
  const [selectedTables, setSelectedTables] = useState([])
  const [joinCondition, setJoinCondition] = useState("")
  const [columns, setColumns] = useState([])
  const [ingestionStatus, setIngestionStatus] = useState("idle")
  const [ingestionProgress, setIngestionProgress] = useState(0)
  const [ingestionResult, setIngestionResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [previewData, setPreviewData] = useState([])

  const handleConnect = async () => {
    setConnectionStatus("connecting")
    setErrorMessage("")

    try {
      // In a real app, this would be an API call to the backend
      const response = await fetch("http://localhost:8081/api/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: direction === "clickhouse-to-file" ? "clickhouse" : "file",
          clickHouseConfig: direction === "clickhouse-to-file" ? clickHouseConfig : undefined,
          fileConfig: direction === "file-to-clickhouse" ? fileConfig : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Connection failed")
      }

      const data = await response.json()
      console.log("Connection successful:", data)

      if (direction === "clickhouse-to-file") {
        setAvailableTables(data.tables || [])
      } else {
        // For file source, we'd get column information directly
        setColumns(
          (data.columns || []).map((col) => ({
            name: col,
            selected: true,
          })),
        )
      }

      setConnectionStatus("connected")
    } catch (error) {
      console.error("Connection error:", error)
      setConnectionStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Unknown connection error")
    }
  }

  const handleTableSelect = async (tables) => {
    setSelectedTables(tables)

    if (tables.length === 0) {
      setColumns([])
      return
    }

    try {
      // In a real app, this would be an API call to the backend
      const response = await fetch("http://localhost:8081/api/columns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: direction === "clickhouse-to-file" ? "clickhouse" : "file",
          clickHouseConfig,
          tables,
          joinCondition: tables.length > 1 ? joinCondition : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch columns")
      }

      const data = await response.json()
      setColumns(
        (data.columns || []).map((col) => ({
          name: col,
          selected: true,
        })),
      )
    } catch (error) {
      console.error("Error fetching columns:", error)
      setErrorMessage(error instanceof Error ? error.message : "Unknown error fetching columns")
    }
  }

  const handlePreview = async () => {
    try {
      const selectedColumns = columns.filter((col) => col.selected).map((col) => col.name)

      if (selectedColumns.length === 0) {
        setErrorMessage("Please select at least one column to preview")
        return
      }

      // In a real app, this would be an API call to the backend
      const response = await fetch("http://localhost:8081/api/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: direction === "clickhouse-to-file" ? "clickhouse" : "file",
          clickHouseConfig: direction === "clickhouse-to-file" ? clickHouseConfig : undefined,
          fileConfig: direction === "file-to-clickhouse" ? fileConfig : undefined,
          tables: selectedTables,
          columns: selectedColumns,
          joinCondition: selectedTables.length > 1 ? joinCondition : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to preview data")
      }

      const data = await response.json()
      setPreviewData(data.records || [])
    } catch (error) {
      console.error("Preview error:", error)
      setErrorMessage(error instanceof Error ? error.message : "Unknown preview error")
    }
  }

  const handleStartIngestion = async () => {
    setIngestionStatus("in-progress")
    setIngestionProgress(0)
    setErrorMessage("")

    const selectedColumns = columns.filter((col) => col.selected).map((col) => col.name)

    if (selectedColumns.length === 0) {
      setErrorMessage("Please select at least one column to ingest")
      setIngestionStatus("error")
      return
    }

    try {
      // In a real app, this would be an API call to the backend
      const response = await fetch("http://localhost:8081/api/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          direction,
          clickHouseConfig,
          fileConfig,
          tables: selectedTables,
          columns: selectedColumns,
          joinCondition: selectedTables.length > 1 ? joinCondition : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Ingestion failed")
      }

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setIngestionProgress((prev) => {
          const newProgress = prev + 10
          if (newProgress >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return newProgress
        })
      }, 500)

      const data = await response.json()

      // Ensure progress reaches 100% when done
      clearInterval(progressInterval)
      setIngestionProgress(100)
      setIngestionStatus("completed")
      setIngestionResult({ count: data.count || 0 })
    } catch (error) {
      console.error("Ingestion error:", error)
      setIngestionStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Unknown ingestion error")
    }
  }

  const toggleDirection = () => {
    setDirection((prev) => (prev === "clickhouse-to-file" ? "file-to-clickhouse" : "clickhouse-to-file"))
    setConnectionStatus("idle")
    setAvailableTables([])
    setSelectedTables([])
    setColumns([])
    setIngestionStatus("idle")
    setIngestionResult(null)
    setPreviewData([])
    setErrorMessage("")
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">ClickHouse Data Transfer Tool</CardTitle>
          <CardDescription>Transfer data between ClickHouse and flat files with ease</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-6">
            <div className={`text-center ${direction === "clickhouse-to-file" ? "font-bold" : ""}`}>ClickHouse</div>
            <Button variant="outline" size="icon" className="mx-4" onClick={toggleDirection}>
              <ArrowLeftRight className={direction === "clickhouse-to-file" ? "" : "rotate-180"} />
            </Button>
            <div className={`text-center ${direction === "file-to-clickhouse" ? "font-bold" : ""}`}>Flat File</div>
          </div>

          <Tabs defaultValue="connection" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="connection">Connection</TabsTrigger>
              <TabsTrigger value="selection" disabled={connectionStatus !== "connected"}>
                Selection
              </TabsTrigger>
              <TabsTrigger value="preview" disabled={columns.length === 0}>
                Preview
              </TabsTrigger>
              <TabsTrigger value="ingestion" disabled={columns.length === 0}>
                Ingestion
              </TabsTrigger>
            </TabsList>

            <TabsContent value="connection">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {direction === "clickhouse-to-file" ? (
                  <>
                    <ClickHouseConnectionForm config={clickHouseConfig} onChange={setClickHouseConfig} />
                    <FlatFileForm config={fileConfig} onChange={setFileConfig} isTarget={true} />
                  </>
                ) : (
                  <>
                    <FlatFileForm config={fileConfig} onChange={setFileConfig} isTarget={false} />
                    <ClickHouseConnectionForm config={clickHouseConfig} onChange={setClickHouseConfig} />
                  </>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={handleConnect} disabled={connectionStatus === "connecting"}>
                  {connectionStatus === "connecting" ? "Connecting..." : "Connect"}
                </Button>
              </div>

              {errorMessage && <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">{errorMessage}</div>}
            </TabsContent>

            <TabsContent value="selection">
              {direction === "clickhouse-to-file" && (
                <TableSelector
                  availableTables={availableTables}
                  selectedTables={selectedTables}
                  onSelectTables={handleTableSelect}
                  joinCondition={joinCondition}
                  onJoinConditionChange={setJoinCondition}
                />
              )}

              {columns.length > 0 && <ColumnSelector columns={columns} onChange={(cols) => setColumns(cols)} />}
            </TabsContent>

            <TabsContent value="preview">
              <div className="mb-4 flex justify-end">
                <Button onClick={handlePreview}>Preview Data</Button>
              </div>

              <DataPreview data={previewData} columns={columns.filter((col) => col.selected).map((col) => col.name)} />

              {errorMessage && <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">{errorMessage}</div>}
            </TabsContent>

            <TabsContent value="ingestion">
              <div className="mb-6 flex justify-end">
                <Button onClick={handleStartIngestion} disabled={ingestionStatus === "in-progress"}>
                  {ingestionStatus === "in-progress" ? "Ingesting..." : "Start Ingestion"}
                </Button>
              </div>

              <IngestionStatus status={ingestionStatus} progress={ingestionProgress} result={ingestionResult} />

              {errorMessage && <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">{errorMessage}</div>}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
