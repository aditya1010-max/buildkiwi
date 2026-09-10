import type { InputHTMLAttributes, ReactNode } from "react";

import "./Input.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

export default function Input({
  label,
  hint,
  error,
  startAdornment,
  endAdornment,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  const classes = [
    "ui-input",
    error ? "ui-input--error" : "",
    startAdornment ? "ui-input--has-start" : "",
    endAdornment ? "ui-input--has-end" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="ui-input-field">
      {label && (
        <label className="ui-input-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className="ui-input-field__control">
        {startAdornment && (
          <span className="ui-input-field__adornment ui-input-field__adornment--start">
            {startAdornment}
          </span>
        )}

        <input {...props} id={inputId} className={classes} />

        {endAdornment && (
          <span className="ui-input-field__adornment ui-input-field__adornment--end">
            {endAdornment}
          </span>
        )}
      </div>

      {error ? (
        <span className="ui-input-field__message ui-input-field__message--error">
          {error}
        </span>
      ) : (
        hint && <span className="ui-input-field__message">{hint}</span>
      )}
    </div>
  );
}
