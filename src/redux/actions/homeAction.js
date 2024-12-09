import axios from 'axios';

export const SET_TAB = 'SET_TAB';
export const SET_RECENT_MOVIES = 'SET_RECENT_MOVIES';
export const SET_UPCOMING_MOVIES = 'SET_UPCOMING_MOVIES';

export const setCarouselImages = (images) => ({
  type: "SET_CAROUSEL_IMAGES",
  payload: images,
});

export const setBlogs = (blogs) => ({
  type: "SET_BLOGS",
  payload: blogs,
});

export const setPromotionNews = (promotionNews) => ({
  type: "SET_PROMOTION_NEWS",
  payload: promotionNews,
});

export const setTab = (tabValue) => ({
  type: SET_TAB,
  payload: tabValue,
});

export const setRecentMovies = (movies) => ({
  type: SET_RECENT_MOVIES,
  payload: movies,
});

export const setUpcomingMovies = (movies) => ({
  type: SET_UPCOMING_MOVIES,
  payload: movies,
});

export const fetchMovies = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('http://localhost:8080/api/movie');
      const movies = response.data;

      // Mốc ngày cố định: bắt đầu từ 2024-11-20 và 50 ngày sau
      const startDate = new Date(2024, 10, 20);  // Tháng là 0-based, tức là 10 = tháng 11
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 50);  // Tính 50 ngày sau

      const recentMovies = [];
      const upcomingMovies = [];

      movies.forEach((movie) => {
        const releaseDate = new Date(movie.releaseDate[0], movie.releaseDate[1] - 1, movie.releaseDate[2]);

        // Kiểm tra xem phim có trong khoảng từ 2024-11-20 đến 2025-01-09 không
        if (releaseDate >= startDate && releaseDate <= endDate) {
          recentMovies.push(movie); // Phim đang chiếu
        } else if (releaseDate > endDate) {
          upcomingMovies.push(movie); // Phim sắp chiếu
        }
      });

      // Dispatch dữ liệu đã phân loại
      dispatch(setRecentMovies(recentMovies));
      dispatch(setUpcomingMovies(upcomingMovies));

    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };
};

export const fetchBlogs = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('http://localhost:8080/api/blog', {
        // Thêm headers nếu cần thiết
        headers: {
          // Ví dụ: 'Authorization': 'Bearer token'
        },
      });

      const blogs = response.data;

      dispatch(setBlogs(blogs));
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };
};
