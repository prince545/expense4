import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import moment from 'moment';

const DailyIncomeBarChart = ({ incomes }) => {
  // Group by date
  const grouped = incomes.reduce((acc, income) => {
    const date = moment(income.date).format('YYYY-MM-DD');
    acc[date] = (acc[date] || 0) + income.amount;
    return acc;
  }, {});

  // Convert to array and sort by date
  const data = Object.entries(grouped)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow mb-6">
      <h3 className="font-bold mb-4">Daily Income Overview</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={d => moment(d).format('DD MMM')} />
          <YAxis />
          <Tooltip formatter={v => `+$${v}`} labelFormatter={d => moment(d).format('Do MMM YYYY')} />
          <Bar dataKey="total" fill="#22c55e" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyIncomeBarChart; 