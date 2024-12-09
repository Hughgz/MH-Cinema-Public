import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Box, Heading, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { Details } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TextField } from '@mui/material';
import Modal from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import PropTypes from 'prop-types';
import { Spinner } from '@material-tailwind/react';
import { fetchAllRoom } from '../../redux/actions/roomAction';
import { fetchAllTheater } from '../../redux/actions/theaterAction';

const HistoryTab = () => {

    const dispatch = useDispatch();
    const { account, token } = useSelector((state) => state.auth);
    const [tickets, setTickets] = useState([]);
    const { theaters } = useSelector((state) => state.theaters);
    const { movies } = useSelector((state) => state.movies);
    const { rooms } = useSelector((state) => state.rooms);

    const [filteredTickets, setFilteredTickets] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        dispatch(fetchAllRoom());
        dispatch(fetchAllTheater());
    }, [dispatch]);


    const getTicketById = async (ticketId) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/ticket/getTicketById/${ticketId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            console.log("getTicketById: " + response.data);
            setSelectedTicket(response.data);
        } catch (error) {
            console.error('Error fetching ticket:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch tickets on component mount
        const fetchTickets = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/ticket/getTicketByUserId/${account.user_id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                console.log(response.data);
                setTickets(response.data);
                setFilteredTickets(response.data);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };

        fetchTickets();
    }, [account.user_id, token]);

    useEffect(() => {
        // Filter tickets by month and year when selectedDate changes
        if (selectedDate) {
            const selectedMonth = dayjs(selectedDate).format('YYYY-MM');
            const filtered = tickets.filter(ticket => format(new Date(ticket.schedule.startDate), 'yyyy-MM') === selectedMonth);
            setFilteredTickets(filtered);
        } else {
            setFilteredTickets(tickets);
        }
    }, [selectedDate, tickets]);

    const handleOpenModal = (ticket) => {
        getTicketById(ticket.id);
        setIsTicketModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsTicketModalOpen(false);
        setSelectedTicket(null);
    };
    const getTheaterNameById = (branchId) => {
        const theater = theaters.find((theater) => theater.id === branchId);
        return theater.name || null;
    };
    return (
        <div className="px-4 py-4 md:px-0 lg:px-6 md:py-6 bg-white rounded mt-4 xl:shadow-2xl min-h-[350px]">
            <Box p={4}>
                <Heading mb={4} style={{ fontSize: "1.5rem", fontWeight: "700", fontFamily: "Nunito Sans, sans-serif" }}>Lịch sử mua vé</Heading>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Chọn tháng/năm"
                        views={['year', 'month']}
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>

                <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mt={4}>
                    {filteredTickets.length > 0 ? (
                        filteredTickets.map(ticket => (
                            <Box key={ticket.id} p={4} borderBottomWidth="1px">
                                <div className="flex flex-row justify-between items-center">
                                    <p className="text-[#034EA2]">Mã vé: {ticket.id}</p>
                                    <p>Total: <span className="md:text-base xl:text-xl font-bold not-italic text-[#F58020]" style={{ fontSize: "1rem", fontWeight: "700", fontFamily: "Nunito Sans, sans-serif" }}> {ticket.totalAmount.toLocaleString()} VND</span></p>
                                </div>
                                <div className="mt-2 flex justify-between items-end">
                                    <div>
                                        <p style={{ fontSize: ".8rem" }}>Ngày chiếu: {format(new Date(ticket.schedule.startDate), 'dd/MM/yyyy')}</p>
                                        <p style={{ fontSize: ".8rem" }}>Giờ chiếu: {ticket.schedule.startTime && ticket.schedule.startTime.length === 2
                                            ? `${ticket.schedule.startTime[0].toString().padStart(2, '0')}:${ticket.schedule.startTime[1].toString().padStart(2, '0')}`
                                            : '00:00'}</p>
                                        <p style={{ fontSize: ".8rem" }}>Rạp: {getTheaterNameById(ticket.schedule.branch_id)}</p>
                                    </div>
                                    <a onClick={() => handleOpenModal(ticket)} className={`group flex items-center justify-center mt-3 border-[#034EA2] border-2 text-gray-700 bg-transparent hover:bg-[#034EA2] rounded text-sm px-5 py-2.5 text-center group-hover:text-white cursor-pointer transition duration-200 ease-in-out`} >
                                        {loading ? (
                                            <Spinner size="sm" color="#034EA2" />
                                        ) : (
                                            <>
                                                <Details alt="Logo Watch Trailer" loading="lazy" width="18" height="18" decoding="async" data-nimg="1" className="text-[#034EA2] group-hover:text-white" />
                                                <span className="ml-1 group-hover:text-white">Xem chi tiết</span>
                                            </>
                                        )}
                                    </a>
                                </div>
                            </Box>
                        ))
                    ) : (
                        <Text textAlign="center" p={4}>Không có vé nào.</Text>
                    )}
                </Box>
            </Box>

            {selectedTicket && (
                <TicketDetail
                    data={selectedTicket}
                    theaters={theaters}
                    movies={movies}
                    rooms={rooms}
                    isTicketModalOpen={isTicketModalOpen}
                    closeModal={handleCloseModal}

                /> 
            )}
        </div>
    );
};

