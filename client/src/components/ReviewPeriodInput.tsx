import type { TimeUnit, ReviewPeriod } from "../types";

interface ReviewPeriodInputProps {
  period: ReviewPeriod;
  onChange: (period: ReviewPeriod) => void;
  onRemove: () => void;
  canRemove: boolean;
  isRemoving?: boolean;
}

export function ReviewPeriodInput({
  period,
  onChange,
  onRemove,
  canRemove,
  isRemoving,
}: ReviewPeriodInputProps) {
  return (
    <div className={`review-period-group${isRemoving ? " removing" : ""}`}>
      <div className="review-period">
        <span>Daqui a</span>
        <input
          className="many-input"
          min="1"
          type="number"
          name="many"
          autoComplete="off"
          value={period.many}
          onChange={(e) => onChange({ ...period, many: Number(e.target.value) })}
        />
        <select
          className="unit-input"
          name="unit"
          value={period.unit}
          onChange={(e) =>
            onChange({ ...period, unit: e.target.value as TimeUnit })
          }
        >
          <option value="horas">horas</option>
          <option value="dias">dias</option>
          <option value="semanas">semanas</option>
          <option value="meses">meses</option>
        </select>
        <button
          type="button"
          className="remove-btn"
          onClick={onRemove}
          title="Remover período"
          disabled={!canRemove}
        >
          x
        </button>
      </div>
      <label className="recurrent-label">
        <input
          type="checkbox"
          checked={period.recurrent ?? false}
          onChange={(e) => onChange({ ...period, recurrent: e.target.checked })}
        />
        recorrente
      </label>
    </div>
  );
}

export default ReviewPeriodInput;
