import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import reducer from '../database/store';
import UnitList from '../components/editor/unit_list';
import CarList from '../components/editor/car_list';
import TrainList from '../components/editor/train_list';

const store = configureStore({
  reducer,
});

const Home = () => {
  return (
    <Provider store={store}>
      <div className="p-12">
        <DndProvider backend={HTML5Backend}>
          <div className="flex">
            <div className="w-1/3 p-2">
              <h3>Unités</h3>
              <UnitList />
            </div>
            <div className="w-1/3 p-2">
              <h3>Voitures</h3>
              <CarList />
            </div>
            <div className="w-1/3 p-2">
              <h3>Trains</h3>
              <TrainList />
            </div>
          </div>
        </DndProvider>
      </div>
    </Provider>
  );
};

export default Home;
