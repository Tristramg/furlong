import mapboxgl from 'mapbox-gl';
import { FeatureCollection } from 'geojson';
import bbox from '@turf/bbox';
import React, { useEffect, useState, useRef } from 'react';
import { ConnectedProps, connect } from 'react-redux';

const SegmentMap = ({ segments }: PropsFromRedux) => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  const geoms: FeatureCollection = {
    type: 'FeatureCollection',
    features: segments.map((seg) => ({
      type: 'Feature',
      properties: {},
      geometry: seg.geojson,
    })),
  };
  mapboxgl.accessToken =
    'pk.eyJ1IjoidHJpc3RyYW1nIiwiYSI6ImNrZDRpYTA2dTFxcmEycm83MzlnOWs1amUifQ.y6b0oAHEouiow3G5_g-lOg';

  useEffect(() => {
    const initializeMap = () => {
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [2, 48],
        zoom: 3,
      });
      newMap.on('load', () => {
        setMap(newMap);
        newMap.resize();
      });
    };

    const updateMap = () => {
      if (map.isSourceLoaded('segments')) {
        map.removeLayer('segments');
        map.removeSource('segments');
      }

      if (geoms.features.length > 0) {
        map.addSource('segments', { type: 'geojson', data: geoms });
        map.addLayer({
          id: 'segments',
          type: 'line',
          source: 'segments',
        });
        const bounds = bbox(geoms);
        map.fitBounds([bounds[0], bounds[1], bounds[2], bounds[3]]);
      }
    };
    if (!map) {
      initializeMap();
    } else {
      updateMap();
    }
  }, [segments]);

  return (
    <div
      // eslint-disable-next-line no-return-assign
      ref={(el) => (mapContainer.current = el)}
      className="w-full min-h-full"
    />
  );
};

const mapStateToProps = ({ line }) => ({ segments: line.segments });
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SegmentMap);
