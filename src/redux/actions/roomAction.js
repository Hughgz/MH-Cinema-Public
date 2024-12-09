import axios from 'axios';
import { FETCH_ROOM_REQUEST, FETCH_ROOM_SUCCESS, FETCH_ROOM_FAILURE } from '../types/type';

// Action để bắt đầu việc fetch room
export const fetchRoomRequest = () => {
    return {
        type: FETCH_ROOM_REQUEST,
    };
};

// Action khi fetch thành công
export const fetchRoomSuccess = (roomData) => {
    return {
        type: FETCH_ROOM_SUCCESS,
        payload: roomData,
    };
};

// Action khi fetch thất bại
export const fetchRoomFailure = (error) => {
    return {
        type: FETCH_ROOM_FAILURE,
        payload: error,
    };
};

// Async action creator để fetch thông tin room
export const fetchAllRoom = () => async (dispatch) => {
    dispatch(fetchRoomRequest()); // Gửi action bắt đầu
    try {
        const response = await axios.get('http://localhost:8080/api/room');
        dispatch(fetchRoomSuccess(response.data)); // Gửi action thành công
    } catch (error) {
        dispatch(fetchRoomFailure(error.message)); // Gửi action thất bại
    }
};
