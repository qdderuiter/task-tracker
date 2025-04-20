"use client";

import { useState, useMemo, useEffect } from "react"; // Import useEffect
import { AddTaskForm } from "@/components/AddTaskForm";
import { Button } from "@/components/ui/button"; // Import Button

// Define predefined time tracking codes
const TIME_TRACKING_CODES = ["DEV", "MEETING", "ADMIN", "TESTING", "DOCS"];

interface Task {
	id?: string;
	name: string;
	estimatedTime: number;
	timeUnit: "Minutes" | "Hours" | "Days";
	code?: string; // Add optional code field
}

const HOURS_PER_DAY = 8;

export default function Home() {
	// Initialize tasks state as an empty array
	const [tasks, setTasks] = useState<Task[]>([]);

	// Load tasks from localStorage on component mount
	useEffect(() => {
		if (typeof window !== "undefined") {
			const savedTasks = localStorage.getItem("tasks");
			if (savedTasks) {
				setTasks(JSON.parse(savedTasks));
			}
		}
	}, []); // Empty dependency array ensures this runs only once on mount

	// Save tasks to localStorage whenever the tasks state changes
	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("tasks", JSON.stringify(tasks));
		}
	}, [tasks]); // This effect runs whenever tasks state changes

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

			{/* Pass the codes to the form */}
			<AddTaskForm onAddTask={handleAddTask} availableCodes={TIME_TRACKING_CODES} />

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
										{/* Display code if it exists */}
										{task.code && <span className="font-mono bg-gray-200 px-1 rounded mr-2">{task.code}</span>}
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
