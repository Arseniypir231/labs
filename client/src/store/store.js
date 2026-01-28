import { configureStore } from '@reduxjs/toolkit';
import vehiclesReducer from './slices/vehiclesSlice';
import routesReducer from './slices/routesSlice';
import shipmentsReducer from './slices/shipmentsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehiclesReducer,
    routes: routesReducer,
    shipments: shipmentsReducer
  }
});
