import { useState, useEffect } from 'react';
import { Button, TextField, FormHelperText, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        sex: '',
        birthdate: '',
        area: '',
        role_id: 1, // mặc định vai trò
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading
    const [provinces, setProvinces] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const toast = useToast();

    // Gọi API lấy danh sách tỉnh/thành phố
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch('https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1');
                const result = await response.json();

                if (result.exitcode === 1 && result.data && Array.isArray(result.data.data)) {
                    setProvinces(result.data.data);
                } else {
                    console.error('Dữ liệu khu vực không hợp lệ:', result);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu khu vực:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProvinces();
    }, []);

    const handleProvinceChange = (event) => {
        const selectedProvince = event.target.value;
        setSelectedProvince(selectedProvince);
        setFormData({ ...formData, area: selectedProvince });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Hàm tính tuổi
    const calculateAge = (birthdate) => {
        const birthDate = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();

        if (month < birthDate.getMonth() || (month === birthDate.getMonth() && day < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Họ và tên là bắt buộc';
            valid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email là bắt buộc';
            valid = false;
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Số điện thoại là bắt buộc';
            valid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc';
            valid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp';
            valid = false;
        }

        if (!formData.sex) {
            newErrors.sex = 'Giới tính là bắt buộc';
            valid = false;
        }

        if (!formData.birthdate) {
            newErrors.birthdate = 'Ngày sinh là bắt buộc';
            valid = false;
        } else {
            // Kiểm tra tuổi >= 16
            const age = calculateAge(formData.birthdate);
            if (age < 16) {
                newErrors.birthdate = 'Bạn phải đủ 16 tuổi để đăng ký';
                valid = false;
            }
        }

        if (!formData.area) {
            newErrors.area = 'Khu vực là bắt buộc';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true); // Bắt đầu loading

        try {
            const response = await fetch('http://localhost:8080/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: 'Đăng ký thành công!',
                    description: 'Tài khoản của bạn đã được tạo thành công.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-right'
                });
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    password: '',
                    confirmPassword: '',
                    sex: '',
                    birthdate: '',
                    area: '',
                    role_id: 1,
                });
                navigate("/")
            } else {
                toast({
                    title: 'Đăng ký không thành công.',
                    description: data.message || 'Vui lòng thử lại sau.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-right',
                });
            }
        } catch (error) {
            toast({
                title: 'Lỗi kết nối.',
                description: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-right',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-5">
            <div className="text-center mb-4">
                <h5 className="text-lg font-bold">Đăng ký tài khoản</h5>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <TextField
                        fullWidth
                        label="Họ và tên"
                        variant="outlined"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                    {errors.fullName && <FormHelperText error>{errors.fullName}</FormHelperText>}
                </div>

                <div className="mb-4">
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                </div>

                <div className="mb-4">
                    <TextField
                        fullWidth
                        label="Số điện thoại"
                        variant="outlined"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                    {errors.phone && <FormHelperText error>{errors.phone}</FormHelperText>}
                </div>

                <div className="mb-4">
                    <TextField
                        fullWidth
                        label="Mật khẩu"
                        variant="outlined"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-4">
                    <TextField
                        fullWidth
                        label="Xác nhận mật khẩu"
                        variant="outlined"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    {errors.confirmPassword && <FormHelperText error>{errors.confirmPassword}</FormHelperText>}
                </div>

                {/* Giới tính */}
                <div className="mb-4">
                    <FormControl fullWidth>
                        <InputLabel>Giới tính</InputLabel>
                        <Select
                            name="sex"
                            value={formData.sex}
                            onChange={handleChange}
                            required
                        >
                            <MenuItem value="Male">Nam</MenuItem>
                            <MenuItem value="Female">Nữ</MenuItem>
                            <MenuItem value="Other">Khác</MenuItem>
                        </Select>
                    </FormControl>
                    {errors.sex && <FormHelperText error>{errors.sex}</FormHelperText>}
                </div>

                {/* Ngày sinh */}
                <div className="mb-4">
                    <TextField
                        fullWidth
                        label="Ngày sinh"
                        variant="outlined"
                        type="date"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    {errors.birthdate && <FormHelperText error>{errors.birthdate}</FormHelperText>}
                </div>

                {/* Khu vực */}
                <div className="mb-4">
                    <FormControl fullWidth error={!!errors.area}>
                        <InputLabel>Chọn khu vực</InputLabel>
                        <Select
                            value={formData.area}
                            label="Chọn khu vực"
                            onChange={handleProvinceChange}
                            displayEmpty
                        >
                            <MenuItem value="">
                                <em>Chọn khu vực</em>
                            </MenuItem>
                            {provinces.map((province) => (
                                <MenuItem key={province._id} value={province.name}>
                                    {province.name_with_type}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.area && <FormHelperText>{errors.area}</FormHelperText>}
                    </FormControl>
                    {errors.area && <FormHelperText error>{errors.area}</FormHelperText>}
                </div>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading} // Disable button khi đang loading
                >
                    {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>

                <div className="text-center mt-4">
                    <span>Đã có tài khoản? </span>
                    <a href="/dang-nhap" className="text-blue-500 hover:underline">
                        Đăng nhập
                    </a>
                </div>
            </form>
        </div>
    );
};

export default SignUp;
