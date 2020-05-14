import { AppProps } from 'next/app';
import '../styles/styles.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBolt, faBuilding, faRoad, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

library.add(faBolt, faBuilding, faRoad, faCheck, faTimes);

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
