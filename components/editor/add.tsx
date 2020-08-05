import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Irk, sorry, I don’t know how to type that
// eslint-disable-next-line react/prop-types
export default function Add({ action }) {
  return (
    <button type="button" className="btn btn-blue" onClick={() => action()}>
      <FontAwesomeIcon icon="plus-square" />
      Nouveau
    </button>
  );
}
