import { useState } from "react";

interface ReviewFilterProps {
  onChange: (value: string) => void;
}

export function ReviewFilter({ onChange }: ReviewFilterProps) {
  const [active, setActive] = useState("false");

  const select = (value: string) => {
    setActive(value);
    onChange(value);
  };

  return (
    <div className="filter-input-container">
      <span className="filter-label">Mostrar:</span>
      <div className="segmented-control">
        <button
          type="button"
          className={`segment${active === "false" ? " active" : ""}`}
          onClick={() => select("false")}
        >
          todas
        </button>
        <button
          type="button"
          className={`segment${active === "true" ? " active" : ""}`}
          onClick={() => select("true")}
        >
          por dia
        </button>
      </div>
    </div>
  );
}

export default ReviewFilter;
