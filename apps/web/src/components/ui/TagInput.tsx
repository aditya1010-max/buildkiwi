import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import "./TagInput.css";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
  className?: string;
}

export default function TagInput({
  value,
  onChange,
  suggestions = [],
  placeholder = "Add tags...",
  maxTags,
  disabled = false,
  className = "",
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = useMemo(() => {
    const query = inputValue.trim().toLowerCase();

    return suggestions.filter((suggestion) => {
      const alreadySelected = value.some(
        (tag) => tag.toLowerCase() === suggestion.toLowerCase(),
      );

      if (alreadySelected) {
        return false;
      }

      if (!query) {
        return true;
      }

      return suggestion.toLowerCase().includes(query);
    });
  }, [inputValue, suggestions, value]);

  const trimmedInput = inputValue.trim();

  const canCreateTag =
    trimmedInput.length > 0 &&
    filteredSuggestions.length === 0 &&
    !value.some((tag) => tag.toLowerCase() === trimmedInput.toLowerCase());

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function addTag(tag: string) {
    const normalizedTag = tag.trim();

    if (!normalizedTag || disabled) {
      return;
    }

    if (maxTags !== undefined && value.length >= maxTags) {
      return;
    }

    const alreadySelected = value.some(
      (existingTag) =>
        existingTag.toLowerCase() === normalizedTag.toLowerCase(),
    );

    if (alreadySelected) {
      return;
    }

    onChange([...value, normalizedTag]);

    setInputValue("");
    setHighlightedIndex(0);
    setOpen(false);

    inputRef.current?.focus();
  }

  function removeTag(tagToRemove: string) {
    if (disabled) {
      return;
    }

    onChange(
      value.filter((tag) => tag.toLowerCase() !== tagToRemove.toLowerCase()),
    );
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const optionCount = filteredSuggestions.length + (canCreateTag ? 1 : 0);

    if (event.key === "ArrowDown") {
      if (optionCount === 0) {
        return;
      }

      event.preventDefault();
      setOpen(true);

      setHighlightedIndex((current) =>
        current < optionCount - 1 ? current + 1 : 0,
      );

      return;
    }

    if (event.key === "ArrowUp") {
      if (optionCount === 0) {
        return;
      }

      event.preventDefault();
      setOpen(true);

      setHighlightedIndex((current) =>
        current > 0 ? current - 1 : optionCount - 1,
      );

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      const highlightedSuggestion = filteredSuggestions[highlightedIndex];

      if (highlightedSuggestion) {
        addTag(highlightedSuggestion);
        return;
      }

      if (canCreateTag && highlightedIndex === filteredSuggestions.length) {
        addTag(trimmedInput);
      }

      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    if (event.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  }

  const classes = [
    "ui-tag-input",
    disabled ? "ui-tag-input--disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const canAddMore = maxTags === undefined || value.length < maxTags;

  const showSuggestions =
    open && !disabled && (filteredSuggestions.length > 0 || canCreateTag);

  return (
    <div ref={containerRef} className={classes}>
      <div
        className="ui-tag-input__control"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="ui-tag-input__tags">
          {value.map((tag) => (
            <span key={tag} className="ui-tag-input__tag">
              <span className="ui-tag-input__tag-label">{tag}</span>

              <button
                type="button"
                className="ui-tag-input__tag-remove"
                onClick={(event) => {
                  event.stopPropagation();
                  removeTag(tag);
                }}
                aria-label={`Remove ${tag}`}
                disabled={disabled}
              >
                ×
              </button>
            </span>
          ))}

          {canAddMore && (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              placeholder={value.length === 0 ? placeholder : ""}
              disabled={disabled}
              className="ui-tag-input__input"
              onChange={(event) => {
                setInputValue(event.target.value);
                setHighlightedIndex(0);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              aria-autocomplete="list"
              aria-expanded={showSuggestions}
            />
          )}
        </div>
      </div>

      {showSuggestions && (
        <div className="ui-tag-input__dropdown" role="listbox">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              role="option"
              aria-selected={index === highlightedIndex}
              className={[
                "ui-tag-input__suggestion",
                index === highlightedIndex
                  ? "ui-tag-input__suggestion--highlighted"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onMouseDown={(event) => {
                event.preventDefault();
                addTag(suggestion);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {suggestion}
            </button>
          ))}

          {canCreateTag && (
            <button
              type="button"
              role="option"
              aria-selected={highlightedIndex === filteredSuggestions.length}
              className={[
                "ui-tag-input__suggestion",
                highlightedIndex === filteredSuggestions.length
                  ? "ui-tag-input__suggestion--highlighted"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onMouseDown={(event) => {
                event.preventDefault();
                addTag(trimmedInput);
              }}
              onMouseEnter={() =>
                setHighlightedIndex(filteredSuggestions.length)
              }
            >
              Create "{trimmedInput}"
            </button>
          )}
        </div>
      )}
    </div>
  );
}
