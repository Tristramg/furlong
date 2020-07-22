import { AppProps } from 'next/app';
import React from 'react';
import '../styles/styles.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBolt,
  faBuilding,
  faRoad,
  faCheck,
  faTimes,
  faBed,
  faWeightHanging,
  faTrain,
  faArrowsAltH,
  faUtensils,
  faUser,
  faPlusSquare,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faBolt,
  faBuilding,
  faRoad,
  faCheck,
  faTimes,
  faBed,
  faWeightHanging,
  faTrain,
  faArrowsAltH,
  faUtensils,
  faUser,
  faPlusSquare
);

function MyApp({ Component, pageProps }: AppProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} />;
}

export default MyApp;
