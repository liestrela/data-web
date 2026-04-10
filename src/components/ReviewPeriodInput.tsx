import type { TimeUnit, ReviewPeriod } from "../types";

interface ReviewPeriodInputProps {
  period: ReviewPeriod;
  onChange: (period: ReviewPeriod) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function ReviewPeriodInput({
  period,
  onChange,
  onRemove,
  canRemove,
}: ReviewPeriodInputProps) {
  return (
    <div className="review-period">
      <span>Daqui a</span>
      <input
        className="many-input"
        min="1"
        type="number"
        name="many"
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
      {canRemove && (
        <button
          type="button"
          className="remove-btn"
          onClick={onRemove}
          title="Remover período"
        >
          X
        </button>
      )}
    </div>
  );
}
