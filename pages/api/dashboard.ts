import type { NextApiRequest, NextApiResponse } from 'next';

import DashboardAPI from 'src/lib/api/base';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') throw new Error('method not allowed!');

  if (!req.body || !req.headers) throw new Error('Request malformed!');

  const { body, headers } = req;
  const { authorization } = headers;

  const { address } = JSON.parse(body);

  const { data } = await DashboardAPI().request({
    url: '/find',
    method: 'GET',
    headers: {
      signedmessage: authorization,
      useraddress: address,
    },
  });

  //   id: 3,
  //   domainname: 'www.react.app',
  //   usid: '3',
  //   proof: null,
  //   exists_in_repo: null,
  //   exists_in_db: null,
  //   eligible_takendown: null,
  //   eligible_submitted: null,
  //   ineligible_submitted: null,
  //   pull_request_id: null,
  //   status_id: 1,
  //   submitted_by: 1,
  //   createdAt: '2022-07-24T14:14:39.000Z',
  //   updatedAt: '2022-07-24T14:14:39.000Z'

  res.status(200).json({ data });
};

export default handler;
