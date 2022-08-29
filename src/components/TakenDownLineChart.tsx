import {faker} from '@faker-js/faker';

import React from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    title: {
      display: true,
      text: 'Taken down',
    },
  },
};

const labels = ['1st', '2nd', '3rd', '4th week'];

export const data = {
  labels,
  datasets: [
    {
      label: 'This month',
      data: labels.map(() => faker.datatype.number({min: 0, max: 80})),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Average (this month)',
      data: labels.map(() => faker.datatype.number({min: 0, max: 80})),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderDash: [10, 5],
    },

    {
      label: 'Last month',
      data: labels.map(() => faker.datatype.number({min: 0, max: 80})),
      borderColor: 'rgba(0, 0, 0, 0.12)',
      backgroundColor: 'transparent',
    },
    {
      label: 'Average (last month)',
      data: labels.map(() => faker.datatype.number({min: 0, max: 80})),
      borderColor: 'rgba(0, 0, 0, 0.12)',
      backgroundColor: 'transparent',
      borderDash: [10, 5],
    },
  ],
};

const TakenDownLineChart = () => {
  return <Line options={options} data={data} />;
};

export default TakenDownLineChart;
