import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/connect');
    } else {
      navigate('/login?error=auth_failed');
    }
  }, [navigate, searchParams]);

  return <div>Processing authentication...</div>;
};

export default AuthCallback; 