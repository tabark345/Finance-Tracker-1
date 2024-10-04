import  { useState } from 'react'
import PropTypes from 'prop-types'

const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other Income']
const expenseCategories = ['Housing', 'Transportation', 'Food', 'Utilities', 'Insurance', 'Healthcare', 'Debt', 'Personal', 'Entertainment', 'Other Expenses']

const FinanceForm = ({ addTransaction }) => {
    const [type, setType] = useState('income')
    const [category, setCategory] = useState('')
    const [amount, setAmount] = useState('')
    const [date, setDate] = useState('')
    const [description, setDescription] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (category && amount && date) {
        addTransaction({
            id: Date.now(),
            type,
            category,
            amount: parseFloat(amount),
            date: new Date(date),
            description,
        })
        setCategory('')
        setAmount('')
        setDate('')
        setDescription('')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
            Type
            </label>
            <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            </select>
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
            Category
            </label>
            <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
            <option value="">Select a category</option>
            {type === 'income'
                ? incomeCategories.map((cat) => (
                    <option key={cat} value={cat}>
                    {cat}
                    </option>
                ))
                : expenseCategories.map((cat) => (
                    <option key={cat} value={cat}>
                    {cat}
                    </option>
                ))}
            </select>
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
            Amount
            </label>
            <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="0.00"
            />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
            Date
            </label>
            <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
            </label>
            <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Optional description"
            />
        </div>
        <div className="flex items-center justify-between">
            <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
            Add Transaction
            </button>
        </div>
        </form>
    )
}

FinanceForm.propTypes = {
    addTransaction: PropTypes.func.isRequired,
}

export default FinanceForm