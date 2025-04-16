"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

/**
 * @typedef {Object} ClickHouseConfig
 * @property {string} host - The ClickHouse server host
 * @property {string} port - The ClickHouse server port
 * @property {string} database - The database name
 * @property {string} user - The username
 * @property {string} token - The JWT token for authentication
 */

/**
 * ClickHouse connection form component
 * @param {Object} props - Component props
 * @param {ClickHouseConfig} props.config - The ClickHouse configuration
 * @param {Function} props.onChange - Callback when configuration changes
 */
export default function ClickHouseConnectionForm({ config, onChange }) {
  const [protocol, setProtocol] = useState("https")

  const handleProtocolChange = (value) => {
    setProtocol(value)
    // Set default port based on protocol
    onChange({
      ...config,
      port: value === "https" ? "8443" : "8123",
    })
  }

  const handleChange = (field, value) => {
    onChange({
      ...config,
      [field]: value,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ClickHouse Connection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="protocol">Protocol</Label>
              <Select value={protocol} onValueChange={(value) => handleProtocolChange(value)}>
                <SelectTrigger id="protocol">
                  <SelectValue placeholder="Select protocol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="http">HTTP</SelectItem>
                  <SelectItem value="https">HTTPS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                placeholder={protocol === "https" ? "8443" : "8123"}
                value={config.port}
                onChange={(e) => handleChange("port", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="host">Host</Label>
            <Input
              id="host"
              placeholder="example.clickhouse.cloud"
              value={config.host}
              onChange={(e) => handleChange("host", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="database">Database</Label>
            <Input
              id="database"
              placeholder="default"
              value={config.database}
              onChange={(e) => handleChange("database", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user">User</Label>
            <Input
              id="user"
              placeholder="default"
              className="cursor-not-allowed"
              disabled
              value={config.user}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="token">JWT Token</Label>
            <Input
              id="token"
              type="password"
              placeholder="Enter your JWT token"
              className="cursor-not-allowed"
              disabled
              value={config.token}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
