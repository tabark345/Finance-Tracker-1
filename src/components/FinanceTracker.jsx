import  { useState, useEffect } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other Income']
const expenseCategories = ['Housing', 'Transportation', 'Food', 'Utilities', 'Insurance', 'Healthcare', 'Debt', 'Personal', 'Entertainment', 'Other Expenses']

export default function FinanceTracker() {
  const [user, setUser] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [type, setType] = useState('income')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'))
    if (storedUser) {
      setUser(storedUser)
      const storedTransactions = JSON.parse(localStorage.getItem(`transactions_${storedUser.email}`) || '[]')
      setTransactions(storedTransactions)
    }
  }, [])

  const handleAuth = (e) => {
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if (isRegistering) {
      if (users.some(u => u.email === email)) {
        alert('User already exists')
        return
      }
      const newUser = { email, password }
      localStorage.setItem('users', JSON.stringify([...users, newUser]))
      setUser(newUser)
      localStorage.setItem('currentUser', JSON.stringify(newUser))
    } else {
      const user = users.find(u => u.email === email && u.password === password)
      if (user) {
        setUser(user)
        localStorage.setItem('currentUser', JSON.stringify(user))
        const storedTransactions = JSON.parse(localStorage.getItem(`transactions_${user.email}`) || '[]')
        setTransactions(storedTransactions)
      } else {
        alert('Invalid credentials')
      }
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
    setTransactions([])
  }

  const addTransaction = (e) => {
    e.preventDefault()
    if (category && amount && date) {
      const newTransaction = {
        id: Date.now(),
        type,
        category,
        amount: parseFloat(amount),
        date,
        description,
      }
      const newTransactions = [...transactions, newTransaction]
      setTransactions(newTransactions)
      localStorage.setItem(`transactions_${user.email}`, JSON.stringify(newTransactions))
      setCategory('')
      setAmount('')
      setDate('')
      setDescription('')
    }
  }

  const deleteTransaction = (id) => {
    const newTransactions = transactions.filter(t => t.id !== id)
    setTransactions(newTransactions)
    localStorage.setItem(`transactions_${user.email}`, JSON.stringify(newTransactions))
  }

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'all') return true
    return t.type === filter
  })

  const sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' ? new Date(a.date).getTime() - new Date(b.date).getTime() : new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortBy === 'amount') {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount
    }
    return 0
  })

  const calculateChartData = () => {
    const monthlyData = Array(12).fill(0)
    const categories = {}

    transactions.forEach((t) => {
      const month = new Date(t.date).getMonth()
      monthlyData[month] += t.type === 'income' ? t.amount : -t.amount

      if (categories[t.category]) {
        categories[t.category] += t.amount
      } else {
        categories[t.category] = t.amount
      }
    })

    return {
      monthlyData,
      categoryData: Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 5),
    }
  }

  const { monthlyData, categoryData } = calculateChartData()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {isRegistering ? 'Register' : 'Login'}
          </h1>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              {isRegistering ? 'Register' : 'Login'}
            </button>
          </form>
          <p className="mt-4 text-center">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="ml-1 text-blue-500 hover:underline"
            >
              {isRegistering ? 'Login' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Finance Tracker</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Add Transaction</h2>
            <p className="text-gray-600 mb-4">Record your income or expenses</p>
            <form onSubmit={addTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    {(type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Transaction
              </button>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Financial Overview</h2>
            <p className="text-gray-600 mb-4">Your financial summary</p>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Monthly Cash Flow</h3>
                <Line
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                      {
                        label: 'Cash Flow',
                        data: monthlyData,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                  }}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Top Categories</h3>
                <Bar
                  data={{
                    labels: categoryData.map(([category]) => category),
                    datasets: [
                      {
                        label: 'Amount',
                        data: categoryData.map(([, amount]) => amount),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
          <p className="text-gray-600 mb-4">View and manage your transactions</p>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="filter" className="text-sm font-medium text-gray-700">Filter:</label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="sortBy" className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Category</th>
                  <th className="text-left py-2">Description</th>
                  <th className="text-right py-2">Amount</th>
                  <th className="text-right py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((t) => (
                  <tr key={t.id} className="border-b">
                    <td className="py-2">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="py-2">{t.category}</td>
                    <td className="py-2">{t.description}</td>
                    <td className={`py-2 text-right ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                    </td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="text-red-600 hover:text-red-800 focus:outline-none"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}