import Title from 'antd/es/typography/Title';
import SignUpForm from '../components/forms/SignUpForm';

const SignUpPage = () => {
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="w-full max-w-sm px-4">
        <Title>Sign Up</Title>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
