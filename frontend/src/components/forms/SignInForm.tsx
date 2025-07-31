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
    .max(32, 'Password must be at most 32 characters'),
});

export type SignInFormValues = z.infer<typeof schema>;

type Props = {
  onSubmit: (data: SignInFormValues) => void;
  isLoading: boolean;
};

const SignInForm: React.FC<Props> = ({ onSubmit: onSubmitData, isLoading }) => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: SignInFormValues) => {
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
        <Paragraph>
          Have an account?{' '}
          <button onClick={() => navigate('/signup')}>
            <span className="text-blue-500 cursor-pointer">Sign Up</span>
          </button>
        </Paragraph>
        <Form.Item>
          <Button htmlType="submit" type="primary" block loading={isLoading}>
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SignInForm;
