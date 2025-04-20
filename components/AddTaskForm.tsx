"use client";

import type React from "react";
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

type TimeUnit = "Minutes" | "Hours" | "Days";

interface Task {
	name: string;
	estimatedTime: number;
	timeUnit: TimeUnit;
	code?: string; // Add optional code field
}

export function AddTaskForm({
	onAddTask,
	availableCodes, // Add prop for codes
}: {
	onAddTask: (task: Task) => void;
	availableCodes: string[]; // Define prop type
}) {
	const [taskName, setTaskName] = useState("");
	const [estimatedTime, setEstimatedTime] = useState("");
	const [timeUnit, setTimeUnit] = useState<TimeUnit>("Minutes");
	const [selectedCode, setSelectedCode] = useState<string>(""); // State for selected code

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const time = Number.parseInt(estimatedTime, 10);
		if (taskName && !Number.isNaN(time) && time > 0) {
			onAddTask({
				name: taskName,
				estimatedTime: time,
				timeUnit: timeUnit,
				code: selectedCode || undefined, // Include selected code (or undefined if empty)
			});
			// Reset form
			setTaskName("");
			setEstimatedTime("");
			setTimeUnit("Minutes"); // Reset to Minutes
			setSelectedCode(""); // Reset code
		} else {
			// Basic validation feedback (can be improved)
			alert(
				"Please fill in all fields correctly. Estimated time must be a positive number.",
			);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
			<div className="space-y-2">
				<Label htmlFor="taskName" className="cursor-pointer">
					Task Name/Description
				</Label>
				<Input
					id="taskName"
					value={taskName}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setTaskName(e.target.value)
					}
					placeholder="Enter task name or description"
					required
				/>
			</div>

			{/* Code Selection Dropdown */}
			<div className="space-y-2">
				<Label htmlFor="taskCode">Time Code (Optional)</Label>
				<Select value={selectedCode} onValueChange={(value) => setSelectedCode(value === "no-code" ? "" : value)}> {/* Update onValueChange */}
					<SelectTrigger id="taskCode" className="w-full">
						<SelectValue placeholder="Select a code..." />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="no-code"> {/* Change value to "no-code" */}
							_No Code_
						</SelectItem>
						{availableCodes.map((code) => (
							<SelectItem key={code} value={code}>
								{code}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-col sm:flex-row sm:gap-4">
				<div className="flex-grow space-y-2">
					<Label htmlFor="estimatedTime" className="cursor-pointer">
						Estimated Time
					</Label>
					<Input
						id="estimatedTime"
						type="number"
						value={estimatedTime}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setEstimatedTime(e.target.value)
						}
						placeholder="e.g., 4"
						min="1"
						required
					/>
				</div>
				<div className="sm:w-1/3 space-y-2">
					<Label className="cursor-pointer" htmlFor="timeUnit">
						Unit
					</Label>
					<Select
						value={timeUnit}
						onValueChange={(value: "Minutes" | "Hours" | "Days") =>
							setTimeUnit(value)
						}
					>
						<SelectTrigger id="timeUnit" className="w-full">
							<SelectValue placeholder="Select unit" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Minutes">Minutes</SelectItem>
							<SelectItem value="Hours">Hours</SelectItem>
							<SelectItem value="Days">Days</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
			<Button className="cursor-pointer" type="submit">
				Add Task
			</Button>
		</form>
	);
}
