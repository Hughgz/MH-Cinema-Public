﻿import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAllFoodList } from "../../redux/actions/foodAction";
import { selectFood } from "../../redux/actions/bookingAction";

const ChooseFoodTab = () => {
  const dispatch = useDispatch();
  
  // Get the foods state directly from Redux
  const foods = useSelector((state) => state.booking.foodList);
  const loading = useSelector((state) => state.booking.loading);
  const error = useSelector((state) => state.booking.error);

  // State để lưu trữ số lượng người dùng chọn cho mỗi món ăn
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    dispatch(fetchAllFoodList());
  }, [dispatch]);

  // Hàm để cập nhật số lượng món ăn
  const handleFoodSelection = (foodId, newQuantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [foodId]: newQuantity,
    }));

    dispatch(selectFood(foodId, newQuantity)); // Gửi số lượng vào Redux
  };

  const handleIncrement = (foodId, quantity) => {
    handleFoodSelection(foodId, quantity + 1);
  };

  const handleDecrement = (foodId, quantity) => {
    if (quantity > 0) {
      handleFoodSelection(foodId, quantity - 1);
    }
  };

  
  return (
    <div className="col-span-2 xl:order-first order-last xl:h-full h-[full] overflow-hidden xl:overflow-auto xl:pb-10 pb-32">
      <div className="bg-white p-4 md:h-full h-[80vh] overflow-auto">
        <h3 className="text-l mb-4 font-semibold">Chọn Combo</h3>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <ul className="concession__list">
            {foods.length > 0 ? (
              foods.map((foodItem) => {
                // Lấy số lượng của món ăn trong state (nếu có, nếu không thì mặc định là 0)
                const currentQuantity = quantities[foodItem.id] || 0;

                return (
                  <li key={foodItem.id} className="flex mb-5">
                    <img 
                      alt={foodItem.name} 
                      loading="lazy" 
                      width="150" 
                      height="100" 
                      decoding="async" 
                      className="inline-block rounded-md  w-[150px] h-[100px] object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)" 
                      src={foodItem.imgURL} 
                      style={{ color: "transparent" }} 
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-semibold mb-1">{foodItem.name}</h4>
                      <div className="text-s">{foodItem.content}</div>
                      <div className="flex justify-between mt-2 text-sm">
                        <div>
                          <strong>Giá: </strong>
                          <span className="inline-block font-bold ">
                          {(foodItem.price).toLocaleString()}
                        
                          </span>
                        </div>
                        <div className="flex bg-white border-md rounded shadow-qty">
                          <div className="md:py-1 md:px-2 rounded outline-none">
                            <button 
                              className="md:px-2 outline-none"
                              onClick={() => handleDecrement(foodItem.id, currentQuantity)}
                            >
                              <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="minus" className="svg-inline--fa fa-minus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" >
                                <path
                                  fill="currentColor"
                                  d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"
                                ></path>
                              </svg>
                            </button>
                            <button className="inline-block px-2 mx-1">
                              {currentQuantity}
                            </button>
                            <button
                              className="md:px-2"
                              onClick={() => handleIncrement(foodItem.id, currentQuantity)}
                            >
                              <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" className="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" >
                                <path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" ></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="text-center text-gray-500">No food items available</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChooseFoodTab;
