import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { driversAPI } from '../../services/api';

export const fetchDrivers = createAsyncThunk(
  'drivers/fetchDrivers',
  async (params = {}) => {
    const response = await driversAPI.getAll(params);
    return response.data;
  }
);

export const fetchDriverById = createAsyncThunk(
  'drivers/fetchDriverById',
  async (id) => {
    const response = await driversAPI.getById(id);
    return response.data;
  }
);

export const createDriver = createAsyncThunk(
  'drivers/createDriver',
  async (data) => {
    const response = await driversAPI.create(data);
    return response.data;
  }
);

export const updateDriver = createAsyncThunk(
  'drivers/updateDriver',
  async ({ id, data }) => {
    const response = await driversAPI.update(id, data);
    return response.data;
  }
);

export const deleteDriver = createAsyncThunk(
  'drivers/deleteDriver',
  async (id) => {
    await driversAPI.delete(id);
    return id;
  }
);

const driversSlice = createSlice({
  name: 'drivers',
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
      .addCase(fetchDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchDriverById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload.data;
      })
      .addCase(fetchDriverById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createDriver.fulfilled, (state, action) => {
        state.items.push(action.payload.data);
      })
      .addCase(createDriver.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateDriver.fulfilled, (state, action) => {
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
      .addCase(deleteDriver.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
        if (state.currentItem?._id === action.payload) {
          state.currentItem = null;
        }
      });
  },
});

export const { clearCurrentItem, clearError } = driversSlice.actions;
export default driversSlice.reducer;
