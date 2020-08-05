import React from 'react';

// Irk, sorry, I don’t know how to type that
// eslint-disable-next-line react/prop-types
export default function NumberInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <input
      className="p-1 w-12"
      value={value}
      type="number"
      onChange={(event) => onChange(event.target.valueAsNumber)}
    />
  );
}
