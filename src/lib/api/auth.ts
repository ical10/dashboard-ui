import DashboardAPI from './base';

type LoginProps = {
  signedMessage: string;
  userAddress: string;
};

export const login = async ({ signedMessage, userAddress }: LoginProps) => {
  try {
    const { data } = await DashboardAPI().request({
      url: `/auth`,
      method: 'GET',
      headers: {
        signedmessage: signedMessage,
        useraddress: userAddress,
      },
    });

    return data;
  } catch (error) {
    console.log({ error });
  }
};
