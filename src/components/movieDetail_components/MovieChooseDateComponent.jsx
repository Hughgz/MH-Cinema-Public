import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const MovieChooseDateComponent = ({ onDateChange, selectedDate }) => {
    const [weekDays, setWeekDays] = useState([]);

    useEffect(() => {
        // Lấy ngày hôm nay
        const today = new Date();
        

        // Xác định ngày đầu tuần (Thứ Hai)
        const currentDay = today.getDay();
        const currentMonth = today.getMonth()
        const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay; // Nếu Chủ Nhật (0), ngày đầu tuần là Thứ Hai (-6)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() + diffToMonday); // Tính ngày Thứ Hai của tuần hiện tại

        const daysOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];

        const week = [];

        // Lấy các ngày trong tuần từ Thứ Hai đến Chủ Nhật
        for (let i = 0; i < 7; i++) {
            const targetDate = new Date(startOfWeek);
            targetDate.setDate(startOfWeek.getDate() + i); // Tính toán từng ngày trong tuần

            // Định dạng ngày theo ISO (yyyy-mm-dd)
            const formattedDate = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;

            week.push({
                dayName: daysOfWeek[i], // Tên ngày trong tuần
                date: formattedDate, // Ngày tương ứng (ISO format)
                displayDate: `${targetDate.getDate()}/${targetDate.getMonth() + 1}`, // Hiển thị ngày dd/MM
            });
        }

        setWeekDays(week); // Cập nhật danh sách các ngày trong tuần
    }, []); // Chạy 1 lần khi component được mount

    return (
        <div>
            <div className="movie__filter grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-5 xl:grid-cols-12 items-center">
                <div className="filter__date order-2 sm:order-1 sm:col-span-3 md:col-span-3 xl:col-span-7 lg:col-span-3 px-7 mt-6 md:mt-0">
                    <div className="slick-slider slick-initialized flex" dir="ltr">
                        <div className="slick-list mx-2">
                            <div className="flex justify-center items-center">
                                {weekDays.map((day, index) => (
                                    <div
                                        key={index}
                                        data-index={index}
                                        className="slick-slide slick-active"
                                        tabIndex="-1"
                                        aria-hidden="false"
                                        style={{ outline: 'none' }}
                                    >
                                        <div>
                                            <div
                                                className="mx-2"
                                                tabIndex="-1"
                                                style={{ width: '100%', display: 'inline-block' }}
                                            >
                                                <a
                                                    className={`flex flex-wrap items-center capitalize text-center text-sm w-[80px] h-[65px] rounded-[5px] py-2 cursor-pointer ${
                                                        selectedDate === day.date
                                                            ? 'bg-[#034ea2] text-white'
                                                            : 'bg-gray-100'
                                                    } hover:bg-gray-200`}
                                                    onClick={() => onDateChange(day.date)}
                                                >
                                                    <span className="inline-block w-full">{day.dayName}</span>
                                                    <span className="inline-block w-full">{day.displayDate}</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Xác định kiểu dữ liệu cho các props
MovieChooseDateComponent.propTypes = {
    onDateChange: PropTypes.func.isRequired, // Hàm callback để gửi ngày được chọn về parent
    selectedDate: PropTypes.string.isRequired, // Ngày hiện tại được chọn
};

export default MovieChooseDateComponent;
