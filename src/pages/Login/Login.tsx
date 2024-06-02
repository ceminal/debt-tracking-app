import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.scss';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { DataValues } from '../../interfaces/DataValues';
import { useNavigate } from 'react-router-dom';


const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values: DataValues) => {
    try {
      const response = await axios.post('https://study.logiper.com/auth/login', {
        email: values.email,
        password: values.password,
      });
  
      if (response.status === 200 || response.status === 201) {
        const token = response.data.data; 
  
        if (token) {
          localStorage.setItem('token', token); 
  
          const { email } = values; 
          message.success('Giriş Başarılı!');
          
          dispatch(login({ name: '', email, token }));
          navigate('/dashboard');
        } else {
          message.error('Token eksik.');
        }
      } else {
        message.error('Giriş Başarısız.');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          message.error(`Giriş Başarısız: ${error.response.data.message}`);
        } else {
          message.error('An error occurred during login.');
        }
      } else {
        message.error('An unexpected error occurred.');
      }
    }
  };

  const handleNavigate = () => {
    navigate('/register');
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h3 className='login-title'>LOGIN</h3>
        <Form
          name="loginForm"
          onFinish={onFinish}
          style={{ width: 300 }}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Lütfen e-mailinizi girin!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
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

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Giriş Yap
            </Button>
          </Form.Item>

          <Form.Item>
            <div onClick={handleNavigate} style={{ textAlign: "center" }} ><a href="">Kayıt Ol!</a></div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
