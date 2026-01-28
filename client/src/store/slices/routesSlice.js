import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { routesAPI } from '../../services/api';

export const fetchRoutes = createAsyncThunk(
  'routes/fetchRoutes',
  async (params, { rejectWithValue }) => {
    try {
      const response = await routesAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при загрузке маршрутов');
    }
  }
);

export const fetchRouteById = createAsyncThunk(
  'routes/fetchRouteById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await routesAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при загрузке маршрута');
    }
  }
);

export const createRoute = createAsyncThunk(
  'routes/createRoute',
  async (routeData, { rejectWithValue }) => {
    try {
      const response = await routesAPI.create(routeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при создании маршрута');
    }
  }
);

export const updateRoute = createAsyncThunk(
  'routes/updateRoute',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await routesAPI.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при обновлении маршрута');
    }
  }
);

export const deleteRoute = createAsyncThunk(
  'routes/deleteRoute',
  async (id, { rejectWithValue }) => {
    try {
      await routesAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при удалении маршрута');
    }
  }
);

const routesSlice = createSlice({
  name: 'routes',
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
      .addCase(fetchRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = {
          ...state.pagination,
          total: action.payload.pagination.total,
          totalPages: action.payload.pagination.totalPages
        };
      })
      .addCase(fetchRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRouteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRouteById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchRouteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoute.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentItem?.id === action.payload.id) {
          state.currentItem = action.payload;
        }
      })
      .addCase(updateRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.currentItem?.id === action.payload) {
          state.currentItem = null;
        }
      })
      .addCase(deleteRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, setPagination, clearError, clearCurrentItem } = routesSlice.actions;
export default routesSlice.reducer;
