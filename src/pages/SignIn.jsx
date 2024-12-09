import { useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { IconButton, InputAdornment, TextField, Button, CircularProgress } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch, useSelector } from 'react-redux'; // Dùng useSelector để lấy error từ Redux
import { login } from '../redux/actions/authAction';
import PropTypes from 'prop-types';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const SignIn = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const toast = useToast();

    const errorMessage = useSelector((state) => state.auth.error);

    const handlePasswordVisibilityToggle = () => {
        setPasswordVisible(!passwordVisible);
    };
    const handleNavigateToSignUp = () => {
        navigate('/dang-ky');
        onclose();
    };
    useEffect(() => {
        if (token) {
            onClose();
        }
    }, [token, onClose]); 
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setShowError(true);

        const phoneRegex = /^(0[3|5|7|8|9][0-9]{8})$/;
        if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
            toast({
                title: 'Lỗi',
                description: 'Số điện thoại không hợp lệ',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-right',
            });
            setIsLoading(false);
            return;
        }

        if (!password || password.length < 3) {
            toast({
                title: 'Lỗi',
                description: 'Mật khẩu phải có ít nhất 3 ký tự',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-right',
            });
            setIsLoading(false);
            return;
        }

        const credentials = { phoneNumber, password };

        dispatch(login(credentials))
            .then(() => {
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
            });
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            center
            styles={{
                modal: {
                    width: '400px',
                    maxWidth: '90%',
                    padding: '20px',
                    borderRadius: '10px',
                },
                overlay: {
                    background: 'rgba(0, 0, 0, 0.5)',
                },
            }}
        >
            <div className="bg-white rounded-lg p-5">
                <div className="text-center mb-4">
                    <img
                        src="https://www.galaxycine.vn/_next/static/media/icon-login.fbbf1b2d.svg"
                        alt="Icon Login"
                        className="mx-auto mb-4 w-48"
                    />
                    <h5 className="text-lg font-bold capitalize">Đăng nhập tài khoản</h5>
                </div>
                <form onSubmit={handleSubmit}>
                    {/* Chỉ hiển thị lỗi khi có lỗi và đã submit */}
                    {showError && errorMessage && (
                        <div className="text-red-500 text-sm mb-3">{errorMessage}</div>
                    )}

                    {/* Các trường nhập liệu */}
                    <div className="mb-4">
                        <TextField
                            fullWidth
                            label="Số điện thoại"
                            variant="outlined"
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            error={showError && !!errorMessage} // Hiển thị lỗi nếu có sau khi submit
                            helperText={showError && errorMessage && errorMessage.includes("Số điện thoại") ? errorMessage : ""}
                        />
                    </div>
                    <div className="mb-4">
                        <TextField
                            fullWidth
                            label="Mật khẩu"
                            variant="outlined"
                            type={passwordVisible ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handlePasswordVisibilityToggle}
                                            edge="end"
                                        >
                                            {passwordVisible ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            error={showError && !!errorMessage}
                            helperText={showError && errorMessage && errorMessage.includes("Mật khẩu") ? errorMessage : ""}
                        />
                    </div>
                    <div className="text-right  text-sm mt-4">
                        <a href="#" className="text-blue-500 hover:underline">
                            Quên mật khẩu?
                        </a>
                    </div>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ py: 2, mt: 2 }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Đăng nhập"}
                    </Button>

                    
                </form>

                <div className="text-center text-sm mt-6">
            <span>Bạn chưa có tài khoản? </span>
            <button 
                onClick={handleNavigateToSignUp}
                className="text-blue-500 hover:underline"
            >
                Đăng ký
            </button>
        </div>
            </div>
        </Modal>
    );
};

SignIn.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default SignIn;
