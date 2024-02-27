import { configureStore } from '@reduxjs/toolkit';
import {
  profileReducer,
  subscriptionReducer,
  userReducer,
} from './reducers/userReducer';
import { courseReducer } from './reducers/courseReducer';
import { adminReducer } from './reducers/adminReducer';
import { instructorReducer } from './reducers/instructorReducer';
import { otherReducer } from './reducers/otherReducer';
const store = configureStore({
  reducer: {
    user: userReducer,
    instructor: instructorReducer,
    profile: profileReducer,
    course: courseReducer,
    subscription: subscriptionReducer,
    admin: adminReducer,
    other: otherReducer,
  },
});

export default store;

export const server = 'http://localhost:4000/api/v1';