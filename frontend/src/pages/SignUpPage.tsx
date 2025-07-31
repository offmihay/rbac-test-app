import Title from 'antd/es/typography/Title';
import SignUpForm, { type SignUpFormValues } from '../components/forms/SignUpForm';
import { useAuthApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

const SignUpPage = () => {
  const { signUp } = useAuthApi();

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (data: SignUpFormValues) => {
    signUp.mutate(data, {
      onSuccess: (data) => {
        login(data.access_token, { email: data.email, role: data.role, userId: data.sub });
        navigate('/');
      },
    });
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="w-full max-w-sm px-4">
        <Title>Sign Up</Title>
        <SignUpForm onSubmit={handleSubmit} isLoading={signUp.isPending} />
      </div>
    </div>
  );
};

export default SignUpPage;
