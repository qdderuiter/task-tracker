"use client"; // Required for useState and useMemo

import { useState, useMemo } from "react"; // Import useMemo
import { AddTaskForm } from "@/components/AddTaskForm"; // Import the form

// Define the Task interface (can be moved to a types file later)
interface Task {
  id?: string; // Make id optional since it's generated after form submission
  name: string;
  estimatedTime: number;
  timeUnit: "Hours" | "Days";
}

const HOURS_PER_DAY = 8; // Define conversion rate

export default function Home() {
  // State to hold the list of tasks
  const [tasks, setTasks] = useState<Task[]>([]);

  // Function to add a new task to the list
  const handleAddTask = (newTask: Task) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      { ...newTask, id: crypto.randomUUID() }, // Assign a unique id
    ]);
  };

  // Calculate total estimated time in hours using useMemo
  const totalEstimatedHours = useMemo(() => {
    return tasks.reduce((total, task) => {
      const timeInHours =
        task.timeUnit === "Days"
          ? task.estimatedTime * HOURS_PER_DAY
          : task.estimatedTime;
      return total + timeInHours;
    }, 0);
  }, [tasks]); // Recalculate only when tasks change

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
          <> {/* Use Fragment to group list and total */}
            <ul className="space-y-2 mb-4"> {/* Add margin bottom to list */}
              {tasks.map((task, index) => (
                <li key={task.id} className="p-2 border rounded">
                  {task.name} - {task.estimatedTime} {task.timeUnit}
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
