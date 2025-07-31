import Title from 'antd/es/typography/Title';
import { useCardsApi, type CardEntity } from '../api/cards';
import CardItem from '../components/ui/CardItem';
import { useAuthStore } from '../store/auth';
import { useState } from 'react';
import { Modal, notification } from 'antd';
import EditCardForm, { type CardFormValues } from '../components/forms/EditCardForm';

type ModalFormState = {
  opened: boolean;
  defaultData: CardEntity | null;
};

const ApprovalPage = () => {
  const { getAwaitingCards, updateCard, deleteCard, approveCard } = useCardsApi();
  const { data } = getAwaitingCards();
  const user = useAuthStore((state) => state.user);

  const [modalFormState, setModalFormState] = useState<ModalFormState>({
    opened: false,
    defaultData: null,
  });

  const handleOnDelete = (id: string) => {
    Modal.confirm({
      title: 'Confirm',
      content: 'Are you sure you want to delete this card?',
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      ),
      onOk: () => {
        deleteCard.mutate(id);
      },
      centered: true,
    });
  };

  const handleOnEdit = (data: CardEntity) => {
    setModalFormState({
      defaultData: data,
      opened: true,
    });
  };

  const handleOnApprove = (id?: string, data?: CardFormValues) => {
    Modal.confirm({
      title: 'Confirm',
      content: 'Are you sure you want to approve this card?',
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      ),
      onOk: () => {
        if (data && data.id) {
          const { id, ...needData } = data;
          updateCard.mutate({ data: needData, id: data.id });
        }
        if (id) {
          approveCard.mutate(
            { id, isApproved: true },
            {
              onSuccess: () => {
                setModalFormState({ opened: false, defaultData: null });
                notification.success({ placement: 'topRight', message: 'Card successfully approved' });
              },
            },
          );
        }
      },
      centered: true,
    });
  };

  return (
    <>
      <div className="m-4">
        <Title className="text-center" level={2}>
          Awaiting for approval
        </Title>
        <div className="flex flex-row flex-wrap gap-6 justify-center">
          {data?.map((item) => {
            return (
              <CardItem
                data={item}
                key={item.id}
                availableActions={user?.role === 'admin' ? ['edit', 'delete', 'approve'] : ['delete']}
                onDelete={handleOnDelete}
                onEdit={handleOnEdit}
                onApprove={handleOnApprove}
              />
            );
          })}
        </div>
      </div>
      <Modal
        title="Approve Card"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={modalFormState.opened}
        onCancel={() => setModalFormState({ defaultData: null, opened: false })}
        okButtonProps={{ style: { display: 'none' } }}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div className="mt-4">
          <EditCardForm
            key={modalFormState.defaultData?.id ?? 'create'}
            isLoading={updateCard.isPending}
            onSubmit={(data) => handleOnApprove(data.id, data)}
            defaultData={modalFormState.defaultData}
          />
        </div>
      </Modal>
    </>
  );
};

export default ApprovalPage;
