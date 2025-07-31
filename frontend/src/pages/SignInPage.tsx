import Title from 'antd/es/typography/Title';
import SignInForm, { type SignInFormValues } from '../components/forms/SignInForm';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useAuthApi } from '../api/auth';

const SignInPage = () => {
  const { signIn } = useAuthApi();

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (data: SignInFormValues) => {
    signIn.mutate(data, {
      onSuccess: (data) => {
        login(data.access_token, { email: data.email, role: data.role, userId: data.sub });
        navigate('/');
      },
    });
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="w-full max-w-sm px-4">
        <Title>Sign In</Title>
        <SignInForm onSubmit={handleSubmit} isLoading={signIn.isPending} />
      </div>
    </div>
  );
};

export default SignInPage;
