import { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentCallback = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    // Lấy các tham số từ URL callback
    const queryParams = new URLSearchParams(window.location.search);
    const amount = queryParams.get('vnp_Amount');
    const transactionNo = queryParams.get('vnp_TransactionNo');
    const orderInfo = queryParams.get('vnp_OrderInfo');
    const transactionStatus = queryParams.get('vnp_TransactionStatus');
    const responseCode = queryParams.get('vnp_ResponseCode');

    // Kiểm tra trạng thái thanh toán và xử lý
    if (transactionStatus === '00' && responseCode === '00') {
      // Thanh toán thành công
      setPaymentStatus('success');
      setPaymentDetails({
        amount,
        transactionNo,
        orderInfo,
      });

      // Gửi yêu cầu đến backend để xử lý (cập nhật trạng thái hóa đơn hoặc các bước khác)
      axios.get('http://localhost:8080/api/payment/vnpay-payment', {
        vnp_Amount: amount,
        vnp_TransactionNo: transactionNo,
        vnp_OrderInfo: orderInfo,
        vnp_TransactionStatus: transactionStatus,
        vnp_ResponseCode: responseCode,
      })
      .then((response) => {
        console.log('Thanh toán thành công', response.data);
        // Xử lý sau khi thanh toán thành công, có thể thông báo cho người dùng hoặc chuyển hướng trang
      })
      .catch((error) => {
        console.error('Lỗi xử lý thanh toán:', error);
      });
    } else {
      // Thanh toán thất bại
      setPaymentStatus('fail');
      setPaymentDetails({
        amount,
        transactionNo,
        orderInfo,
      });
    }
  }, []);

  return (
    <div>
      {paymentStatus === 'success' ? (
        <div>
          <h3>Thanh toán thành công!</h3>
          <p>Mã giao dịch: {paymentDetails.transactionNo}</p>
          <p>Tổng tiền: {paymentDetails.amount}</p>
          <p>Thông tin đơn hàng: {paymentDetails.orderInfo}</p>
        </div>
      ) : paymentStatus === 'fail' ? (
        <div>
          <h3>Thanh toán không thành công!</h3>
          <p>Mã giao dịch: {paymentDetails.transactionNo}</p>
          <p>Tổng tiền: {paymentDetails.amount}</p>
          <p>Thông tin đơn hàng: {paymentDetails.orderInfo}</p>
        </div>
      ) : (
        <p>Đang xử lý thanh toán...</p>
      )}
    </div>
  );
};

export default PaymentCallback;
