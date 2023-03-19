import type { NextApiRequest, NextApiResponse } from 'next';

import DashboardAPI from 'src/lib/api/base';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') throw new Error('method not allowed!');

  if (!req.body || !req.headers) throw new Error('Request malformed!');

  const { body, headers } = req;
  const { authorization } = headers;

  const { payload, address } = JSON.parse(body);

  console.log({ payload, authorization, address });

  const { data } = await DashboardAPI().request({
    url: '/create',
    method: 'POST',
    data: payload,
    headers: {
      signedmessage: authorization,
      useraddress: address,
    },
  });

  // Example of a response with 200 code
  //   {
  //     data: {
  //       message: '2 URL(s) were processed.',
  //       status: 1,
  //       data: [ [Object], [Object] ]
  //     }
  //   }

  res.status(200).json({ data });
};

export default handler;
