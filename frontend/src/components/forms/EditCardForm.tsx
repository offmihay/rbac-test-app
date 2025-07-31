import { Button, Form, Input, Select } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { categoryTranslations, languageTranslations } from '../../constants/card';
import type { CardEntity } from '../../api/cards';

const schema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  language: z.string().min(1, 'Language is required'),
  imageUrl: z.url(),
});

export type CardFormValues = z.infer<typeof schema>;

type Props = {
  onSubmit: (data: CardFormValues) => void;
  isLoading: boolean;
  defaultData: CardEntity | null;
  submitText?: string;
};

const EditCardForm: React.FC<Props> = ({ onSubmit: onSubmitData, isLoading, defaultData, submitText = 'Sumbit' }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CardFormValues>({
    defaultValues: {
      imageUrl: defaultData?.imageUrl || '',
      description: defaultData?.description || '',
      category: defaultData?.category || '',
      language: defaultData?.language || '',
      id: defaultData?.id,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: CardFormValues) => {
    onSubmitData(data);
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Form.Item
        label="Description"
        validateStatus={errors.description ? 'error' : ''}
        help={errors.description?.message}
      >
        <Controller name="description" control={control} render={({ field }) => <Input {...field} />} />
      </Form.Item>

      <Form.Item label="Category" validateStatus={errors.category ? 'error' : ''} help={errors.category?.message}>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={Object.entries(categoryTranslations).map(([value, label]) => ({ value, label }))}
              placeholder="Select a person"
            />
          )}
        />
      </Form.Item>

      <Form.Item label="Language" validateStatus={errors.language ? 'error' : ''} help={errors.language?.message}>
        <Controller
          name="language"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={Object.entries(languageTranslations).map(([value, label]) => ({ value, label }))}
            />
          )}
        />
      </Form.Item>

      <Form.Item label="Image URL" validateStatus={errors.imageUrl ? 'error' : ''} help={errors.imageUrl?.message}>
        <Controller name="imageUrl" control={control} render={({ field }) => <Input {...field} />} />
      </Form.Item>
      {defaultData?.publisher && (
        <Form.Item label="Publisher">
          <Input value={defaultData.publisher.fullName || defaultData.publisher.email} disabled />
        </Form.Item>
      )}
      <Form.Item>
        <div className="mt-">
          <Button htmlType="submit" type="primary" block loading={isLoading}>
            {submitText}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default EditCardForm;
