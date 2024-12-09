import { FETCH_ROOM_REQUEST, FETCH_ROOM_SUCCESS, FETCH_ROOM_FAILURE } from '../types/type';

const initialState = {
    rooms: [],
    loading: false,
    error: null,
};

const roomReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ROOM_REQUEST:
            return {
                ...state,
                loading: true,
                error: null, // Reset error khi bắt đầu fetch
            };
        case FETCH_ROOM_SUCCESS:
            return {
                ...state,
                loading: false,
                rooms: action.payload, // Lưu dữ liệu phòng khi thành công
            };
        case FETCH_ROOM_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload, // Lưu thông tin lỗi khi thất bại
            };
        default:
            return state;
    }
};

export default roomReducer;
