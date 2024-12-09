import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { fetchAllTheater } from "../../redux/actions/theaterAction";
import { fetchAllRoom } from "../../redux/actions/roomAction";
import { fetchAllMovies } from "../../redux/actions/movieAction";
import MovieChooseDateComponent from "./MovieChooseDateComponent";

const Schedule = ({ movie }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const { movies } = useSelector((state) => state.movies);
  const { theaters } = useSelector((state) => state.theaters);
  const { rooms } = useSelector((state) => state.rooms);

  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/schedule/getSchedulesByMovieUrl/${movie.movieUrl}`
      );
      const result = response.data;
      const formattedSchedules = formatSchedules(result);
      setSchedules(formattedSchedules);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleData();
    dispatch(fetchAllTheater());
    dispatch(fetchAllRoom());
    dispatch(fetchAllMovies());
  }, [movie.movieUrl, dispatch]);

  const formatSchedules = (data) => {
    return data.map((schedule) => {
      const startDate = new Date(
        schedule.startDate[0],
        schedule.startDate[1] - 1,
        schedule.startDate[2],
        schedule.startTime[0],
        schedule.startTime[1]
      );
      return { ...schedule, startDate };
    });
  };

  const handleTimeClick = (schedule) => {
    navigate(`/dat-ve/${movie.movieUrl}`, {
      state: {
        movieId: schedule.movie_id,
        theaterId: schedule.branch_id,
        scheduleId: schedule.id,
        roomId: schedule.room_id,
        time: schedule.startDate,
        price: schedule.price,
        date: selectedDate,
      },
    });
  };

  // Lọc lịch chiếu theo selectedDate
  const filteredSchedules = selectedDate
    ? schedules.filter((schedule) => {
        const scheduleDate = `${schedule.startDate.getFullYear()}-${String(schedule.startDate.getMonth() + 1).padStart(2, "0")}-${String(schedule.startDate.getDate()).padStart(2, "0")}`;
        return scheduleDate === selectedDate;
      })
    : schedules;

  // Nhóm lịch chiếu theo ngày
  const groupSchedulesByDate = (schedules) => {
    return schedules.reduce((groups, schedule) => {
      const date = `${schedule.startDate.getFullYear()}-${String(schedule.startDate.getMonth() + 1).padStart(2, "0")}-${String(schedule.startDate.getDate()).padStart(2, "0")}`;
      if (!groups[date]) groups[date] = [];
      groups[date].push(schedule);
      return groups;
    }, {});
  };

  const groupedSchedules = groupSchedulesByDate(filteredSchedules);

  // Helper Functions
  const getTheaterName = (branchId) =>
    theaters.find((theater) => theater.id === branchId)?.name || "Unknown Theater";

  const getRoom = (roomId) =>
    rooms.find((room) => room.id === roomId)?.name || "Unknown Room";

  const getTypeMovie = (movieId) =>
    movies.find((movie) => movie.id === movieId)?.type || "Unknown Type";

  if (loading) {
    return (
      <div className="w-full h-[150px] flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <MovieChooseDateComponent onDateChange={setSelectedDate} selectedDate={selectedDate} />
      <div className="showtime__cinema md:py-8 py-4 px-3 odd:bg-white even:bg-[#FDFBFA] even:border-t even:border-b">
        {Object.keys(groupedSchedules).length === 0 ? (
          <p className="text-center text-gray-600 text-sm">Không có lịch chiếu nào cho ngày này.</p>
        ) : (
          Object.keys(groupedSchedules).map((date) => (
            <div key={date} className="bg-white p-3 rounded-md shadow-sm">
              {groupedSchedules[date].map((schedule) => (
                < h3 className="text-lg font-semibold text-gray-800 mb-4" >
                  {getTheaterName(schedule.branch_id)} - {getRoom(schedule.room_id)}
                </h3>

              ))}
              {groupedSchedules[date].map((schedule) => (
                <div className="showtime__bundle flex md:flex-row flex-col gap-2 items-start mb-6">
                  <label className="text-sm font-semibold text-grey-10 mt-2 w-[150px]">{getTypeMovie(schedule.movie_id)}</label>
                  <div
                    key={schedule.id}
                    className="time__show flex flex-1 flex-row gap-x-3 gap-y-1 flex-wrap"
                  >
                    <button
                      onClick={() => handleTimeClick(schedule)}
                      className="py-2 md:px-8 px-6 border rounded text-sm font-normal text-black-10 hover:bg-blue-10 active:bg-blue-10  transition-all duration-500 ease-in-out hover:text-white"
                    >
                      {schedule.startDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Schedule;
