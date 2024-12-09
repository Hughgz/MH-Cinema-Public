// src/redux/actions/foodActions.js
import axios from "axios";
import * as types from "../types/type";
import { SET_FOOD_LIST } from "./bookingAction";

const API_URL = "http://localhost:8080/api/food";

export const fetchAllFood = () => async (dispatch) => {
  dispatch({ type: types.GET_FOODS_REQUEST });

  try {
    const response = await axios.get(API_URL);
    dispatch({
      type: types.GET_FOODS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_FOODS_FAILURE,
      payload: error.message,
    });
  }
};
export const fetchAllFoodList = () => async (dispatch) => {
  try {
    const response = await axios.get(API_URL);
    dispatch(setFoodList(response.data));
  } catch (error) {
    console.error("Error fetching food data:", error);
  }
};

export const setFoodList = (foodList) => ({
  type: SET_FOOD_LIST,
  payload: foodList,
});


export const fetchFoodById = (foodId) => async (dispatch) => {
  dispatch({ type: types.GET_FOOD_BY_ID_REQUEST });

  try {
    const response = await axios.get(`${API_URL}/${foodId}`);
    dispatch({
      type: types.GET_FOOD_BY_ID_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_FOOD_BY_ID_FAILURE,
      payload: error.message,
    });
  }
};
