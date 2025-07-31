import { Card } from 'antd';
import { EditOutlined, LikeFilled, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import type { CardEntity } from '../../api/cards';
import { categoryTranslations } from '../../constants/card';

type Props = {
  data: CardEntity;
  onLike?: (id: string) => void;
  onEdit?: (card: CardEntity) => void;
  onDelete?: (id: string) => void;
  onApprove?: (id: string) => void;
  availableActions: ('like' | 'edit' | 'delete' | 'approve')[];
};

const CardItem: React.FC<Props> = ({ data, onDelete, onEdit, onLike, onApprove, availableActions }) => {
  const availableActionsObj = {
    like: (
      <p onClick={() => onLike?.(data.id)}>
        <span className="mr-1.5">
          <LikeFilled key="like" style={data.isLiked ? { color: '#1890ff' } : undefined} />
        </span>
        {!!data.likeCount && <span>{data.likeCount}</span>}
      </p>
    ),
    edit: (
      <p>
        <EditOutlined key="edit" onClick={() => onEdit?.(data)} />
      </p>
    ),
    delete: (
      <p>
        <DeleteOutlined key="delete" onClick={() => onDelete?.(data.id)} />
      </p>
    ),
    approve: (
      <p>
        <CheckOutlined key="approve" onClick={() => onApprove?.(data.id)} />
      </p>
    ),
  };
  const actions: React.ReactNode[] = availableActions.map((action) => availableActionsObj[action]);

  return (
    <Card
      actions={actions}
      style={{ width: 300 }}
      cover={
        <div style={{ height: 300, overflow: 'hidden' }}>
          <img alt="example" src={data.imageUrl || ''} className="w-full h-full object-cover" />
        </div>
      }
      hoverable
    >
      <Card.Meta title={data.description} />
      <p className="mt-4">
        <span className="font-bold">Category:</span> {categoryTranslations[data.category]}
      </p>
      <p>
        <span className="font-bold">Published by:</span> {data.publisher.fullName || data.publisher.email}
      </p>
    </Card>
  );
};

export default CardItem;
