import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from "prop-types";
import { useDispatch } from 'react-redux';
import { setMovieBooking } from '../../redux/actions/bookingAction';
import { useEffect, useState } from 'react';
import { fetchAllRoom } from '../../redux/actions/roomAction';
import { fetchAllTheater } from '../../redux/actions/theaterAction';
import { createBill } from '../../redux/actions/billAction';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingSummary = (props) => {
    const dispatch = useDispatch();
    const totalAmount = useSelector((state) => state.booking.totalAmount);
    const selectedSeats = useSelector((state) => state.booking.selectedSeats);
    const foodList = useSelector((state) => state.booking.foodList);
    const [paymentUrl, setPaymentUrl] = useState('');
    const { theaters } = useSelector((state) => state.theaters);
    const { movies } = useSelector((state) => state.movies);
    const { rooms } = useSelector((state) => state.rooms);

    const { account, token } = useSelector((state) => state.auth);

    const [loading, setLoading] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false); // Modal state
    const [confirmAction, setConfirmAction] = useState(null);

    useEffect(() => {
        dispatch(fetchAllRoom());
        dispatch(fetchAllTheater());
    }, [dispatch]);

    useEffect(() => {
        dispatch(setMovieBooking(props.movieBooking));
    }, [dispatch, props.movieBooking]);



    const selectedFood = foodList
        .filter(item => item.quantity > 0)
        .map(item => ({
            foodId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
        }));

    const getTheater = (theaterId) => {
        const theater = theaters.find((theater) => theater.id === theaterId);
        return theater ? theater.name : "Unknown Theater";
    };

    const getMovie = (movieId) => {
        const movie = movies.find((movie) => movie.id === movieId);
        return movie ? movie.name : "Unknown movie";
    };
    const getMovieImage = (movieId) => {
        const movie = movies.find((movie) => movie.id === movieId);
        return movie ? movie.smallImgMovie : "Unknown image movie";
    };
    const getRoom = (roomId) => {
        const room = rooms.find((room) => room.id === roomId);
        return room ? room.name : "Unknown room";
    };
    const getTypeMovie = (movieId) => {
        const movie = movies.find((movie) => movie.id === movieId);
        console.log("Movie type: " + movie.type);
        return movie ? movie.type : "Unknown Type";
    };
    const getSeatPrice = (seatType) => {
        switch (seatType) {
            case 'vip':
                return 100000;
            case 'couple':
                return 150000;
            case 'regular':
            default:
                return 75000;
        }
    };

    const createBillAction = () => {
        setLoading(true);

        const bookingData = {
            userID: account.user_id,
            scheduleID: props.movieBooking.scheduleId,
            listSeatID: selectedSeats.map(seat => seat.seatId),
            totalAmount: totalAmount,
            foodItems: selectedFood.map(food => food.foodId),
        };

        dispatch(createBill(bookingData))
            .then(() => {
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
            });
    };
    const handleCreatePayment = async () => {
        setLoading(true);
    
        try {
          const formData = new FormData();
          formData.append('amount', totalAmount);
          formData.append('orderInfo', 'Thông tin đơn hàng');
          const response = await axios.post(
            'http://localhost:8080/api/payment/submitOrder', formData,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }
          );
    
          if (response.data && response.data.paymentUrl) {
            setPaymentUrl(response.data.paymentUrl);
            window.location.href = response.data.paymentUrl;
            createBillAction();
          } else {
            alert('Không thể tạo thanh toán, vui lòng thử lại.');
          }
        } catch (error) {
          console.error('Lỗi khi tạo thanh toán:', error);
          alert('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
          setLoading(false);
        }
      };
    
    const closeConfirmModal = () => {
        setShowConfirmModal(false);
    };

    const handleConfirm = () => {
        closeConfirmModal();
        confirmAction();
    };

    const handleCancel = () => {
        closeConfirmModal();
    };
    return (
        <div className="booking__summary md:mb-4">
            <div className="h-[6px] bg-primary rounded-t-lg"></div>
            <div className="bg-white p-4 grid grid-cols-3 xl:gap-2 items-center">
                <div className="row-span-2 md:row-span-1 xl:row-span-2 block md:hidden xl:block">
                    <img alt={getMovie(props.movieBooking.movieId)} loading="lazy" width="100" height="150" decoding="async" className="xl:w-full xl:h-full md:w-[80px] md:h-[120px] w-[90px] h-[110px] rounded object-cover duration-500 ease-in-out" src={getMovieImage(props.movieBooking.movieId)} />
                </div>
                <div className="flex-1 col-span-2 md:col-span-1 row-span-1 xl:col-span-2">
                    <h3 className="text-sm xl:text-base font-bold xl:mb-2 ">{getMovie(props.movieBooking.movieId)}</h3>
                    <p className="text-sm inline-block">{getTypeMovie(props.movieBooking.movieId)}</p>
                    <span> - </span>
                    <div className="xl:mt-2 ml-2 xl:ml-0 inline-block">
                        <span className="inline-flex items-center justify-center w-[38px] h-7 bg-primary rounded text-sm text-center text-white font-bold">T16</span>
                    </div>
                </div>
                <div className="col-span-2 md:col-span-1 xl:col-span-3">
                    <div>
                        <div className="xl:mt-4 text-sm xl:text-base">
                            <strong>{getTheater(props.movieBooking.theaterId)}</strong>
                            <span> - </span>
                            <span className="text-sm xl:text-base">{getRoom(props.movieBooking.roomId)}</span>
                        </div>
                        <div className="xl:mt-2 text-sm xl:text-base">
                            <span>Suất: </span>
                            <strong>{props.movieBooking.date}</strong>
                            <span> - </span>
                            <span className="capitalize text-sm">
                                <strong> {props.movieBooking.time.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}</strong>
                            </span>
                        </div>
                    </div>
                    <div className="xl:block hidden">
                        <div className={`my-4 border-t border-black border-dashed ${selectedSeats.length === 0 ? 'hidden' : 'xl:block'}`}></div>
                        {selectedSeats.map((seat, index) => (
                            <div key={index} className="flex justify-between text-sm mt-2">
                                <div>
                                    <strong>1x </strong>
                                    <span>
                                        {seat.seatType === "regular"
                                            ? 'Ghế thường'
                                            : seat.seatType === "vip"
                                                ? 'Ghế VIP'
                                                : 'Ghế đôi'}
                                    </span>
                                    <div>
                                        <span>Ghế: </span>
                                        <strong>{seat.seatName}</strong>
                                    </div>
                                </div>
                                <span className="inline-block font-bold">{getSeatPrice(seat.seatType).toLocaleString()}&nbsp;₫</span>
                            </div>
                        ))}
                    </div>
                    <div className="xl:block hidden">
                        <div className={`my-4 border-t border-black border-dashed ${selectedFood.length === 0 ? 'hidden' : 'xl:block'}`}></div>
                        {selectedFood.map((food, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span>
                                    <strong>{food.quantity}x </strong>
                                    <span>{food.name}</span>
                                </span>
                                <span className="inline-block font-bold">{(food.quantity * food.price).toLocaleString()}&nbsp;₫</span>
                            </div>
                        ))}
                    </div>
                    <div className="my-4 border-t border-black border-dashed xl:block hidden"></div>
                </div>
                <div className="xl:flex hidden justify-between col-span-3">
                    <strong className="text-base">Tổng cộng</strong>
                    <span className="inline-block font-bold text-primary">
                        {totalAmount.toLocaleString()}&nbsp;₫
                    </span>
                </div>
            </div>
            <div className="mt-8 xl:flex hidden">
                <button onClick={props.comeBack} className="w-1/2 mr-2 py-2 text-primary">
                    <span>Quay lại</span>
                </button>
                <button
                    onClick={props.currentTab === 'payment' ? handleCreatePayment  : props.onContinue}
                    className="w-1/2 ml-2 py-2 bg-primary text-white"
                    disabled={loading}
                >
                    <span>{props.currentTab === 'payment' ? 'Thanh toán' : 'Tiếp tục'}</span>
                </button>
            </div>
            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded-lg max-w-md w-full">
                        <h3 className="text-lg font-bold">Cảnh báo</h3>
                        <p>Bạn chắc chắn không chọn đồ ăn? Ấn Xác nhận để Thanh toán!</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-300 text-black rounded mr-2"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 bg-primary text-white rounded"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

BookingSummary.propTypes = {
    movieBooking: PropTypes.shape({
        title: PropTypes.string,
        theaterName: PropTypes.string,
        roomName: PropTypes.string,
        time: PropTypes.string,
        date: PropTypes.string,
        movieId: PropTypes.number,
        price: PropTypes.number,
        seatType: PropTypes.string,
        scheduleId: PropTypes.number,
    }),
    onContinue: PropTypes.func,
    comeBack: PropTypes.func,
};

export default BookingSummary;
