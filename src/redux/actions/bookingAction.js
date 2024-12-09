import axios from 'axios';

export const SET_FOOD_LIST = 'SET_FOOD_LIST';
export const SET_CINEMA_DATA = 'SET_CINEMA_DATA';
export const SET_MOVIE_BOOKING = 'SET_MOVIE_BOOKING';
export const SELECT_SEAT = 'SELECT_SEAT';
export const DESELECT_SEAT = 'DESELECT_SEAT';
export const SELECT_FOOD = 'SELECT_FOOD';

// Cập nhật các action không liên quan đến payment
export const setMovieBooking = (data) => ({
  type: SET_MOVIE_BOOKING,
  payload: data,
});

export const setFoodList = (foodList) => ({
  type: SET_FOOD_LIST,
  payload: foodList,
});

export const selectSeat = (seat) => ({
  type: SELECT_SEAT,
  payload: seat,
});

export const deselectSeat = (seat) => ({
  type: DESELECT_SEAT,
  payload: seat,
});

export const selectFood = (foodId, quantity) => ({
  type: SELECT_FOOD,
  payload: { foodId, quantity },
});

export const setCinemaData = (cinemaData) => ({
  type: SET_CINEMA_DATA,
  payload: cinemaData,
});

// Hàm xử lý dữ liệu phòng và ghế
const transformSeatData = (apiResponse) => {
  try {
    const { schedules } = apiResponse;
    if (!schedules || schedules.length === 0) {
      throw new Error('No schedules found in the response');
    }

    const seats = schedules.map(schedule => {
      const { seat } = schedule;
      if (!seat || !seat.rowSeat || !seat.colSeat || !seat.status || !seat.type) {
        throw new Error('Incomplete seat information found');
      }

      return {
        row: String.fromCharCode(65 + seat.rowSeat - 1), 
        col: seat.colSeat,
        status: seat.status === 'Active' ? 'available' : 'disavailable',
        type: seat.type,
        name: `${String.fromCharCode(65 + seat.rowSeat - 1)}${seat.colSeat}`
      };
    });

    const roomDetails = schedules[0].seat.room;
    const cinemaDetails = roomDetails.theater;

    return {
      id: roomDetails.id,
      cinemaName: cinemaDetails.name,
      room: roomDetails.id,
      row: roomDetails.rowNum,
      col: roomDetails.colNum,
      seats
    };
  } catch (error) {
    console.error('Error in transformSeatData:', error);
    throw error; 
  }
};

export const fetchAndSetCinemaData = (movieUrl) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/schedule/getSchedulesByMovieUrl/${movieUrl}`);
    if (!response.data) {
      throw new Error('No data received from the API');
    }
    const transformedData = transformSeatData(response.data);
    dispatch(setCinemaData(transformedData));
  } catch (error) {
    console.error('Error fetching or transforming data:', error);
  }
};
