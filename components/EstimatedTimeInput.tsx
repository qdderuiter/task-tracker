"use client";

import type React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EstimatedTimeInputProps {
	value: string;
	onChange: (value: string) => void;
}

export function EstimatedTimeInput({ value, onChange }: EstimatedTimeInputProps) {
	return (
		<div className="flex-grow space-y-2">
			<Label htmlFor="estimatedTime" className="cursor-pointer">
				Estimated Time
			</Label>
			<Input
				id="estimatedTime"
				type="number"
				value={value}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					onChange(e.target.value)
				}
				placeholder="e.g., 4"
				min="1"
				required
			/>
		</div>
	);
}