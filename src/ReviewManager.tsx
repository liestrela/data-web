export function ReviewManager() {
	return (
		<div className="review-manager">
			<form className="review-form">
				<div className="subject-input">
					<input
						type="text"
						name="subject"
						placeholder="O que eu estudei hoje?"
					/>
					<button type="submit" className="save-btn">
						Salvar
					</button>
				</div>
				<span className="review-header">
					Devo revisar isso
				</span>
				<div className="review-period">
					<span>Daqui</span>
					<input
						className="many-input"
						defaultValue="3"
						min="1"
						type="number"
						name="many"
					/>
					<select
						className="unit-input"
						defaultValue="dias"
						name="unit"
					>
						<option>horas</option>
						<option>dias</option>
						<option>semanas</option>
						<option>meses</option>
					</select>
				</div>
			</form>
		</div>
	);
}
