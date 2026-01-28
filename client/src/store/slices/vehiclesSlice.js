import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vehiclesAPI } from '../../services/api';

// Асинхронные действия
export const fetchVehicles = createAsyncThunk(
  'vehicles/fetchVehicles',
  async (params, { rejectWithValue }) => {
    try {
      const response = await vehiclesAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при загрузке транспортных средств');
    }
  }
);

export const fetchVehicleById = createAsyncThunk(
  'vehicles/fetchVehicleById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await vehiclesAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при загрузке транспортного средства');
    }
  }
);

export const createVehicle = createAsyncThunk(
  'vehicles/createVehicle',
  async (vehicleData, { rejectWithValue }) => {
    try {
      const response = await vehiclesAPI.create(vehicleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при создании транспортного средства');
    }
  }
);

export const updateVehicle = createAsyncThunk(
  'vehicles/updateVehicle',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await vehiclesAPI.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при обновлении транспортного средства');
    }
  }
);

export const deleteVehicle = createAsyncThunk(
  'vehicles/deleteVehicle',
  async (id, { rejectWithValue }) => {
    try {
      await vehiclesAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при удалении транспортного средства');
    }
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
      totalPages: 0
    },
    filters: {
      search: '',
      status: '',
      vehicleType: '',
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
      // Fetch vehicles
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = {
          ...state.pagination,
          total: action.payload.pagination.total,
          totalPages: action.payload.pagination.totalPages
        };
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch vehicle by ID
      .addCase(fetchVehicleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchVehicleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create vehicle
      .addCase(createVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update vehicle
      .addCase(updateVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentItem?.id === action.payload.id) {
          state.currentItem = action.payload;
        }
      })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete vehicle
      .addCase(deleteVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.currentItem?.id === action.payload) {
          state.currentItem = null;
        }
      })
      .addCase(deleteVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, setPagination, clearError, clearCurrentItem } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;
