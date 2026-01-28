import { createSlice } from '@reduxjs/toolkit';

// Валидация UI состояния
const validateUIState = (state) => {
    const errors = [];
    
    if (state.darkMode !== undefined && typeof state.darkMode !== 'boolean') {
        errors.push('darkMode must be a boolean');
    }
    
    if (state.modalOpen !== undefined && typeof state.modalOpen !== 'boolean') {
        errors.push('modalOpen must be a boolean');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

const initialState = {
    darkMode: (() => {
        try {
            const saved = localStorage.getItem('darkMode');
            return saved === 'true';
        } catch (error) {
            return false;
        }
    })(),
    modalOpen: false,
    modalType: null, // 'post', 'article', 'recipe', etc.
    selectedItemId: null,
    sidebarOpen: true,
    loading: false,
    error: null,
    notifications: []
};

const uiStateSlice = createSlice({
    name: 'uiState',
    initialState,
    reducers: {
        // Управление темной темой
        toggleDarkMode: (state) => {
            try {
                state.darkMode = !state.darkMode;
                localStorage.setItem('darkMode', state.darkMode.toString());
                if (state.darkMode) {
                    document.body.classList.add('dark-mode');
                } else {
                    document.body.classList.remove('dark-mode');
                }
            } catch (error) {
                state.error = 'Failed to toggle dark mode';
            }
        },
        setDarkMode: (state, action) => {
            const validation = validateUIState({ darkMode: action.payload });
            if (validation.isValid) {
                try {
                    state.darkMode = action.payload;
                    localStorage.setItem('darkMode', state.darkMode.toString());
                    if (state.darkMode) {
                        document.body.classList.add('dark-mode');
                    } else {
                        document.body.classList.remove('dark-mode');
                    }
                } catch (error) {
                    state.error = 'Failed to set dark mode';
                }
            } else {
                state.error = validation.errors.join(', ');
            }
        },
        
        // Управление модальными окнами
        openModal: (state, action) => {
            const { type, itemId } = action.payload;
            if (!type) {
                state.error = 'Modal type is required';
                return;
            }
            state.modalOpen = true;
            state.modalType = type;
            state.selectedItemId = itemId || null;
            state.error = null;
        },
        closeModal: (state) => {
            state.modalOpen = false;
            state.modalType = null;
            state.selectedItemId = null;
            state.error = null;
        },
        
        // Управление сайдбаром
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action) => {
            if (typeof action.payload === 'boolean') {
                state.sidebarOpen = action.payload;
            } else {
                state.error = 'Sidebar state must be a boolean';
            }
        },
        
        // Управление загрузкой
        setLoading: (state, action) => {
            if (typeof action.payload === 'boolean') {
                state.loading = action.payload;
            } else {
                state.error = 'Loading state must be a boolean';
            }
        },
        
        // Управление уведомлениями
        addNotification: (state, action) => {
            const { message, type = 'info', id } = action.payload;
            if (!message) {
                state.error = 'Notification message is required';
                return;
            }
            
            const notification = {
                id: id || Date.now(),
                message,
                type, // 'success', 'error', 'warning', 'info'
                timestamp: Date.now()
            };
            
            state.notifications.push(notification);
            
            // Ограничиваем количество уведомлений
            if (state.notifications.length > 10) {
                state.notifications.shift();
            }
        },
        removeNotification: (state, action) => {
            const id = action.payload;
            state.notifications = state.notifications.filter(
                notification => notification.id !== id
            );
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
        
        // Очистка ошибок
        clearError: (state) => {
            state.error = null;
        },
        
        // Сброс UI состояния
        resetUIState: (state) => {
            return {
                ...initialState,
                darkMode: state.darkMode, // Сохраняем тему
                sidebarOpen: state.sidebarOpen // Сохраняем состояние сайдбара
            };
        }
    }
});

export const {
    toggleDarkMode,
    setDarkMode,
    openModal,
    closeModal,
    toggleSidebar,
    setSidebarOpen,
    setLoading,
    addNotification,
    removeNotification,
    clearNotifications,
    clearError,
    resetUIState
} = uiStateSlice.actions;

export default uiStateSlice.reducer;
