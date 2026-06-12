"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { MAX_MATCH_GOALS } from "@/lib/rules";

// Controlled goal input: accepts digits only, caps length at the number of
// digits in MAX_MATCH_GOALS and clamps the value to [0, MAX_MATCH_GOALS]. This
// stops letters/symbols from ever reaching the form (which previously produced
// NaN and broke the server action) and enforces a sane upper bound client-side.
const MAX_LENGTH = String(MAX_MATCH_GOALS).length;

export function ScoreInput({
  name,
  ariaLabel,
  defaultValue,
  disabled
}: {
  name: string;
  ariaLabel: string;
  defaultValue?: number | string;
  disabled?: boolean;
}) {
  const [value, setValue] = useState(defaultValue != null ? String(defaultValue) : "");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(/\D/g, "").slice(0, MAX_LENGTH);
    if (digits === "") {
      setValue("");
      return;
    }
    setValue(String(Math.min(Number(digits), MAX_MATCH_GOALS)));
  }

  return (
    <Input
      aria-label={ariaLabel}
      className="h-10 w-11 px-0 text-center text-base font-bold"
      disabled={disabled}
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={MAX_LENGTH}
      name={name}
      onChange={handleChange}
      required
      value={value}
    />
  );
}
