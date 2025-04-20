"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TaskNameInput } from "@/components/TaskNameInput"; // Import TaskNameInput
import { EstimatedTimeInput } from "@/components/EstimatedTimeInput"; // Import EstimatedTimeInput
import { TimeUnitSelect } from "@/components/TimeUnitSelect"; // Import TimeUnitSelect
import { TimeCodeSelect } from "@/components/TimeCodeSelect"; // Import TimeCodeSelect

// Remove unused imports: Input, Label, Select components, TimeUnit type

interface Task {
	name: string;
	estimatedTime: number;
	timeUnit: "Minutes" | "Hours" | "Days"; // Keep TimeUnit definition here or import if moved
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
	const [timeUnit, setTimeUnit] = useState<Task["timeUnit"]>("Minutes"); // Use Task["timeUnit"]
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
			{/* Use TaskNameInput component */}
			<TaskNameInput value={taskName} onChange={setTaskName} />

			{/* Use TimeCodeSelect component */}
			<TimeCodeSelect availableCodes={availableCodes} value={selectedCode} onValueChange={setSelectedCode} />

			<div className="flex flex-col sm:flex-row sm:gap-4">
				{/* Use EstimatedTimeInput component */}
				<EstimatedTimeInput value={estimatedTime} onChange={setEstimatedTime} />

				{/* Use TimeUnitSelect component */}
				<TimeUnitSelect value={timeUnit} onValueChange={setTimeUnit} />
			</div>

			<Button className="cursor-pointer" type="submit">
				Add Task
			</Button>
		</form>
	);
}
