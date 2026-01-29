import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deliveriesAPI } from '../../services/api';

export const fetchDeliveries = createAsyncThunk(
  'deliveries/fetchDeliveries',
  async (params = {}) => {
    const response = await deliveriesAPI.getAll(params);
    return response.data;
  }
);

export const fetchDeliveryById = createAsyncThunk(
  'deliveries/fetchDeliveryById',
  async (id) => {
    const response = await deliveriesAPI.getById(id);
    return response.data;
  }
);

export const createDelivery = createAsyncThunk(
  'deliveries/createDelivery',
  async (data) => {
    const response = await deliveriesAPI.create(data);
    return response.data;
  }
);

export const updateDelivery = createAsyncThunk(
  'deliveries/updateDelivery',
  async ({ id, data }) => {
    const response = await deliveriesAPI.update(id, data);
    return response.data;
  }
);

export const deleteDelivery = createAsyncThunk(
  'deliveries/deleteDelivery',
  async (id) => {
    await deliveriesAPI.delete(id);
    return id;
  }
);

const deliveriesSlice = createSlice({
  name: 'deliveries',
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
      .addCase(fetchDeliveries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchDeliveryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload.data;
      })
      .addCase(fetchDeliveryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createDelivery.fulfilled, (state, action) => {
        state.items.push(action.payload.data);
      })
      .addCase(createDelivery.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateDelivery.fulfilled, (state, action) => {
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
      .addCase(deleteDelivery.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
        if (state.currentItem?._id === action.payload) {
          state.currentItem = null;
        }
      });
  },
});

export const { clearCurrentItem, clearError } = deliveriesSlice.actions;
export default deliveriesSlice.reducer;
