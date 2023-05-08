import Select from '@/components/Select';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { useState } from 'react';
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

const RewardTable = (data: Props) => {
  const { payload: submissionEntries, month, year } = data;

  return (
    <div className="flex flex-col justify-center items-center">
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
              <TableCell align="right">EMA7 (in USD)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissionEntries.length === 0 && <span>No data available</span>}
            {submissionEntries.length > 0 &&
              submissionEntries.map(entry => (
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
    </div>
  );
};

const RewardDetails = () => {
  // create an array of objects containing value in numbers and label in name of months
  const months = [
    {
      value: '1',
      option: 'January',
    },
    {
      value: '2',
      option: 'February',
    },
    {
      value: '3',
      option: 'March',
    },
    {
      value: '4',
      option: 'April',
    },
    {
      value: '5',
      option: 'May',
    },
    {
      value: '6',
      option: 'June',
    },
    {
      value: '7',
      option: 'July',
    },
    {
      value: '8',
      option: 'August',
    },
    {
      value: '9',
      option: 'September',
    },
    {
      value: '10',
      option: 'October',
    },
    {
      value: '11',
      option: 'November',
    },
    {
      value: '12',
      option: 'December',
    },
  ];

  const years = [
    {
      value: '2023',
      option: '2023',
    },
  ];

  const [selectedMonth, setSelectedMonth] = useState('1');
  const [selectedYear, setSelectedYear] = useState('2023');

  const { data: rewardsData, isLoading } = useSWR(
    [`${URL}/monthly_report`, selectedMonth, selectedYear],
    ([url, month, year]) => fetcher(url, month, year),
  );

  const monthValues = months.map(({ value }) => value);
  const yearValues = years.map(({ value }) => value);

  const handleSelectMonth = (item: string) => {
    setSelectedMonth(item);
  };

  const handleSelectYear = (item: string) => {
    setSelectedYear(item);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full flex flex-col gap-4">
        <Select
          options={monthValues}
          selectedItem={selectedMonth}
          label={'Month'}
          onSelect={handleSelectMonth}
        />
        <Select
          options={yearValues}
          selectedItem={selectedYear}
          label={'Year'}
          onSelect={handleSelectYear}
        />
        {isLoading && <CustomSkeleton />}
        {!isLoading && rewardsData && (
          <RewardTable payload={rewardsData.data} month={selectedMonth} year={selectedYear} />
        )}
      </div>
    </div>
  );
};

export default RewardDetails;
