import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { EXPENSES, EXPENSES_DOWNLOAD } from '../../../utils/apiPaths';
import axiosInstance from '../../../utils/axiosinstance';
import { addThousandsSeparator } from '../../../utils/helper';
import { toast } from 'react-hot-toast';
import { LuTrash2, LuDownload, LuPlus, LuTrendingDown, LuCalendar, LuDollarSign, LuChevronRight, LuChevronLeft } from 'react-icons/lu';
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Expense = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    icon: '💸'
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  const expenseCategories = [
    { value: 'Food', label: '🍕 Food', color: 'from-orange-500 to-orange-600' },
    { value: 'Transport', label: '🚗 Transport', color: 'from-blue-500 to-blue-600' },
    { value: 'Shopping', label: '🛍️ Shopping', color: 'from-pink-500 to-pink-600' },
    { value: 'Bills', label: '📄 Bills', color: 'from-red-500 to-red-600' },
    { value: 'Entertainment', label: '🎬 Entertainment', color: 'from-purple-500 to-purple-600' },
    { value: 'Health', label: '🏥 Health', color: 'from-green-500 to-green-600' },
    { value: 'Education', label: '📚 Education', color: 'from-indigo-500 to-indigo-600' },
    { value: 'Other', label: '📦 Other', color: 'from-gray-500 to-gray-600' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchExpenses();
  }, [navigate]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`${EXPENSES}/all`);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Only convert to number if not empty
    const payload = {
      ...formData,
      amount: formData.amount === "" ? 0 : parseFloat(formData.amount)
    };
    try {
      await axiosInstance.post(`${EXPENSES}/add`, payload);
      toast.success('Expense added successfully!');
      setFormData({
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        icon: '💸'
      });
      setShowForm(false);
      fetchExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }
    try {
      await axiosInstance.delete(`${EXPENSES}/${id}`);
      toast.success('Expense deleted successfully!');
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(EXPENSES_DOWNLOAD, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expense.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Expense data downloaded successfully!');
    } catch (error) {
      console.error('Error downloading expense:', error);
      toast.error('Failed to download expense data');
    }
  };

  // Prepare data for line chart: group by date and sum
  const dailyData = Object.values(expenses.reduce((acc, expense) => {
    const date = moment(expense.date).format('YYYY-MM-DD');
    acc[date] = acc[date] || { date, total: 0 };
    acc[date].total += expense.amount;
    return acc;
  }, {})).sort((a, b) => new Date(a.date) - new Date(b.date));

  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonthExpense = expenses
    .filter(expense => moment(expense.date).isSame(moment(), 'month'))
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="space-y-6">
        {/* Expense Overview Line Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Expense Overview</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Track your spending trends over time and gain insights into where your money goes.</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <LuPlus size={18} />
              Add Expense
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={d => moment(d).format('D MMM')} />
              <YAxis />
              <Tooltip formatter={v => `-$${v}`} labelFormatter={d => moment(d).format('Do MMM YYYY')} />
              <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} fillOpacity={1} fill="url(#colorExpense)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Add Expense Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg animate-slide-up">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Add New Expense</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                  >
                    <option value="">Select expense category</option>
                    {expenseCategories.map(category => (
                      <option key={category.value} value={category.value}>{category.label}</option>
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
                      onChange={e => setFormData({ ...formData, amount: e.target.value })}
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
                    placeholder="💸"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!formData.amount || isNaN(parseFloat(formData.amount))}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Add Expense
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
        {/* Download Excel Section */}
        <div className="bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-800/20 border border-red-200 dark:border-red-700 rounded-2xl p-6 shadow-lg flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-1 flex items-center gap-2">
              <LuDownload size={20} /> Download Expenses
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Export your expense data as an Excel file for offline analysis or sharing.</p>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <LuDownload size={18} />
            Download Excel
          </button>
        </div>
        {/* Expenses List */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Expenses</h3>
          </div>
          {loading ? (
            <div className="p-12 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600 dark:text-gray-400 text-lg">Loading expenses...</span>
              </div>
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4 animate-bounce-gentle">💸</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No expense records found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
                Start tracking your expenses by adding your first expense record
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Add Your First Expense
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {expenses.map((expense) => (
                <div key={expense._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-xl">
                          {expense.icon || '💸'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{expense.category}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {moment(expense.date).format('MMM DD, YYYY')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-red-600 dark:text-red-400">
                        -${addThousandsSeparator(expense.amount)}
                      </span>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-300"
                        title="Delete expense"
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

export default Expense;