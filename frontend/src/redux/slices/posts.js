import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "../../axios";

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const {data} = await axios.get('/posts')
    return data
})

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
    const {data} = await axios.get('/tags')
    return data
})

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => await axios.delete(`/posts/${id}`))

const pending = (state) => {
    state.posts.items = []
    state.posts.status = 'loading'
}

const fulfilled = (state, action) => {
    state.posts.items = action.payload
    state.posts.status = 'loaded'
}

const rejected = (state) => {
    state.posts.items = []
    state.posts.status = 'error'
}

const initialState = {
    posts: {
        items: [],
        status: 'loading'
    },
    tags: {
        items: [],
        status: 'loading'
    }
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: {

        // ===== fetchPosts ===== //

        [fetchPosts.pending]: pending,
        [fetchPosts.fulfilled]: fulfilled,
        [fetchPosts.rejected]: rejected,

        // ===== fetchTags ===== //

        [fetchTags.pending]: pending,
        [fetchTags.fulfilled]: fulfilled,
        [fetchTags.rejected]: rejected,

        // ===== fetchRemovePost ===== //

        [fetchRemovePost.pending]: (state, action) => {
            state.posts.items = state.posts.items.filter(post => post._id !== action.meta.arg)
        }
    }
})

export const postsReducer = postsSlice.reducer