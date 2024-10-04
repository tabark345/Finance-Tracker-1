import  { useState } from 'react'
import PropTypes from 'prop-types'

const Auth = ({ setUser }) => {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (isLogin) {
        // Login
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const user = users.find((u) => u.email === email && u.password === password)
        if (user) {
            setUser(user)
        } else {
            setError('Invalid email or password')
        }
        } else {
        // Register
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        if (users.some((u) => u.email === email)) {
            setError('Email already exists')
        } else {
            const newUser = { email, password }
            localStorage.setItem('users', JSON.stringify([...users, newUser]))
            setUser(newUser)
        }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-96">
            <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
                </label>
                <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
                </label>
                <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex items-center justify-between">
                <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                {isLogin ? 'Login' : 'Register'}
                </button>
                <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                >
                {isLogin ? 'Need an account?' : 'Already have an account?'}
                </button>
            </div>
            </form>
        </div>
        </div>
    )
}

Auth.propTypes = {
    setUser: PropTypes.func.isRequired,
}

export default Auth