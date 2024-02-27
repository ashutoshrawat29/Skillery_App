import { createReducer } from '@reduxjs/toolkit';

export const instructorReducer = createReducer(
  {},
  {
    getInstructorStatsRequest: state => {
      state.loading = true;
    },
    getInstructorStatsSuccess: (state, action) => {
      state.loading = false;
      state.stats = action.payload.stats;
      state.viewsCount = action.payload.viewsCount;
      state.subscriptionCount = action.payload.subscriptionCount;
      state.usersCount = action.payload.usersCount;
      state.subscriptionPercentage = action.payload.subscriptionPercentage;
      state.viewsPercentage = action.payload.viewsPercentage;
      state.usersPercentage = action.payload.usersPercentage;
      state.subscriptionProfit = action.payload.subscriptionProfit;
      state.viewsProfit = action.payload.viewsProfit;
      state.usersProfit = action.payload.usersProfit;
    },
    getInstructorStatsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getSubscribedCountRequest: (state, action) => {
      state.loading = true;
    },
    getSubscribedCountSuccess: (state, action) => {
      state.loading = false;
      state.subscriberCounts = action.payload.count;
      state.subscriberPercentage = action.payload.percentage;
    },
    getSubscribedCountFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getInstructorCourseRequest: state => {
      state.loading = true;
    },
    getInstructorCourseSuccess: (state, action) => {
      state.loading = false;
      state.courses = action.payload;
    },
    getInstructorCourseFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    createCourseRequest: state => {
      state.loading = true;
    },
    createCourseSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    createCourseFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
    clearMessage: state => {
      state.message = null;
    },
  }
);
