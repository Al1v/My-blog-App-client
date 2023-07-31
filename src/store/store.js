import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './authSlice';
import { commentsReducer } from './commentsSlice';
import { postsReducer } from './postsSlice';


export const store = configureStore({
  reducer:{ 
    posts: postsReducer,
    auth: authReducer,
    comments: commentsReducer  
   }
});