import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Irk, sorry, I don’t know how to type that
// eslint-disable-next-line react/prop-types
export default function TextInput({ action, id, value }) {
  const onChange = (event) =>
    action({
      id,
      name: event.target.value,
    });

  return (
    <div className="border px-1 rounded flex items-stretch">
      <input
        className="flex-grow"
        value={value}
        type="text"
        onChange={onChange}
      />
      <span className="flex-none">
        <FontAwesomeIcon icon="pen" className="text-gray-400" />
      </span>
    </div>
  );
}
