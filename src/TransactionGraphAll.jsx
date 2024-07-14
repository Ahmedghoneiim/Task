import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { MoonLoader } from 'react-spinners';

const TransactionGraphAll = () => {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c', '#d0ed57', '#a4c8e0', '#d84b2a', '#ff84c0'
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const customersRes = await axios.get('https://ahmedghoneiim.github.io/host_api/data.json');
        const transactionsRes = await axios.get('https://ahmedghoneiim.github.io/host_api/data.json');
        setCustomers(customersRes.data.customers);
        setTransactions(transactionsRes.data.transactions);


        const data = transactionsRes.data.transactions.reduce((acc, transaction) => {
          const date = transaction.date;
          if (!acc[date]) {
            acc[date] = { date };
            customersRes.data.customers.forEach(customer => {
              acc[date][customer.name] = 0;
            });
          }
          const customer = customersRes.data.customers.find(c => c.id === transaction.customer_id);
          if (customer) {
            acc[date][customer.name] += transaction.amount;
          }
          return acc;
        }, {});
        setGraphData(Object.values(data));
        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className='flex items-center justify-center py-16'><MoonLoader /></div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (<React.Fragment>
              <div className="p-6"> 
      <h2 className="text-2xl font-bold  text-white bg-slate-500 rounded p-1 inline-block mb-20">Transaction Graph All Customers</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={graphData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {customers.map((customer, index) => (
            <Line
              key={customer.id}
              type="monotone"
              dataKey={customer.name}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
              </div>
          </React.Fragment>

  );
};

export default TransactionGraphAll;
