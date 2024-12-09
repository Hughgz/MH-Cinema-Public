import { FETCH_THEATER_REQUEST, FETCH_THEATER_SUCCESS, FETCH_THEATER_FAILURE } from '../types/type';

const initialState = {
    theaters: [],
    loading: false,
    error: null,
};

const theaterReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_THEATER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null, // Reset error khi bắt đầu fetch
            };
        case FETCH_THEATER_SUCCESS:
            return {
                ...state,
                loading: false,
                theaters: action.payload, // Lưu dữ liệu theater khi fetch thành công
            };
        case FETCH_THEATER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload, // Lưu thông tin lỗi khi fetch thất bại
            };
        default:
            return state;
    }
};

export default theaterReducer;
