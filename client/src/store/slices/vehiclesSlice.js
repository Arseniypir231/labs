import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vehiclesAPI } from '../../services/api';

export const fetchVehicles = createAsyncThunk(
  'vehicles/fetchVehicles',
  async (params = {}) => {
    const response = await vehiclesAPI.getAll(params);
    return response.data;
  }
);

export const fetchVehicleById = createAsyncThunk(
  'vehicles/fetchVehicleById',
  async (id) => {
    const response = await vehiclesAPI.getById(id);
    return response.data;
  }
);

export const createVehicle = createAsyncThunk(
  'vehicles/createVehicle',
  async (data) => {
    const response = await vehiclesAPI.create(data);
    return response.data;
  }
);

export const updateVehicle = createAsyncThunk(
  'vehicles/updateVehicle',
  async ({ id, data }) => {
    const response = await vehiclesAPI.update(id, data);
    return response.data;
  }
);

export const deleteVehicle = createAsyncThunk(
  'vehicles/deleteVehicle',
  async (id) => {
    await vehiclesAPI.delete(id);
    return id;
  }
);

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState: {
    items: [],
    currentItem: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pages: 0,
    },
  },
  reducers: {
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchVehicleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload.data;
      })
      .addCase(fetchVehicleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.items.push(action.payload.data);
      })
      .addCase(createVehicle.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload.data._id
        );
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
        if (state.currentItem?._id === action.payload.data._id) {
          state.currentItem = action.payload.data;
        }
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
        if (state.currentItem?._id === action.payload) {
          state.currentItem = null;
        }
      });
  },
});

export const { clearCurrentItem, clearError } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;
