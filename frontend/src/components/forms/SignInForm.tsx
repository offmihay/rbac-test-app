import { Button, Form, Input } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthApi } from '../../api/auth';
import Paragraph from 'antd/es/typography/Paragraph';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

const schema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be at most 32 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
});

type FormValues = z.infer<typeof schema>;

const SignInForm = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const { signIn } = useAuthApi();

  const onSubmit = (data: FormValues) => {
    signIn.mutate(data, {
      onSuccess: (data) => {
        login(data.access_token, { email: data.email, role: data.role, userId: data.sub });
        navigate('/');
      },
    });
  };

  return (
    <>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item label="Email" validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
          <Controller name="email" control={control} render={({ field }) => <Input {...field} />} />
        </Form.Item>

        <Form.Item label="Password" validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
          <Controller name="password" control={control} render={({ field }) => <Input.Password {...field} />} />
        </Form.Item>
        <Paragraph>
          Have an account?{' '}
          <button onClick={() => navigate('/signup')}>
            <span className="text-blue-500 cursor-pointer">Sign Up</span>
          </button>
        </Paragraph>
        <Form.Item>
          <Button htmlType="submit" type="primary" block loading={signIn.isPending}>
            Sign in
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SignInForm;
