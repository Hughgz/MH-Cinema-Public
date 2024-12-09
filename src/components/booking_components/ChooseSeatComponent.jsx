import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { selectSeat, deselectSeat } from "../../redux/actions/bookingAction";

const ChooseSeatComponent = ({ scheduleId }) => {
  const dispatch = useDispatch();
  const selectedSeats = useSelector((state) => state.booking.selectedSeats);

  const [cinemaData, setCinemaData] = useState(null);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/seat/getSeatByScheduleId?scheduleId=${scheduleId}`);
        const data = await response.json();
        console.log("Seat data after fetch: ", data);

        setCinemaData({
          seats: data.map(seat => ({
            id: seat.id,
            name: seat.name,
            seatType: seat.seatType,
            isOccupied: seat.isOccupied === 1,
            colSeat: seat.colSeat,
            rowSeat: seat.rowSeat,
            roomRowNum: seat.room.rowNum,
            roomColNum: seat.room.colNum,
          })),
          rowNum: data[0]?.room?.rowNum,
          colNum: data[0]?.room?.colNum,
        });
      } catch (error) {
        console.error("Error fetching seat data:", error);
      }
    };

    fetchSeats();
  }, [scheduleId]);

  const handleSeatClick = (seat) => {
    const newSeat = {
      seatType: seat.seatType,
      seatId: seat.id,
      seatName: seat.name,
    };
    console.log(newSeat);


    if (isSelected(newSeat)) {
      dispatch(deselectSeat(newSeat));
    } else {
      dispatch(selectSeat(newSeat));
    }
  };

  const isSelected = (seat) => {
    return selectedSeats.some(
      (selectedSeat) => selectedSeat.seatId === seat?.seatId
    );
  };

  if (!cinemaData) {
    return <div>Loading...</div>;
  }

  const { rowNum, colNum, seats } = cinemaData;

  const rows = Array.from({ length: rowNum }, (_, rowIndex) => {
    return Array.from({ length: colNum }, (_, colIndex) => {
      return seats.find(seat => seat.rowSeat === rowIndex + 1 && seat.colSeat === colIndex + 1);
    });
  });

  return (
    <div className="bg-white md:px-6 py-4 px-2 rounded md:mb-8 w-full">
      <div className="md:block flex flex-wrap justify-center w-full h-full overflow-auto">
        <ul className="seat__layout-rows md:mb-8 w-auto grid grid-cols-1 items-center flex-auto text-o">
          {rows.map((row, rowIndex) => {
            const rowLabel = String.fromCharCode(65 + rowIndex);
            return (
              <li key={rowIndex} className="flex justify-between mb-3 md:gap-0 gap-1 flex-nowrap">
                <div className="text-sm text-grey-40 font-semibold flex-none w-5 text-left">
                  {rowLabel}
                </div>
                <div className="flex md:gap-2 gap-1 grow justify-center min-w-[398px] flex-1">
                  {row.map((seat, colIndex) => {
                    if (!seat) return null;

                    const isOccupied = seat?.isOccupied;
                    const isSelected = selectedSeats.some(
                      (selectedSeat) => selectedSeat.seatId === seat?.id
                    );

                    return (
                      <button
                        key={colIndex}
                        className={`md:h-5 h-4 border rounded md:text-s text-[10px] transition duration-200 ease-in-out ${isOccupied
                          ? "bg-[#D0D0D0] border-[#D0D0D0]"
                          : isSelected
                            ? "text-white bg-primary border-primary"
                            : seat.seatType === 'vip'
                              ? "border-yellow-10"
                              : "text-white border-grey-20 xl:hover:bg-primary xl:hover:border-primary" // Ghế có thể chọn (màu trắng)
                          } md:w-5 w-4`}
                        disabled={isOccupied}
                        onClick={() => handleSeatClick(seat)}
                      >
                        {!isOccupied && (
                          <span
                            className={`inline-block md:w-5 w-4 text-center ${isSelected ? "text-white" : "text-black"}`}
                          >
                            {seat?.name}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="text-sm text-grey-40 font-semibold flex-none w-5 text-right">
                  {rowLabel}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="seat__layout-screen">
        <p className="text-s text-center text-grey-50">Màn hình</p>
        <div className="border-2 border-orange-10 mt-3"></div>
        <div className="text-sm flex md:flex-row flex-col-reverse justify-between items-center py-9 gap-2">
          <div className="flex gap-5">
            <div>
              <span className="w-5 h-5 rounded bg-grey-20 inline-block align-middle"></span>
              <span className="ml-2">Ghế đã bán</span>
            </div>
            <div>
              <span className="w-5 h-5 rounded bg-primary inline-block align-middle"></span>
              <span className="ml-2">Ghế đang chọn</span>
            </div>
          </div>
          <div className="flex gap-5">
            <div>
              <span className="w-5 h-5 rounded border border-yellow-10 inline-block align-middle"></span>
              <span className="ml-2">Ghế VIP</span>
            </div>
            <div>
              <span className="w-5 h-5 rounded border border-grey-20 inline-block align-middle"></span>
              <span className="ml-2">Ghế đơn</span>
            </div>
            {/* <div>
              <span className="w-[46px] h-5 rounded border border-blue-10 inline-block align-middle"></span>
              <span className="ml-2">Ghế đôi</span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseSeatComponent;
