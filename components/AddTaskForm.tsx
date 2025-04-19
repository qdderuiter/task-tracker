"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  name: string;
  estimatedTime: number;
  timeUnit: "Hours" | "Days";
}

export function AddTaskForm({ onAddTask }: { onAddTask: (task: Task) => void }) {
  const [taskName, setTaskName] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [timeUnit, setTimeUnit] = useState<"Hours" | "Days">("Hours");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const time = parseInt(estimatedTime, 10);
    if (taskName && !isNaN(time) && time > 0) {
      onAddTask({
        name: taskName,
        estimatedTime: time,
        timeUnit: timeUnit,
      });
      // Reset form
      setTaskName("");
      setEstimatedTime("");
      setTimeUnit("Hours");
    } else {
      // Basic validation feedback (can be improved)
      alert("Please fill in all fields correctly. Estimated time must be a positive number.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
      <div className="space-y-2">
        <Label htmlFor="taskName">Task Name/Description</Label>
        <Input
          id="taskName"
          value={taskName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaskName(e.target.value)}
          placeholder="Enter task name or description"
          required
        />
      </div>
      {/* Use Flexbox for responsive layout of time and unit */}
      <div className="flex flex-col sm:flex-row sm:gap-4">
         {/* Time Input - takes more space on larger screens */}
         <div className="flex-grow space-y-2">
           <Label htmlFor="estimatedTime">Estimated Time</Label>
           <Input
             id="estimatedTime"
             type="number"
             value={estimatedTime}
             onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEstimatedTime(e.target.value)}
             placeholder="e.g., 4"
             min="1"
             required
           />
         </div>
        {/* Unit Select - fixed width on larger screens */}
        <div className="sm:w-1/3 space-y-2">
          <Label htmlFor="timeUnit">Unit</Label>
          <Select value={timeUnit} onValueChange={(value: "Hours" | "Days") => setTimeUnit(value)}>
            <SelectTrigger id="timeUnit" className="w-full"> {/* Ensure trigger takes full width */}
               <SelectValue placeholder="Select unit" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="Hours">Hours</SelectItem>
               <SelectItem value="Days">Days</SelectItem>
             </SelectContent>
           </Select>
         </div>
      </div>
      <Button type="submit">Add Task</Button>
    </form>
  );
}