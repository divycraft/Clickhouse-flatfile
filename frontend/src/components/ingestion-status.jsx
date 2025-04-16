import { Card, CardContent } from "./ui/card"
import { Progress } from "./ui/progress"
import { CheckCircle, AlertCircle, Clock } from "lucide-react"

/**
 * Ingestion status component
 * @param {Object} props - Component props
 * @param {'idle' | 'in-progress' | 'completed' | 'error'} props.status - The current ingestion status
 * @param {number} props.progress - The ingestion progress (0-100)
 * @param {Object|null} props.result - The ingestion result
 * @param {number} props.result.count - The number of records ingested
 */
export default function IngestionStatus({ status, progress, result }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Ingestion Status</div>
              <div className="text-sm text-muted-foreground">
                {status === "idle" && "Not started"}
                {status === "in-progress" && "In progress"}
                {status === "completed" && "Completed"}
                {status === "error" && "Error"}
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex items-center justify-center p-6">
            {status === "idle" && (
              <div className="flex flex-col items-center text-muted-foreground">
                <Clock className="h-16 w-16 mb-2" />
                <div className="text-lg font-medium">Ready to start</div>
                <div className="text-sm">Click "Start Ingestion" to begin the process</div>
              </div>
            )}

            {status === "in-progress" && (
              <div className="flex flex-col items-center">
                <div className="relative h-16 w-16 mb-2">
                  <div className="absolute inset-0 rounded-full border-4 border-muted-foreground border-opacity-20"></div>
                  <div
                    className="absolute inset-0 rounded-full border-4 border-primary border-opacity-80"
                    style={{
                      clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)`,
                      animation: "spin 2s linear infinite",
                    }}
                  ></div>
                </div>
                <div className="text-lg font-medium">Processing data</div>
                <div className="text-sm text-muted-foreground">Please wait while we transfer your data</div>
              </div>
            )}

            {status === "completed" && result && (
              <div className="flex flex-col items-center text-green-600">
                <CheckCircle className="h-16 w-16 mb-2" />
                <div className="text-lg font-medium">Ingestion Completed</div>
                <div className="text-sm">Successfully transferred {result.count.toLocaleString()} records</div>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center text-red-600">
                <AlertCircle className="h-16 w-16 mb-2" />
                <div className="text-lg font-medium">Ingestion Failed</div>
                <div className="text-sm">Please check the error message and try again</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
