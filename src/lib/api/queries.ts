import DashboardAPI from './base';

// type LoginProps = {
//   signedMessage: string;
//   userAddress: string;
// };

export const getASubmission = async (id: string) => {
  try {
    const { data } = await DashboardAPI().request({
      url: `/find/${id}`,
      method: 'GET',
      //   headers: {
      //     signedmessage: signedMessage,
      //     useraddress: userAddress,
      //   },
    });

    return data;
  } catch (error) {
    console.log({ error });
  }
};
