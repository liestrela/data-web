import { useState } from "react";

interface ReviewFilterProps {
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function ReviewFilter({
	onChange,
}: ReviewFilterProps) {
	return (
		<div className="filter-input-container">
       		<span>Mostrar:</span>
			<select 
		 		className="filter-input"
		 		onChange={onChange}
	   		>
				<option value="false">todas</option>
		 		<option value="true">por dia</option>
	   		</select>
		</div>
	);
}

export default ReviewFilter;
