import { configureStore } from '@reduxjs/toolkit';
import postsReducer, {PostsState} from '../redux/reducers/postSlice';

const store = configureStore({
  reducer: {
    posts: postsReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState> & {
  posts: PostsState;
};
export type AppDispatch = typeof store.dispatch;