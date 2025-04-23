"use client";

import { useState, useMemo, useEffect } from "react";
import { AddTaskForm } from "@/components/AddTaskForm";
import { Button } from "@/components/ui/button";
import { EditTaskForm } from "@/components/EditTaskForm";

const TIME_TRACKING_CODES = ["DEV", "MEETING", "ADMIN", "TESTING", "DOCS"];

interface Task {
	id: string;
	name: string;
	estimatedTime: number;
	timeUnit: "Minutes" | "Hours" | "Days";
	code?: string;
}

const HOURS_PER_DAY = 8;

export default function Home() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
	const [editingTaskName, setEditingTaskName] = useState("");
	const [editingEstimatedTime, setEditingEstimatedTime] = useState("");
	const [editingTimeUnit, setEditingTimeUnit] = useState<Task["timeUnit"]>("Minutes");
	const [editingSelectedCode, setEditingSelectedCode] = useState<string>("");

	useEffect(() => {
		if (typeof window !== "undefined") {
			const savedTasks = localStorage.getItem("tasks");
			if (savedTasks) {
				setTasks(JSON.parse(savedTasks));
			}
		}
	}, []);

	useEffect(() => {
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem("tasks", JSON.stringify(tasks));
			} catch (error) {
				console.error("Error saving tasks to localStorage:", error);
			}
		}
	}, [tasks]);

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
	}, [editingTaskId, tasks]);

	const handleAddTask = (newTask: Omit<Task, 'id'>) => {
		setTasks((prevTasks) => [
			...prevTasks,
			{ ...newTask, id: crypto.randomUUID() },
		]);
	};

	const handleUpdateTask = () => {
		if (!editingTaskId) return;

		const time = Number.parseInt(editingEstimatedTime, 10);

		if (editingTaskName.trim() === "" || Number.isNaN(time) || time <= 0) {
			console.error("Validation failed: Please fill in all fields correctly. Estimated time must be a positive number.");
			return;
		}

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
		setEditingTaskId(null);
	};

	const handleDeleteTask = (idToDelete: string) => {
		setTasks((prevTasks) => prevTasks.filter((task) => task.id !== idToDelete));
	};

	const totalEstimatedHours = useMemo(() => {
		return tasks.reduce((total, task) => {
			switch (task.timeUnit) {
				case "Days":
					return total + task.estimatedTime * HOURS_PER_DAY;
				case "Minutes":
					return total + task.estimatedTime / 60;
				default: // "Hours"
					return total + task.estimatedTime;
			}
		}, 0);
	}, [tasks]);

	return (
		<main className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Task Tracker</h1>

			<AddTaskForm onAddTask={handleAddTask} availableCodes={TIME_TRACKING_CODES} />

			<div className="mt-8">
				<h2 className="text-xl font-semibold mb-2">Tasks</h2>
				{tasks.length === 0 ? (
					<p>No tasks added yet.</p>
				) : (
					<>
						<ul className="space-y-2 mb-4">
							{tasks.map((task) => (
								<li
									key={task.id}
									className="flex flex-col space-y-2 p-2 border rounded"
								>
									{editingTaskId === task.id ? (
										<EditTaskForm
											task={task}
											availableCodes={TIME_TRACKING_CODES}
											editingTaskName={editingTaskName}
											setEditingTaskName={setEditingTaskName}
											editingEstimatedTime={editingEstimatedTime}
											setEditingEstimatedTime={setEditingEstimatedTime}
											editingTimeUnit={editingTimeUnit}
											setEditingTimeUnit={setEditingTimeUnit}
											editingSelectedCode={editingSelectedCode}
											setEditingSelectedCode={setEditingSelectedCode}
											handleUpdateTask={handleUpdateTask}
											onCancelEdit={() => setEditingTaskId(null)}
										/>
									) : (
										<div className="flex justify-between items-center w-full">
											<span>
												{task.code && <span className="font-mono bg-gray-200 px-1 rounded mr-2">{task.code}</span>}
												{task.name} - {task.estimatedTime} {task.timeUnit}
											</span>
											<div className="flex space-x-2">
												<Button
													size="sm"
													variant="outline"
													onClick={() => setEditingTaskId(task.id)}
												>
													Edit
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() => handleDeleteTask(task.id)}
												>
													Delete
												</Button>
											</div>
										</div>
									)}
								</li>
							))}
						</ul>
						<div className="text-lg font-medium border-t pt-4">
							Total Estimated Time: {totalEstimatedHours} hours
						</div>
					</>
				)}
			</div>
		</main>
	);
}
