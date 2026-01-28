import { configureStore } from '@reduxjs/toolkit';
import vehiclesReducer from './slices/vehiclesSlice';
import routesReducer from './slices/routesSlice';
import shipmentsReducer from './slices/shipmentsSlice';

export const store = configureStore({
  reducer: {
    vehicles: vehiclesReducer,
    routes: routesReducer,
    shipments: shipmentsReducer
  }
});
