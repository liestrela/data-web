import { useState } from "react";
import { Calendar as ReactCalendar } from "react-calendar";
import type { DateValue } from "../types";

import "../styles/calendar.css";

interface CalendarProps {
	date: DateValue;
	onChange: (date: DateValue) => void;
	tileClassName: ({date, view}: {date: Date, view: string}) => string;
}

export function Calendar({
	date,
	onChange,
	tileClassName
}: CalendarProps) {
	return (
		<div className="calendar">
			<ReactCalendar
				onChange={onChange}
				tileClassName={tileClassName}
				locale="pt-BR"
				value={date}
			/>
		</div>
	);
}

export default Calendar;
