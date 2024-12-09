import axios from 'axios';
import { FETCH_THEATER_REQUEST, FETCH_THEATER_SUCCESS, FETCH_THEATER_FAILURE } from '../types/type';

// Action để bắt đầu việc fetch theater
export const fetchTheaterRequest = () => {
    return {
        type: FETCH_THEATER_REQUEST,
    };
};

// Action khi fetch thành công
export const fetchTheaterSuccess = (theaterData) => {
    return {
        type: FETCH_THEATER_SUCCESS,
        payload: theaterData,
    };
};

// Action khi fetch thất bại
export const fetchTheaterFailure = (error) => {
    return {
        type: FETCH_THEATER_FAILURE,
        payload: error,
    };
};

// Async action creator để fetch thông tin theater
export const fetchAllTheater = () => async (dispatch) => {
    dispatch(fetchTheaterRequest()); // Gửi action bắt đầu
    try {
        const response = await axios.get('http://localhost:8080/api/branch'); // URL của API lấy danh sách theater
        dispatch(fetchTheaterSuccess(response.data)); // Gửi action thành công
    } catch (error) {
        dispatch(fetchTheaterFailure(error.message)); // Gửi action thất bại
    }
};
