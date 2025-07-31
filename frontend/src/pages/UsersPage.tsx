import Title from 'antd/es/typography/Title';
import { useUserApi } from '../api/users';
import { Card, notification, Switch } from 'antd';

const UsersPage = () => {
  const { getUsers, updateUserRole } = useUserApi();
  const { data } = getUsers();

  const handleOnChange = (checked: boolean, id: string) => {
    updateUserRole.mutate(
      { id, role: checked ? 'publisher' : 'visitor' },
      {
        onSuccess: (data) => {
          notification.success({
            placement: 'topRight',
            message: `${data.email} role successfully updated to: ${data.role}`,
          });
        },
      },
    );
  };
  return (
    <>
      <div className="m-4">
        <Title className="text-center" level={2}>
          Users Management (make publisher)
        </Title>
        <div className="flex flex-col gap-2 items-center mt-8">
          {data?.map((user) => (
            <Card style={{ maxWidth: '700px', width: '100%' }}>
              <div className="flex justify-between">
                <p>{user.email}</p>
                <Switch checked={user.role === 'publisher'} onChange={(checked) => handleOnChange(checked, user.id)} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default UsersPage;
