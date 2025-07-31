import { Button, Form, Input } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Paragraph from 'antd/es/typography/Paragraph';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be at most 32 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  fullName: z.string().optional(),
});

export type SignUpFormValues = z.infer<typeof schema>;

type Props = {
  onSubmit: (data: SignUpFormValues) => void;
  isLoading: boolean;
};

const SignUpForm: React.FC<Props> = ({ onSubmit: onSubmitData, isLoading }) => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: SignUpFormValues) => {
    onSubmitData(data);
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
            <span className="text-blue-500 cursor-pointer">Sign In</span>
          </button>
        </Paragraph>
        <Form.Item>
          <Button htmlType="submit" type="primary" block loading={isLoading}>
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SignUpForm;
