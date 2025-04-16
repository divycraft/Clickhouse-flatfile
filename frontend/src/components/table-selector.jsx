"use client"

import { Card, CardContent } from "./ui/card"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"

/**
 * Table selector component
 * @param {Object} props - Component props
 * @param {string[]} props.availableTables - List of available tables
 * @param {string[]} props.selectedTables - List of selected tables
 * @param {Function} props.onSelectTables - Callback when tables are selected
 * @param {string} props.joinCondition - The join condition for multiple tables
 * @param {Function} props.onJoinConditionChange - Callback when join condition changes
 */
export default function TableSelector({
  availableTables,
  selectedTables,
  onSelectTables,
  joinCondition,
  onJoinConditionChange,
}) {
  const handleTableToggle = (table) => {
    const newSelection = selectedTables.includes(table)
      ? selectedTables.filter((t) => t !== table)
      : [...selectedTables, table]

    onSelectTables(newSelection)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base">Available Tables</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Select the tables you want to include in the data transfer
            </p>

            <ScrollArea className="h-60 border rounded-md p-4">
              {availableTables.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No tables available</p>
              ) : (
                <div className="space-y-2">
                  {availableTables.map((table) => (
                    <div key={table} className="flex items-center space-x-2">
                      <Checkbox
                        id={`table-${table}`}
                        checked={selectedTables.includes(table)}
                        onCheckedChange={() => handleTableToggle(table)}
                      />
                      <Label htmlFor={`table-${table}`} className="cursor-pointer">
                        {table}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {selectedTables.length > 1 && (
            <div className="space-y-2">
              <Label htmlFor="join-condition">JOIN Condition</Label>
              <Input
                id="join-condition"
                placeholder="e.g., table1.id = table2.table1_id"
                value={joinCondition}
                onChange={(e) => onJoinConditionChange(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Specify how to join multiple tables (e.g., table1.id = table2.table1_id)
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
