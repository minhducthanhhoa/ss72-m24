import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store'; // Ensure the correct path

export interface Post {
  id: number;
  title: string;
  thumbnail: string;
  content: string;
  category: string;
  createdAt: string;
  updateAt: string;
  status: string;
}

export interface PostsState {
  posts: Post[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  status: 'idle',
  error: null
};

export const fetchPosts:any = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get('http://localhost:8080/posts');
  return response.data;
});

export const addPost:any = createAsyncThunk('posts/addPost', async (newPost: Post) => {
  const response = await axios.post('http://localhost:8080/posts', newPost);
  return response.data;
});

export const blockPost:any = createAsyncThunk('posts/blockPost', async (id: number) => {
  const response = await axios.patch(`http://localhost:8080/posts/${id}`, { status: 'Ngừng xuất bản' });
  return response.data;
});

export const unblockPost:any = createAsyncThunk('posts/unblockPost', async (id: number) => {
  const response = await axios.patch(`http://localhost:8080/posts/${id}`, { status: 'Đã xuất bản' });
  return response.data;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Additional reducers if needed
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
      })
      .addCase(addPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.posts.push(action.payload);
      })
      .addCase(blockPost.fulfilled, (state, action: PayloadAction<Post>) => {
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(unblockPost.fulfilled, (state, action: PayloadAction<Post>) => {
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      });
  }
});

export const selectAllPosts = (state: RootState) => state.posts.posts;

export default postsSlice.reducer;
