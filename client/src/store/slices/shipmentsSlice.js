import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { shipmentsAPI } from '../../services/api';

export const fetchShipments = createAsyncThunk(
  'shipments/fetchShipments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await shipmentsAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при загрузке грузоперевозок');
    }
  }
);

export const fetchShipmentById = createAsyncThunk(
  'shipments/fetchShipmentById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await shipmentsAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при загрузке грузоперевозки');
    }
  }
);

export const createShipment = createAsyncThunk(
  'shipments/createShipment',
  async (shipmentData, { rejectWithValue }) => {
    try {
      const response = await shipmentsAPI.create(shipmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при создании грузоперевозки');
    }
  }
);

export const updateShipment = createAsyncThunk(
  'shipments/updateShipment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await shipmentsAPI.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при обновлении грузоперевозки');
    }
  }
);

export const deleteShipment = createAsyncThunk(
  'shipments/deleteShipment',
  async (id, { rejectWithValue }) => {
    try {
      await shipmentsAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при удалении грузоперевозки');
    }
  }
);

const shipmentsSlice = createSlice({
  name: 'shipments',
  initialState: {
    items: [],
    currentItem: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    },
    filters: {
      search: '',
      status: '',
      sortBy: 'id',
      sortOrder: 'ASC'
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentItem: (state) => {
      state.currentItem = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShipments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShipments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = {
          ...state.pagination,
          total: action.payload.pagination.total,
          totalPages: action.payload.pagination.totalPages
        };
      })
      .addCase(fetchShipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchShipmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShipmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchShipmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShipment.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShipment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentItem?.id === action.payload.id) {
          state.currentItem = action.payload;
        }
      })
      .addCase(updateShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShipment.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.currentItem?.id === action.payload) {
          state.currentItem = null;
        }
      })
      .addCase(deleteShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, setPagination, clearError, clearCurrentItem } = shipmentsSlice.actions;
export default shipmentsSlice.reducer;
