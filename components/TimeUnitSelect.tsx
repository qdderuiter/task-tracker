"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type TimeUnit = "Minutes" | "Hours" | "Days";

interface TimeUnitSelectProps {
	value: TimeUnit;
	onValueChange: (value: TimeUnit) => void;
}

export function TimeUnitSelect({ value, onValueChange }: TimeUnitSelectProps) {
	return (
		<div className="sm:w-1/3 space-y-2">
			<Label className="cursor-pointer" htmlFor="timeUnit">
				Unit
			</Label>
			<Select
				value={value}
				onValueChange={onValueChange}
			>
				<SelectTrigger id="timeUnit" className="w-full">
					<SelectValue placeholder="Select unit" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="Minutes">Minutes</SelectItem>
					<SelectItem value="Hours">Hours</SelectItem>
					<SelectItem value="Days">Days</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}