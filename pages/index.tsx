"use client";

import { useState, useMemo } from "react";
import { AddTaskForm } from "@/components/AddTaskForm";
import { Button } from "@/components/ui/button"; // Import Button

interface Task {
	id?: string;
	name: string;
	estimatedTime: number;
	timeUnit: "Minutes" | "Hours" | "Days";
}

const HOURS_PER_DAY = 8;

export default function Home() {
	const [tasks, setTasks] = useState<Task[]>([]);

	const handleAddTask = (newTask: Task) => {
		setTasks((prevTasks) => [
			...prevTasks,
			{ ...newTask, id: crypto.randomUUID() },
		]);
	};

	// Function to handle deleting a task
	const handleDeleteTask = (idToDelete: string) => {
		setTasks((prevTasks) => prevTasks.filter((task) => task.id !== idToDelete));
	};

	const totalEstimatedHours = useMemo(() => {
		return tasks.reduce((total, task) => {
			let timeInHours: number; // Explicitly type as number
			switch (task.timeUnit) {
				case "Days":
					timeInHours = task.estimatedTime * HOURS_PER_DAY;
					break;
				case "Minutes":
					timeInHours = task.estimatedTime / 60;
					break;
				// case "Hours": // Removed redundant case
				default:
					timeInHours = task.estimatedTime;
					break;
			}
			return total + timeInHours;
		}, 0);
	}, [tasks]);

	return (
		<main className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Task Tracker</h1>

			<AddTaskForm onAddTask={handleAddTask} />

			<div className="mt-8">
				<h2 className="text-xl font-semibold mb-2">Tasks</h2>
				{tasks.length === 0 ? (
					<p>No tasks added yet.</p>
				) : (
					<>
						{/* Use Fragment to group list and total */}
						<ul className="space-y-2 mb-4">
							{" "}
							{/* Add margin bottom to list */}
							{tasks.map((task) => (
								<li
									key={task.id}
									className="flex justify-between items-center p-2 border rounded"
								>
									<span>
										{task.name} - {task.estimatedTime} {task.timeUnit}
									</span>
									<Button
										variant="destructive"
										size="sm"
										className="cursor-pointer"
										onClick={() => {
											if (task.id) {
												// Check if id exists
												handleDeleteTask(task.id);
											}
										}}
									>
										Delete
									</Button>
								</li>
							))}
						</ul>
						{/* Display Total Estimated Time */}
						<div className="text-lg font-medium border-t pt-4">
							Total Estimated Time: {totalEstimatedHours} hours
						</div>
					</>
				)}
			</div>
		</main>
	);
}
