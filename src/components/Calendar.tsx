import { useState } from "react";
import { Calendar as ReactCalendar } from "react-calendar";

import "../styles/calendar.css";

type DateValuePiece = Date | null;
type DateValue = DateValuePiece | [DateValuePiece, DateValuePiece];

export function Calendar() {
	const [date, setDate] = useState<DateValue>(new Date());

	return (
		<div className="calendar">
			<ReactCalendar
				onChange={setDate}
				locale="pt-BR"
				value={date}
			/>
		</div>
	);
}
