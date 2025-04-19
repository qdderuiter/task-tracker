"use client"; // Required for useState

import { useState } from "react";
import { AddTaskForm } from "@/components/AddTaskForm"; // Import the form

// Define the Task interface (can be moved to a types file later)
interface Task {
  name: string;
  estimatedTime: number;
  timeUnit: "Hours" | "Days";
}

export default function Home() {
  // State to hold the list of tasks
  const [tasks, setTasks] = useState<Task[]>([]);

  // Function to add a new task to the list
  const handleAddTask = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Tracker</h1>

      {/* Render the Add Task Form */}
      <AddTaskForm onAddTask={handleAddTask} />

      {/* Display the list of tasks */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks added yet.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task, index) => (
              <li key={index} className="p-2 border rounded">
                {task.name} - {task.estimatedTime} {task.timeUnit}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
