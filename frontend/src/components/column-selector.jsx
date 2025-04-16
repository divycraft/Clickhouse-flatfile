"use client"

import { Card, CardContent } from "./ui/card"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Input } from "./ui/input"
import { Search } from "lucide-react"
import { useState } from "react"

/**
 * @typedef {Object} Column
 * @property {string} name - The column name
 * @property {boolean} selected - Whether the column is selected
 */

/**
 * Column selector component
 * @param {Object} props - Component props
 * @param {Column[]} props.columns - List of columns
 * @param {Function} props.onChange - Callback when column selection changes
 */
export default function ColumnSelector({ columns, onChange }) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleColumnToggle = (columnName) => {
    const newColumns = columns.map((col) => (col.name === columnName ? { ...col, selected: !col.selected } : col))
    onChange(newColumns)
  }

  const handleSelectAll = () => {
    const newColumns = columns.map((col) => ({ ...col, selected: true }))
    onChange(newColumns)
  }

  const handleDeselectAll = () => {
    const newColumns = columns.map((col) => ({ ...col, selected: false }))
    onChange(newColumns)
  }

  const filteredColumns = columns.filter((col) => col.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={handleDeselectAll}>
              Deselect All
            </Button>
          </div>

          <ScrollArea className="h-60 border rounded-md p-4">
            {filteredColumns.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No columns match your search</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredColumns.map((column) => (
                  <div key={column.name} className="flex items-center space-x-2">
                    <Checkbox
                      id={`column-${column.name}`}
                      checked={column.selected}
                      onCheckedChange={() => handleColumnToggle(column.name)}
                    />
                    <Label
                      htmlFor={`column-${column.name}`}
                      className="cursor-pointer text-sm truncate"
                      title={column.name}
                    >
                      {column.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="text-sm text-muted-foreground">
            {columns.filter((col) => col.selected).length} of {columns.length} columns selected
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
