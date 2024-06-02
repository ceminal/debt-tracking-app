import './Register.scss';
import axios from 'axios';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { DataValues } from '../../interfaces/DataValues';

const Register: React.FC = () => {
    const navigate = useNavigate();


    const onFinish = async (values: DataValues) => {
        try {
            const response = await axios.post('https://study.logiper.com/auth/register', {
                email: values.email,
                password: values.password,
                name: values.name 
            });
            if (response.status === 200 || response.status === 201) {
                message.success('Kayıt başarılı!');
                navigate('/login');
            } else {
                message.error('Kayıt işlemi başarısız.');
            }
        } catch (error) {
            message.error('error');
        }
    };

    const navigateToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="register-container">
            <div className="register-form">
                <h3 className='register-title'>REGISTER</h3>
                <Form
                    name="register"
                    onFinish={onFinish}
                    style={{ width: 300 }}
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Lütfen emailinizi girin!' },
                            { type: 'email', message: 'Lütfen geçerli email adresi girin!' }
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Lütfen adınızı girin!' }]}
                    >
                        <Input placeholder="Full Name" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        rules={[
                            { required: true, message: 'Lütfen şifrenizi tekrar girin!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Şifreler uyuşmuyor!'));
                                },
                            }),
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Confirm Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="register-form-button">
                            Kayıt Ol
                        </Button>
                        <Button type="default" onClick={navigateToLogin} className="register-form-button">
                            İptal
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Register;
