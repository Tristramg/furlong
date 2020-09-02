import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import reducer from '../database/store';
import StationList from '../components/editor/stations_list';
import SegmentList from '../components/editor/segment_list';
import SegmentMap from '../components/editor/map';

const store = configureStore({
  reducer,
});

const Home = () => {
  return (
    <Provider store={store}>
      <div className="p-12">
        <DndProvider backend={HTML5Backend}>
          <div className="flex gap-2">
            <div className="w-1/4">
              <StationList />
            </div>
            <div className="w-1/2">
              <SegmentList />
            </div>
            <div className="w-1/4">
              <SegmentMap />
            </div>
          </div>
        </DndProvider>
      </div>
    </Provider>
  );
};

export default Home;
