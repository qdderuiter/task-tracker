"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TimeCodeSelectProps {
	availableCodes: string[];
	value: string;
	onValueChange: (value: string) => void;
}

export function TimeCodeSelect({ availableCodes, value, onValueChange }: TimeCodeSelectProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor="taskCode">Time Code (Optional)</Label>
			<Select value={value} onValueChange={(val) => onValueChange(val === "no-code" ? "" : val)}>
				<SelectTrigger id="taskCode" className="w-full">
					<SelectValue placeholder="Select a code..." />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="no-code">
						_No Code_
					</SelectItem>
					{availableCodes.map((code) => (
						<SelectItem key={code} value={code}>
							{code}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}