import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const BudgetTracker = ({ transactions }) => {
    const [budgets, setBudgets] = useState({})
    const [newBudget, setNewBudget] = useState({ category: '', amount: '' })

    useEffect(() => {
        const storedBudgets = JSON.parse(localStorage.getItem('budgets') || '{}')
        setBudgets(storedBudgets)
    }, [])

    const handleAddBudget = (e) => {
        e.preventDefault()
        if (newBudget.category && newBudget.amount) {
        const updatedBudgets = { ...budgets, [newBudget.category]: parseFloat(newBudget.amount) }
        setBudgets(updatedBudgets)
        localStorage.setItem('budgets', JSON.stringify(updatedBudgets))
        setNewBudget({ category: '', amount: '' })
        }
    }

    const calculateSpending = (category) => {
        return transactions
        .filter((t) => t.type === 'expense' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0)
    }

    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Budget Tracker</h2>
        <form onSubmit={handleAddBudget} className="mb-4">
            <div className="flex items-center">
            <input
                type="text"
                value={newBudget.category}
                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                placeholder="Category"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            />
            <input
                type="number"
                value={newBudget.amount}
                onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                placeholder="Budget Amount"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            />
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Add Budget
            </button>
            </div>
        </form>
        <ul className="divide-y divide-gray-200">
            {Object.entries(budgets).map(([category, budget]) => {
            const spending = calculateSpending(category)
            const percentage = (spending / budget) * 100
            return (
                <li key={category} className="py-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{category}</span>
                    <span>
                    ${spending.toFixed(2)} / ${budget.toFixed(2)}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                    className={`h-2.5 rounded-full ${
                        percentage > 100 ? 'bg-red-600' : percentage > 75 ? 'bg-yellow-400' : 'bg-green-600'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                </div>
                </li>
            )
            })}
        </ul>
        </div>
    )
}

BudgetTracker.propTypes = {
    transactions: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string.isRequired,
            category: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
        })
    ).isRequired,
}

export default BudgetTracker