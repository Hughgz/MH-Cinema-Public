import { 
  SET_FOOD_LIST, 
  SET_CINEMA_DATA, 
  SET_MOVIE_BOOKING, 
  SELECT_SEAT, 
  DESELECT_SEAT, 
  SELECT_FOOD,
} from '../actions/bookingAction';

const initialState = {
  cinemaData: null, // Dữ liệu rạp phim
  movieBooking: null,
  selectedSeats: [], // Danh sách ghế đã chọn
  totalAmount: 0, // Tổng số tiền
  foodList: [], // Danh sách thực phẩm
};

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MOVIE_BOOKING:
      return {
        ...state,
        movieBooking: action.payload,
      };
    case SET_CINEMA_DATA:
      return {
        ...state,
        cinemaData: action.payload,
      };
    case SELECT_SEAT: {
      const seat = action.payload;
      const seatPrice = seat.seatType === 'vip' ? 100000 : seat.seatType === 'couple' ? 150000 : 75000;

      const newTotalAmount = state.totalAmount + seatPrice;
      const seatExists = state.selectedSeats.some(
        selectedSeat => selectedSeat.seatId === seat.seatId
      );

      if (seatExists) {
        return state;
      }

      return {
        ...state,
        selectedSeats: [...state.selectedSeats, action.payload],
        totalAmount: newTotalAmount,
      };
    }
    case DESELECT_SEAT: {
      const seat = action.payload;
      const seatPrice = seat.seatType === 'vip' ? 100000 : seat.seatType === 'couple' ? 150000 : 75000;

      // Tính lại tổng tiền khi bỏ chọn ghế
      const newTotalAmount = state.totalAmount - seatPrice;

      return {
        ...state,
        selectedSeats: state.selectedSeats.filter(
          selectedSeat => selectedSeat.seatId !== seat.seatId
        ),
        totalAmount: newTotalAmount,
      };
    }
    case SET_FOOD_LIST:
      return {
        ...state,
        foodList: action.payload,
      };
    case SELECT_FOOD: {
      const updatedFoodList = state.foodList.map((foodItem) =>
        foodItem.id === action.payload.foodId
          ? { ...foodItem, quantity: action.payload.quantity }
          : foodItem
      );

      // Tính toán tổng tiền thực phẩm
      const foodTotal = updatedFoodList.reduce((total, foodItem) => {
        const price = parseFloat(foodItem.price) || 0; // Đảm bảo giá trị là số hợp lệ
        const quantity = parseInt(foodItem.quantity, 10) || 0; // Đảm bảo số lượng là số hợp lệ
        return total + (quantity * price);
      }, 0);

      // Tính toán tổng tiền ghế
      const seatTotal = state.selectedSeats.reduce((total, seat) => {
        const seatPrice = seat.seatType === 'vip' ? 100000 :
                          seat.seatType === 'couple' ? 150000 : 75000;
        return total + seatPrice;
      }, 0);

      // Cập nhật tổng tiền sau khi thay đổi thực phẩm
      const newTotalAmount = foodTotal + seatTotal;

      return {
        ...state,
        foodList: updatedFoodList,
        totalAmount: newTotalAmount,
      };
    }
    default:
      return state;
  }
};

export default bookingReducer;
