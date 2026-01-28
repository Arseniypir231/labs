import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './slices/postsSlice';
import uiStateReducer from './slices/uiStateSlice';

export const store = configureStore({
    reducer: {
        posts: postsReducer,
        uiState: uiStateReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Игнорируем некоторые действия для localStorage
                ignoredActions: ['uiState/toggleDarkMode', 'uiState/setDarkMode'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
