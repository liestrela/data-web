import { useState } from "react";
import { Calendar as ReactCalendar } from "react-calendar";
import type { DateValue } from "../types";

import "../styles/calendar.css";

interface CalendarProps {
	date: DateValue;
	onChange: (date: DateValue) => void;
}

export function Calendar({
	date,
	onChange
}: CalendarProps) {
	return (
		<div className="calendar">
			<ReactCalendar
				onChange={onChange}
				locale="pt-BR"
				value={date}
			/>
		</div>
	);
}

export default Calendar;
