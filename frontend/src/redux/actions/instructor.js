import { server } from '../store';
import axios from 'axios';

export const getInstructorCourses = () => async dispatch => {
  try {
    const config = {
      withCredentials: true,
    };
    dispatch({ type: 'getInstructorCourseRequest' });

    const { data } = await axios.get(`${server}/instructorcourses`, config);
    
    dispatch({ type: 'getInstructorCourseSuccess', payload: data.courses });
  } catch (error) {
    dispatch({
      type: 'getInstructorCourseFail',
      payload: error.response.data.message,
    });
  }
};

export const createCourse = formData => async dispatch => {
  try {
    const config = {
      withCredentials: true,
    };
    dispatch({ type: 'createCourseRequest' });

    const { data } = await axios.post(
      `${server}/createcourse`,
      formData,
      config
    );

    dispatch({ type: 'createCourseSuccess', payload: data.message });
  } catch (error) {
    dispatch({
      type: 'createCourseFail',
      payload: error.response.data.message,
    });
  }
};

export const getDashboardStats = () => async dispatch => {
  try {
    const config = {
      withCredentials: true,
    };
    dispatch({ type: 'getInstructorStatsRequest' });

    const { data } = await axios.get(`${server}/stats`, config);
    
    dispatch({ type: 'getInstructorStatsSuccess', payload: data });
  } catch (error) {
    dispatch({
      type: 'getInstructorStatsFail',
      payload: error.response.data.message,
    });
  }
};

export const getSubscribedCount = () => async dispatch => {
  try {
    const config = {
      withCredentials: true,
    };
    dispatch({ type: 'getSubscribedCountRequest' });

    const { data } = await axios.get(`${server}/subscribed`, config);

    dispatch({ type: 'getSubscribedCountSuccess', payload: data });
  } catch (error) {
    dispatch({
      type: 'getSubscribedCountFail',
      payload: error.response.data.message,
    });
  }
};