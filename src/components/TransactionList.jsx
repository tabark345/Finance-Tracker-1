import  { useState } from 'react'
import PropTypes from 'prop-types'

const TransactionList = ({ transactions, deleteTransaction }) => {
    const [filter, setFilter] = useState('all')
    const [sortBy, setSortBy] = useState('date')
    const [sortOrder, setSortOrder] = useState('desc')

    const filteredTransactions = transactions.filter((t) => {
        if (filter === 'all') return true
        return t.type === filter
    })

    const sortedTransactions = filteredTransactions.sort((a, b) => {
        if (sortBy === 'date') {
        return sortOrder === 'asc' ? a.date - b.date : b.date - a.date
        } else if (sortBy === 'amount') {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount
        }
        return 0
    })

    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Transactions</h2>
        <div className="flex justify-between mb-4">
            <div>
            <label htmlFor="filter" className="mr-2">
                Filter:
            </label>
            <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded py-1 px-2"
            >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
            </select>
            </div>
            <div>
            <label htmlFor="sortBy" className="mr-2">
                Sort by:
            </label>
            <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded py-1 px-2 mr-2"
            >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
            </select>
            <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="bg-gray-200 hover:bg-gray-300 rounded px-2 py-1"
            >
                {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
            </div>
        </div>
        <ul className="divide-y divide-gray-200">
            {sortedTransactions.map((t) => (
            <li key={t.id} className="py-4 flex justify-between items-center">
                <div>
                <p className="font-semibold">{t.category}</p>
                <p className="text-sm text-gray-500">{new Date(t.date).toLocaleDateString()}</p>
                <p className="text-sm">{t.description}</p>
                </div>
                <div className="flex items-center">
                <span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                </span>
                <button
                    onClick={() => deleteTransaction(t.id)}
                    className="ml-4 text-red-600 hover:text-red-800"
                >
                    Delete
                </button>
                </div>
            </li>
            ))}
        </ul>
        </div>
    )
}

TransactionList.propTypes = {
    transactions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['income', 'expense']).isRequired,
        amount: PropTypes.number.isRequired,
        date: PropTypes.number.isRequired,
        category: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    })).isRequired,
    deleteTransaction: PropTypes.func.isRequired,
}

export default TransactionList