"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"
import { Upload } from "lucide-react"

/**
 * @typedef {Object} FlatFileConfig
 * @property {string} fileName - The name of the file
 * @property {string} delimiter - The delimiter used in the file
 */

/**
 * Flat file form component
 * @param {Object} props - Component props
 * @param {FlatFileConfig} props.config - The flat file configuration
 * @param {Function} props.onChange - Callback when configuration changes
 * @param {boolean} props.isTarget - Whether this is a target file (true) or source file (false)
 */
export default function FlatFileForm({ config, onChange, isTarget }) {
  const handleChange = (field, value) => {
    onChange({
      ...config,
      [field]: value,
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleChange("fileName", file.name)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Flat File {isTarget ? "Target" : "Source"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">File {isTarget ? "Name" : "Upload"}</Label>
            <div className="flex gap-2">
              <Input
                id="fileName"
                placeholder="data.csv"
                value={config.fileName}
                onChange={(e) => handleChange("fileName", e.target.value)}
                className="flex-1"
              />
              {!isTarget && (
                <div className="relative">
                  <Button variant="outline" className="relative">
                    <Upload className="h-4 w-4 mr-2" />
                    Browse
                    <Input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                    />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delimiter">Delimiter</Label>
            <Select value={config.delimiter} onValueChange={(value) => handleChange("delimiter", value)}>
              <SelectTrigger id="delimiter">
                <SelectValue placeholder="Select delimiter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=",">Comma (,)</SelectItem>
                <SelectItem value="\t">Tab</SelectItem>
                <SelectItem value="|">Pipe (|)</SelectItem>
                <SelectItem value=";">Semicolon (;)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
