import Select from '@/components/Select';
import { UserRole } from '@/types/db';
import { UserDataProps } from '@/types/user';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import * as React from 'react';

import CustomSkeleton from './CustomSkeleton';

import axios from 'axios';
import useSWR from 'swr';

const URL = 'https://antiscam-api.paranodes.io';
const fetcher = (url: string, month: string, year: string) =>
  axios
    .get(url, {
      params: {
        month,
        year,
      },
    })
    .then(res => res.data);

interface SubmissionEntry {
  user: {
    id: number;
    identifier: string;
    public_address: string;
    status_id: number;
    createdAt: string;
    updatedAt: string;
  };
  count: number;
  reward_dollar: number;
  reward_dot: number;
  ema7: string;
}

interface Props {
  payload: SubmissionEntry[];
  month: string;
  year: string;
}

const BasicTable = (data: Props) => {
  const { payload: submissionEntries, month, year } = data;

  return (
    <>
      <h3>
        Period: {month}-{year}
      </h3>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Implementers</TableCell>
              <TableCell align="right">Total eligibles</TableCell>
              <TableCell align="right">Total in USD</TableCell>
              <TableCell align="right">Total in DOT</TableCell>
              <TableCell align="right">EMA7</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissionEntries.map(entry => (
              <TableRow
                key={entry.user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {entry.user.identifier}
                </TableCell>
                <TableCell align="right">{entry.count}</TableCell>
                <TableCell align="right">{entry.reward_dollar}</TableCell>
                <TableCell align="right">{entry.reward_dot}</TableCell>
                <TableCell align="right">{entry.ema7}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const RewardDetails = () => {
  const MONTH = '1';
  const YEAR = '2023';

  const { data: rewardsData, isLoading } = useSWR(
    [`${URL}/monthly_report`, MONTH, YEAR],
    ([url, month, year]) => fetcher(url, month, year),
  );

  if (isLoading) return <CustomSkeleton />;

  return <BasicTable payload={rewardsData.data} month={MONTH} year={YEAR} />;
};

export default RewardDetails;
