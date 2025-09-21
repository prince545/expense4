import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { INCOME, INCOME_DOWNLOAD } from '../../../utils/apiPaths';
import axiosInstance from '../../../utils/axiosinstance';
import { addThousandsSeparator } from '../../../utils/helper';
import { toast } from 'react-hot-toast';
import { LuTrash2, LuDownload, LuPlus, LuTrendingUp, LuCalendar, LuDollarSign } from 'react-icons/lu';
import moment from 'moment';
import DailyIncomeBarChart from '../../../components/Dashboard/DailyIncomeBarChart';

const Income = () => {
  const navigate = useNavigate();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    icon: '💰'
  });

  const incomeSources = [
    { value: 'Salary', label: '💰 Salary', color: 'from-green-500 to-green-600' },
    { value: 'Freelance', label: '💼 Freelance', color: 'from-blue-500 to-blue-600' },
    { value: 'Business', label: '🏢 Business', color: 'from-purple-500 to-purple-600' },
    { value: 'Investment', label: '📈 Investment', color: 'from-yellow-500 to-yellow-600' },
    { value: 'Gift', label: '🎁 Gift', color: 'from-pink-500 to-pink-600' },
    { value: 'Other', label: '📦 Other', color: 'from-gray-500 to-gray-600' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchIncomes();
  }, [navigate]);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`${INCOME}/get`);
      setIncomes(response.data);
    } catch (error) {
      console.error('Error fetching incomes:', error);
      toast.error('Failed to load incomes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`${INCOME}/add`, formData);
      toast.success('Income added successfully!');
      setFormData({
        source: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        icon: '💰'
      });
      setShowForm(false);
      fetchIncomes();
    } catch (error) {
      console.error('Error adding income:', error);
      toast.error('Failed to add income');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this income?')) {
      return;
    }
    try {
      await axiosInstance.delete(`${INCOME}/${id}`);
      toast.success('Income deleted successfully!');
      fetchIncomes();
    } catch (error) {
      console.error('Error deleting income:', error);
      toast.error('Failed to delete income');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(INCOME_DOWNLOAD, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'income.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Income data downloaded successfully!');
    } catch (error) {
      console.error('Error downloading income:', error);
      toast.error('Failed to download income data');
    }
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const thisMonthIncome = incomes
    .filter(income => moment(income.date).isSame(moment(), 'month'))
    .reduce((sum, income) => sum + income.amount, 0);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Income Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage your income sources</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <LuDownload size={18} />
              Download Excel
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <LuPlus size={18} />
              Add Income
            </button>
          </div>
        </div>

        {/* Daily Income Bar Chart */}
        <DailyIncomeBarChart incomes={incomes} />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <LuTrendingUp className="text-white text-2xl" />
              </div>
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Total Income</p>
                <h2 className="text-2xl font-bold text-green-800 dark:text-green-200">
                  ${addThousandsSeparator(totalIncome)}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <LuCalendar className="text-white text-2xl" />
              </div>
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">This Month</p>
                <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  ${addThousandsSeparator(thisMonthIncome)}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Add Income Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg animate-slide-up">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Add New Income</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Source
                  </label>
                  <select
                    required
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                  >
                    <option value="">Select income source</option>
                    {incomeSources.map(source => (
                      <option key={source.value} value={source.value}>{source.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <LuDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Icon
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                    placeholder="💰"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Add Income
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-500 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Incomes List */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Income</h3>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600 dark:text-gray-400 text-lg">Loading incomes...</span>
              </div>
            </div>
          ) : incomes.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4 animate-bounce-gentle">💰</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No income records found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
                Start tracking your income by adding your first income record
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Add Your First Income
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {incomes.map((income) => (
                <div key={income._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-xl">
                          {income.icon || '💰'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{income.source}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {moment(income.date).format('MMM DD, YYYY')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        +${addThousandsSeparator(income.amount)}
                      </span>
                      <button
                        onClick={() => handleDelete(income._id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-300"
                        title="Delete income"
                      >
                        <LuTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Income;