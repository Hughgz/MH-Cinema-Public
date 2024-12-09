import axios from 'axios';
import { CREATE_BILL_REQUEST, CREATE_BILL_SUCCESS, CREATE_BILL_FAILURE } from '../types/type';

export const createBillRequest = () => ({
  type: CREATE_BILL_REQUEST,
});

export const createBillSuccess = (data) => ({
  type: CREATE_BILL_SUCCESS,
  payload: data,
});

export const createBillFailure = (error) => ({
  type: CREATE_BILL_FAILURE,
  payload: error,
});

// Async action to create bill
export const createBill = (bookingData) => async (dispatch, getState) => {
  try {
      const token = getState().auth.token;
      const response = await axios.post(
          'http://localhost:8080/api/bill/create-bill',
          bookingData,
          {
              headers: {
                  'Authorization': `Bearer ${token}`,  // Thêm token vào header
              }
          }
      );
      dispatch({
          type: 'CREATE_BILL_SUCCESS',
          payload: response.data, // Dữ liệu trả về từ API nếu cần
      });
  } catch (error) {
      dispatch({
          type: 'CREATE_BILL_FAILURE',
          payload: error.response?.data?.message || 'Something went wrong',
      });
  }
};
