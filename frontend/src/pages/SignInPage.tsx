import Title from 'antd/es/typography/Title';
import SignInForm from '../components/forms/SignInForm';

const SignInPage = () => {
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="w-full max-w-sm px-4">
        <Title>Sign In</Title>
        <SignInForm />
      </div>
    </div>
  );
};

export default SignInPage;
