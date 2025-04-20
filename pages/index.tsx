"use client";

import { useState, useMemo, useEffect } from "react"; // Import useEffect
import { AddTaskForm } from "@/components/AddTaskForm";
import { Button } from "@/components/ui/button"; // Import Button
import { TaskNameInput } from "@/components/TaskNameInput"; // Import TaskNameInput
import { EstimatedTimeInput } from "@/components/EstimatedTimeInput"; // Import EstimatedTimeInput
import { TimeUnitSelect } from "@/components/TimeUnitSelect"; // Import TimeUnitSelect
import { TimeCodeSelect } from "@/components/TimeCodeSelect"; // Import TimeCodeSelect

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
	const [editingTaskId, setEditingTaskId] = useState<string | null>(null); // State to track the task being edited
	const [editingTaskName, setEditingTaskName] = useState(""); // State for editing task name
	const [editingEstimatedTime, setEditingEstimatedTime] = useState(""); // State for editing estimated time
	const [editingTimeUnit, setEditingTimeUnit] = useState<Task["timeUnit"]>("Minutes"); // State for editing time unit
	const [editingSelectedCode, setEditingSelectedCode] = useState<string>(""); // State for editing selected code


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

	// Populate editing state when editingTaskId changes
	useEffect(() => {
		if (editingTaskId) {
			const taskToEdit = tasks.find(task => task.id === editingTaskId);
			if (taskToEdit) {
				setEditingTaskName(taskToEdit.name);
				setEditingEstimatedTime(taskToEdit.estimatedTime.toString());
				setEditingTimeUnit(taskToEdit.timeUnit);
				setEditingSelectedCode(taskToEdit.code || "");
			}
		}
	}, [editingTaskId, tasks]); // Rerun when editingTaskId or tasks change

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

	// Function to handle updating a task
	const handleUpdateTask = () => {
		if (!editingTaskId) return;

		const time = Number.parseInt(editingEstimatedTime, 10);

		if (editingTaskName && !Number.isNaN(time) && time > 0) {
			setTasks((prevTasks) =>
				prevTasks.map((task) =>
					task.id === editingTaskId
						? {
								...task,
								name: editingTaskName,
								estimatedTime: time,
								timeUnit: editingTimeUnit,
								code: editingSelectedCode || undefined,
						  }
						: task,
				),
			);
			setEditingTaskId(null); // Exit editing mode
		} else {
			alert("Please fill in all fields correctly. Estimated time must be a positive number.");
		}
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
									className="flex flex-col space-y-2 p-2 border rounded" // Use flex-col for stacking in edit mode
								>
									{editingTaskId === task.id ? (
										// Inline Edit Form
										<div className="flex flex-col space-y-2 w-full">
										{/* Use TaskNameInput component for editing */}
										<TaskNameInput value={editingTaskName} onChange={setEditingTaskName} />

										{/* Use TimeCodeSelect component for editing */}
										<TimeCodeSelect availableCodes={TIME_TRACKING_CODES} value={editingSelectedCode} onValueChange={setEditingSelectedCode} />

										<div className="flex flex-col sm:flex-row sm:gap-4">
											{/* Use EstimatedTimeInput component for editing */}
											<EstimatedTimeInput value={editingEstimatedTime} onChange={setEditingEstimatedTime} />

											{/* Use TimeUnitSelect component for editing */}
											<TimeUnitSelect value={editingTimeUnit} onValueChange={setEditingTimeUnit} />
										</div>

											<div className="flex justify-end space-x-2"> {/* Group buttons */}
												<Button size="sm" onClick={handleUpdateTask}>Save</Button> {/* Call handleUpdateTask */}
												<Button size="sm" variant="outline" onClick={() => setEditingTaskId(null)}>Cancel</Button>
											</div>
										</div>
									) : (
										// Display Task Details
										<div className="flex justify-between items-center w-full">
											<span>
												{/* Display code if it exists */}
												{task.code && <span className="font-mono bg-gray-200 px-1 rounded mr-2">{task.code}</span>}
												{task.name} - {task.estimatedTime} {task.timeUnit}
											</span>
											<div className="flex space-x-2"> {/* Group buttons */}
												<Button
													size="sm"
													variant="outline"
													className="cursor-pointer"
													onClick={() => { // Add check for task.id
													if (task.id) {
														setEditingTaskId(task.id); // Set task to be edited
													}
												}}
												>
													Edit
												</Button>
												<Button
													variant="destructive"
													size="sm"
													className="cursor-pointer"
													onClick={() => {
														if (task.id) {
															handleDeleteTask(task.id);
														}
													}}
												>
													Delete
												</Button>
											</div>
										</div>
									)}
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
