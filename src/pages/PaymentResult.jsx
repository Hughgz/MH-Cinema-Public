import { Box, Heading, Text } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const PaymentResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10); 
    const queryParams = new URLSearchParams(location.search);
    
    const success = queryParams.get('success');
    const isSuccess = success === "success";

    // Log the values for debugging
    console.log("Query params:", queryParams.toString());
    console.log("Success value:", success);
    console.log("Is success?", isSuccess);

    useEffect(() => {
        // Decrease the countdown every second
        const interval = setInterval(() => {
            setCountdown(prevCountdown => {
                console.log("Countdown:", prevCountdown);  // Log countdown value
                if (prevCountdown <= 1) {
                    clearInterval(interval);
                    console.log("Navigating to home...");
                    navigate('/');
                }
                return prevCountdown - 1;
            });
        }, 1000); 

        // Clear the interval if the component unmounts before the countdown completes
        return () => {
            clearInterval(interval);
            console.log("Cleanup countdown interval.");
        };
    }, [navigate]);

    return (
        <Box textAlign="center" py={20} px={6}>
            {isSuccess ? (
                <>
                    <CheckCircleIcon boxSize={'70px'} color={'green'} />
                    <Heading as="h2" size="xl" mt={6} mb={2}>
                        Thanh toán thành công
                    </Heading>
                    <Text color={'gray.500'}>
                        Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Đơn hàng của bạn đã được xử lý thành công.
                    </Text>
                </>
            ) : (
                <>
                    <WarningIcon boxSize={'50px'} color={'red.500'} />
                    <Heading as="h2" size="xl" mt={6} mb={2}>
                        Thanh toán thất bại
                    </Heading>
                    <Text color={'gray.500'}>
                        Rất tiếc, đã có sự cố xảy ra trong quá trình xử lý thanh toán. Vui lòng thử lại.
                    </Text>
                </>
            )}
            <Text mt={4} fontSize="lg" color="gray.700">
                Bạn sẽ được chuyển hướng đến trang chủ sau {countdown} giây.
            </Text>
        </Box>
    );
};

export default PaymentResult;
