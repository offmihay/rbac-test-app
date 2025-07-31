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
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const SignUpForm = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const { signUp } = useAuthApi();

  const onSubmit = (data: FormValues) => {
    signUp.mutate(data, {
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

        <Form.Item label="Full Name (optional)">
          <Controller name="fullName" control={control} render={({ field }) => <Input {...field} />} />
        </Form.Item>
        <Paragraph>
          Don't have an account?{' '}
          <button onClick={() => navigate('/signin')}>
            <span className="text-blue-500 cursor-pointer">Sign Up</span>
          </button>
        </Paragraph>
        <Form.Item>
          <Button htmlType="submit" type="primary" block loading={signUp.isPending}>
            Sign up
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SignUpForm;