const TicketDetail = ({ data, theaters, movies, rooms, isTicketModalOpen, closeModal }) => {

    const getTheaters = (branchId) => {
        const theater = theaters.find((theater) => theater.id === branchId);
        return theater || null;
    };
    const getMovies = (movieId) => {
        const movie = movies.find((movie) => movie.id === movieId);
        return movie || null;
    };

    const getRooms = (roomId) => {
        const room = rooms.find((room) => room.id === roomId);
        return room || null;
    };

    const theaterDetail = getTheaters(data.schedule.branch_id);
    const movieDetail = getMovies(data.schedule.movie_id);
    const roomDetail = getRooms(data.schedule.room_id);

    const startDate = dayjs(data.schedule.startDate);
    const startTime = data.schedule.startTime && data.schedule.startTime.length === 2
        ? `${data.schedule.startTime[0].toString().padStart(2, '0')}:${data.schedule.startTime[1].toString().padStart(2, '0')}`
        : '00:00';

    return (
        <Modal open={isTicketModalOpen} onClose={closeModal} center showCloseIcon={false}
            styles={{
                modal: {
                    width: '400px',
                    maxWidth: '90%',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                },
                overlay: {
                    background: 'rgba(0, 0, 0, 0.4)',
                },
            }}>
            <div className="bg-white rounded-lg p-6">
                <div className="booking__summary md:mb-4">
                    <div className="h-[6px] bg-primary rounded-t-lg"></div>
                    <div className="bg-white p-4 grid grid-cols-3 xl:gap-2 items-center">
                        <div className="row-span-2 md:row-span-1 xl:row-span-2 block md:hidden xl:block">
                            <img alt={movieDetail.name} loading="lazy" width="100" height="150" decoding="async" data-nimg="1" className="xl:w-full xl:h-full md:w-[80px] md:h-[120px] w-[90px] h-[110px] rounded object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)" src={movieDetail.smallImgMovie} />
                        </div>
                        <div className="flex-1 col-span-2 md:col-span-1 row-span-1 xl:col-span-2">
                            <h3 className="text-sm xl:text-base font-bold xl:mb-2 ">{movieDetail.name}</h3>
                            <p className="text-sm inline-block">{movieDetail.type}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1 xl:col-span-3">
                            <div>
                                <div className="xl:mt-4 text-sm xl:text-base">
                                    <strong>{theaterDetail.name}</strong>
                                    <span> - </span>
                                    <span className="text-sm xl:text-base">{roomDetail.name}</span>
                                </div>
                                <div className="xl:mt-2 text-sm xl:text-base">
                                    <span>Suất: </span>
                                    <strong>{startTime}</strong>
                                    <span> - </span>
                                    <span className="capitalize text-sm">
                                        <strong> {startDate.format("DD/MM/YYYY")}</strong> {/* Hiển thị ngày theo format mong muốn */}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="xl:flex hidden justify-between col-span-3">
                            <strong className="text-base">Tổng cộng</strong>
                            <span className="inline-block font-bold text-primary">
                                {(data.totalAmount).toLocaleString()}&nbsp;₫
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};


TicketDetail.propTypes = {
    data: PropTypes.object,
    isTicketModalOpen: PropTypes.bool,
    closeModal: PropTypes.func,
};

export default HistoryTab;
