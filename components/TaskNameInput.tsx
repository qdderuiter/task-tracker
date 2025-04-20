"use client";

import type React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TaskNameInputProps {
	value: string;
	onChange: (value: string) => void;
}

export function TaskNameInput({ value, onChange }: TaskNameInputProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor="taskName" className="cursor-pointer">
				Task Name/Description
			</Label>
			<Input
				id="taskName"
				value={value}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					onChange(e.target.value)
				}
				placeholder="Enter task name or description"
				required
			/>
		</div>
	);
}