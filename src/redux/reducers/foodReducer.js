// src/redux/reducers/foodReducer.js
import * as types from '../types/type';

const initialState = {
    foods: [], // Mảng lưu trữ danh sách món ăn
    food: null, // Món ăn chi tiết (khi lấy theo ID)
    loading: false, // Trạng thái loading
    error: null, // Lỗi khi gọi API
};

const foodReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_FOODS_REQUEST:
            return { ...state, loading: true };

        case types.GET_FOODS_SUCCESS:
            return { ...state, loading: false, foods: action.payload };

        case types.GET_FOODS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.GET_FOOD_BY_ID_REQUEST:
            return { ...state, loading: true };

        case types.GET_FOOD_BY_ID_SUCCESS:
            return { ...state, loading: false, food: action.payload };

        case types.GET_FOOD_BY_ID_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default foodReducer;
