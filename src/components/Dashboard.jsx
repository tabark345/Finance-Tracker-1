import { Bar, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import PropTypes from 'prop-types';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

const Dashboard = ({ transactions }) => {
    const dailyData = calculateDailyData(transactions)
    const monthlyData = calculateMonthlyData(transactions)
    const annualData = calculateAnnualData(transactions)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Daily Transactions</h2>
                <Bar data={dailyData} />
            </div>
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Monthly Transactions</h2>
                <Line data={monthlyData} />
            </div>
            <div className="bg-white p-4 rounded shadow md:col-span-2">
                <h2 className="text-xl font-bold mb-4">Annual Transactions</h2>
                <Bar data={annualData} />
            </div>
        </div>
    )
}

Dashboard.propTypes = {
    transactions: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['income', 'expense']).isRequired,
        amount: PropTypes.number.isRequired,
    })).isRequired,
};

const calculateDailyData = (transactions) => {
    const dailyIncome = new Array(7).fill(0);
    const dailyExpenses = new Array(7).fill(0);

    transactions.forEach(transaction => {
        const day = new Date(transaction.date).getDay();
        if (transaction.type === 'income') {
        dailyIncome[day] += transaction.amount;
        } else {
        dailyExpenses[day] += transaction.amount;
        }
    });

    return {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
        {
            label: 'Income',
            data: dailyIncome,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
            label: 'Expenses',
            data: dailyExpenses,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
        ],
    };
}

const calculateMonthlyData = (transactions) => {
    const monthlyIncome = new Array(12).fill(0);
    const monthlyExpenses = new Array(12).fill(0);

    transactions.forEach(transaction => {
        const month = new Date(transaction.date).getMonth();
        if (transaction.type === 'income') {
        monthlyIncome[month] += transaction.amount;
        } else {
        monthlyExpenses[month] += transaction.amount;
        }
    });

    return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
        {
            label: 'Income',
            data: monthlyIncome,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
        },
        {
            label: 'Expenses',
            data: monthlyExpenses,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1,
        },
        ],
    };
};

const calculateAnnualData = (transactions) => {
    const annualData = transactions.reduce((acc, transaction) => {
        const year = new Date(transaction.date).getFullYear().toString();
        if (!acc[year]) acc[year] = { income: 0, expenses: 0 };
        transaction.type === 'income' 
        ? acc[year].income += transaction.amount 
        : acc[year].expenses += transaction.amount;
        return acc;
    }, {});

    const years = Object.keys(annualData).sort();
    return {
        labels: years,
        datasets: [
        {
            label: 'Income',
            data: years.map(year => annualData[year].income),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
            label: 'Expenses',
            data: years.map(year => annualData[year].expenses),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
        ],
    };
};

export default Dashboard