import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from './LoginForm';

interface LoginData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login, state } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (loginData: LoginData) => {
    try {
      await login(loginData.email, loginData.password);
      // Redirect to home page after successful login
      navigate('/');
    } catch (error) {
      // Error is handled by the AuthContext and passed through state.error
      console.error('Login failed:', error);
    }
  };

  return (
    <LoginForm
      onSubmit={handleLogin}
      loading={state.loading}
      error={state.error || undefined}
    />
  );
}