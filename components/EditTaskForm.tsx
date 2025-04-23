import type React from 'react';
import { Button } from "@/components/ui/button";
import { TaskNameInput } from "@/components/TaskNameInput";
import { EstimatedTimeInput } from "@/components/EstimatedTimeInput";
import { TimeUnitSelect } from "@/components/TimeUnitSelect";
import { TimeCodeSelect } from "@/components/TimeCodeSelect";

interface Task {
	id: string;
	name: string;
	estimatedTime: number;
	timeUnit: "Minutes" | "Hours" | "Days";
	code?: string;
}

interface EditTaskFormProps {
    task: Task;
    availableCodes: string[];
    editingTaskName: string;
    setEditingTaskName: (name: string) => void;
    editingEstimatedTime: string;
    setEditingEstimatedTime: (time: string) => void;
    editingTimeUnit: Task["timeUnit"];
    setEditingTimeUnit: (unit: Task["timeUnit"]) => void;
    editingSelectedCode: string;
    setEditingSelectedCode: (code: string) => void;
    handleUpdateTask: () => void;
    onCancelEdit: () => void;
}

export const EditTaskForm: React.FC<EditTaskFormProps> = ({
    task,
    availableCodes,
    editingTaskName,
    setEditingTaskName,
    editingEstimatedTime,
    setEditingEstimatedTime,
    editingTimeUnit,
    setEditingTimeUnit,
    editingSelectedCode,
    setEditingSelectedCode,
    handleUpdateTask,
    onCancelEdit,
}) => {
    return (
        <div className="flex flex-col space-y-2 w-full">
            <TaskNameInput value={editingTaskName} onChange={setEditingTaskName} />
            <TimeCodeSelect availableCodes={availableCodes} value={editingSelectedCode} onValueChange={setEditingSelectedCode} />
            <div className="flex flex-col sm:flex-row sm:gap-4">
                <EstimatedTimeInput value={editingEstimatedTime} onChange={setEditingEstimatedTime} />
                <TimeUnitSelect value={editingTimeUnit} onValueChange={setEditingTimeUnit} />
            </div>
            <div className="flex justify-end space-x-2">
                <Button size="sm" onClick={handleUpdateTask}>Save</Button>
                <Button size="sm" variant="outline" onClick={onCancelEdit}>Cancel</Button>
            </div>
        </div>
    );
};