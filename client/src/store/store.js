import { configureStore } from '@reduxjs/toolkit';
import vehiclesReducer from './slices/vehiclesSlice';
import driversReducer from './slices/driversSlice';
import deliveriesReducer from './slices/deliveriesSlice';

export const store = configureStore({
  reducer: {
    vehicles: vehiclesReducer,
    drivers: driversReducer,
    deliveries: deliveriesReducer,
  },
});
