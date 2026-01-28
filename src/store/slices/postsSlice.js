import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postsData from '../../data/posts.json';

// Валидация данных поста
const validatePost = (post) => {
    const errors = [];
    
    if (!post.title || post.title.trim().length === 0) {
        errors.push('Title is required');
    }
    if (post.title && post.title.length > 200) {
        errors.push('Title must be less than 200 characters');
    }
    if (!post.image || post.image.trim().length === 0) {
        errors.push('Image URL is required');
    }
    if (!post.category || post.category.trim().length === 0) {
        errors.push('Category is required');
    }
    if (!post.author || post.author.trim().length === 0) {
        errors.push('Author is required');
    }
    if (!post.date || post.date.trim().length === 0) {
        errors.push('Date is required');
    }
    if (post.comments !== undefined && (isNaN(post.comments) || post.comments < 0)) {
        errors.push('Comments must be a non-negative number');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

// Асинхронные действия
export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async (_, { rejectWithValue }) => {
        try {
            // Имитация задержки сети
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const posts = postsData.map((post, index) => ({
                ...post,
                id: post.id || index + 1,
                type: 'post'
            }));
            
            return posts;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch posts');
        }
    }
);

export const addPost = createAsyncThunk(
    'posts/addPost',
    async (postData, { rejectWithValue }) => {
        try {
            // Валидация
            const validation = validatePost(postData);
            if (!validation.isValid) {
                return rejectWithValue({
                    message: 'Validation failed',
                    errors: validation.errors
                });
            }
            
            // Имитация задержки сети
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const newPost = {
                ...postData,
                id: Date.now(), // Простой способ генерации ID
                type: 'post'
            };
            
            return newPost;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to add post');
        }
    }
);

export const updatePost = createAsyncThunk(
    'posts/updatePost',
    async ({ id, postData }, { rejectWithValue }) => {
        try {
            // Валидация
            const validation = validatePost(postData);
            if (!validation.isValid) {
                return rejectWithValue({
                    message: 'Validation failed',
                    errors: validation.errors
                });
            }
            
            // Имитация задержки сети
            await new Promise(resolve => setTimeout(resolve, 300));
            
            return { id, postData };
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update post');
        }
    }
);

export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async (id, { rejectWithValue }) => {
        try {
            if (!id) {
                return rejectWithValue('Post ID is required');
            }
            
            // Имитация задержки сети
            await new Promise(resolve => setTimeout(resolve, 200));
            
            return id;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to delete post');
        }
    }
);

const initialState = {
    posts: [],
    loading: false,
    error: null,
    validationErrors: null,
    lastAction: null
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
            state.validationErrors = null;
        },
        clearLastAction: (state) => {
            state.lastAction = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch Posts
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
                state.error = null;
                state.lastAction = 'fetch';
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch posts';
            });
        
        // Add Post
        builder
            .addCase(addPost.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.validationErrors = null;
            })
            .addCase(addPost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts.push(action.payload);
                state.error = null;
                state.validationErrors = null;
                state.lastAction = 'add';
            })
            .addCase(addPost.rejected, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.errors) {
                    state.validationErrors = action.payload.errors;
                    state.error = action.payload.message || 'Validation failed';
                } else {
                    state.error = action.payload || 'Failed to add post';
                }
            });
        
        // Update Post
        builder
            .addCase(updatePost.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.validationErrors = null;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.posts.findIndex(post => post.id === action.payload.id);
                if (index !== -1) {
                    state.posts[index] = { ...action.payload.postData, id: action.payload.id };
                }
                state.error = null;
                state.validationErrors = null;
                state.lastAction = 'update';
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.errors) {
                    state.validationErrors = action.payload.errors;
                    state.error = action.payload.message || 'Validation failed';
                } else {
                    state.error = action.payload || 'Failed to update post';
                }
            });
        
        // Delete Post
        builder
            .addCase(deletePost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = state.posts.filter(post => post.id !== action.payload);
                state.error = null;
                state.lastAction = 'delete';
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete post';
            });
    }
});

export const { clearError, clearLastAction } = postsSlice.actions;
export default postsSlice.reducer;
