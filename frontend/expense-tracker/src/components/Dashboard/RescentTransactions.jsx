import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { INCOME, EXPENSES } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosinstance';
import { addThousandsSeparator } from '../../utils/helper';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import { LuArrowRight, LuTrendingUp, LuTrendingDown, LuEye } from 'react-icons/lu';
import moment from 'moment';

const RecentTransactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const [incomeResponse, expenseResponse] = await Promise.all([
        axiosInstance.get(`${INCOME}/get`),
        axiosInstance.get(`${EXPENSES}/all`)
      ]);

      const incomeData = incomeResponse.data.map(item => ({
        ...item,
        type: 'income',
        displayName: item.source,
        icon: item.icon || '💰',
        color: 'green'
      }));

      const expenseData = expenseResponse.data.map(item => ({
        ...item,
        type: 'expense',
        displayName: item.category,
        icon: item.icon || '💸',
        color: 'red'
      }));

      const allTransactions = [...incomeData, ...expenseData]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, showAll ? 20 : 6);

      setTransactions(allTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (transaction) => {
    if (transaction.type === 'income') {
      return <LuTrendingUp className="text-green-500" size={20} />;
    }
    return <LuTrendingDown className="text-red-500" size={20} />;
  };

  const getTransactionColor = (transaction) => {
    return transaction.type === 'income' ? 'green' : 'red';
  };

  const getTransactionAmount = (transaction) => {
    const amount = addThousandsSeparator(transaction.amount);
    return transaction.type === 'income' ? `+$${amount}` : `-$${amount}`;
  };

  const handleViewAll = () => {
    setShowAll(!showAll);
    setTimeout(() => fetchTransactions(), 100);
  };

  const handleTransactionClick = (transaction) => {
    if (transaction.type === 'income') {
      navigate('/income');
    } else {
      navigate('/expense');
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
              <LuEye className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your latest financial activities</p>
            </div>
          </div>
          <button
            onClick={handleViewAll}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {showAll ? 'Show Less' : 'View All'}
            <LuArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <LuTrendingUp className="text-white text-sm" />
              </div>
              <div>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">Income</p>
                <p className="text-lg font-bold text-green-800 dark:text-green-200">
                  ${addThousandsSeparator(totalIncome)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-700 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <LuTrendingDown className="text-white text-sm" />
              </div>
              <div>
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">Expenses</p>
                <p className="text-lg font-bold text-red-800 dark:text-red-200">
                  ${addThousandsSeparator(totalExpense)}
                </p>
              </div>
            </div>
          </div>

          <div className={`bg-gradient-to-br ${balance >= 0 ? 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700' : 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700'} border p-4 rounded-xl`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 bg-gradient-to-br ${balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-lg flex items-center justify-center`}>
                <span className="text-white text-sm font-bold">$</span>
              </div>
              <div>
                <p className={`text-xs ${balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'} font-medium`}>Balance</p>
                <p className={`text-lg font-bold ${balance >= 0 ? 'text-blue-800 dark:text-blue-200' : 'text-orange-800 dark:text-orange-200'}`}>
                  ${addThousandsSeparator(Math.abs(balance))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600 dark:text-gray-400">Loading transactions...</span>
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4 animate-bounce-gentle">📊</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No transactions found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Start adding income and expenses to see your transactions here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <div
                key={`${transaction.type}_${transaction._id}_${index}`}
                onClick={() => handleTransactionClick(transaction)}
                className="cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <TransactionInfoCard
                  title={transaction.displayName}
                  amount={getTransactionAmount(transaction)}
                  date={moment(transaction.date).format('MMM DD, YYYY')}
                  icon={transaction.icon}
                  type={transaction.type}
                  color={getTransactionColor(transaction)}
                  showDropdown={true}
                />
              </div>
            ))}
          </div>
        )}

        {transactions.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Showing {transactions.length} of {transactions.length} transactions</span>
              <button
                onClick={handleViewAll}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-300"
              >
                {showAll ? 'Show Less' : 'View All Transactions'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
