import Title from 'antd/es/typography/Title';
import { useCardsApi, type CardEntity } from '../api/cards';
import CardItem from '../components/ui/CardItem';
import { useAuthStore } from '../store/auth';
import { FloatButton, Modal, notification, Switch } from 'antd';
import EditCardForm, { type CardFormValues } from '../components/forms/EditCardForm';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

type ModalFormState = {
  opened: boolean;
  defaultData: CardEntity | null;
};

const DashboardPage = () => {
  const { getActiveCards, deleteCard, createCard, updateCard, toggleLike, getUsersCards } = useCardsApi();
  const [dispayOnlyMine, setDisplayOnlyMine] = useState(false);

  const { data: activeCardsData } = getActiveCards(!dispayOnlyMine);
  const { data: usersCardsData } = getUsersCards(dispayOnlyMine);
  const user = useAuthStore((state) => state.user);

  const [modalFormState, setModalFormState] = useState<ModalFormState>({
    opened: false,
    defaultData: null,
  });

  const handleOnLike = (id: string) => {
    toggleLike.mutate(id);
  };

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

  const handleOnCreate = (data: CardFormValues) => {
    createCard.mutate(data, {
      onSuccess: () => {
        setModalFormState({ opened: false, defaultData: null });
        notification.success({ placement: 'topRight', message: 'Card successfully added' });
      },
    });
  };
  const handleOnUpdate = (data: CardFormValues) => {
    if (data.id) {
      const { id, ...needData } = data;
      updateCard.mutate(
        { data: needData, id: data.id },
        {
          onSuccess: () => {
            setModalFormState({ opened: false, defaultData: null });
            notification.success({ placement: 'topRight', message: 'Card successfully updated' });
          },
        },
      );
    }
  };
  return (
    <>
      <div className="m-4">
        <Title className="text-center" level={2}>
          Dashboard
        </Title>
        <div className="flex flex-row justify-end gap-4 mr-10">
          <p>Display only mine</p>
          <Switch checked={dispayOnlyMine} onChange={(checked) => setDisplayOnlyMine(checked)} />
        </div>
        <div className="flex flex-row flex-wrap gap-6 justify-center mt-12">
          {!dispayOnlyMine
            ? activeCardsData?.map((item) => {
                return (
                  <CardItem
                    data={item}
                    key={item.id}
                    availableActions={
                      item.publisher.id === user?.userId || user?.role === 'admin'
                        ? ['like', 'edit', 'delete']
                        : ['like']
                    }
                    onLike={handleOnLike}
                    onDelete={handleOnDelete}
                    onEdit={handleOnEdit}
                  />
                );
              })
            : usersCardsData?.map((item) => {
                return (
                  <CardItem
                    data={item}
                    key={item.id}
                    availableActions={
                      item.publisher.id === user?.userId || user?.role === 'admin'
                        ? ['like', 'edit', 'delete']
                        : ['like']
                    }
                    onLike={handleOnLike}
                    onDelete={handleOnDelete}
                    onEdit={handleOnEdit}
                  />
                );
              })}
        </div>
      </div>
      {user?.role !== 'visitor' && (
        <FloatButton
          shape="circle"
          type="primary"
          style={{ insetInlineEnd: 94 }}
          icon={<PlusOutlined />}
          onClick={() => setModalFormState({ defaultData: null, opened: true })}
        />
      )}
      <Modal
        title={modalFormState.defaultData ? 'Edit card' : 'Create Card'}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={modalFormState.opened}
        onCancel={() => setModalFormState({ defaultData: null, opened: false })}
        okButtonProps={{ style: { display: 'none' } }}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div className="mt-4">
          <EditCardForm
            key={modalFormState.defaultData?.id ?? 'create'}
            isLoading={createCard.isPending || updateCard.isPending}
            onSubmit={modalFormState.defaultData ? handleOnUpdate : handleOnCreate}
            defaultData={modalFormState.defaultData}
          />
        </div>
      </Modal>
    </>
  );
};

export default DashboardPage;
