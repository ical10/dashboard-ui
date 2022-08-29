import {faker} from '@faker-js/faker';

import * as React from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Entries',
    },
  },
};

const labels = ['1st', '2nd', '3rd', '4th week'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Sites reported',
      data: labels.map(() => faker.datatype.number({min: 0, max: 200})),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

const EntriesBarChart = () => {
  return <Bar options={options} data={data} />;
};

export default EntriesBarChart;
