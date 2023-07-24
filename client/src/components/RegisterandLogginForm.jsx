import { useState, useContext } from "react";
import axios from 'axios';
import { UserContext } from "../../UserContext";
import './Register.css';
import Alert from './Alert';

export default function RegisterandLogginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedInOrRegister, setIsLoggedInOrRegister] = useState('register');
    const { setLoggedInUsername, setid } = useContext(UserContext);
    const [showAlert, setShowAlert] = useState(false); // State to control the alert
    const [lshowAlert, setlShowAlert] = useState(false); // State to control the alert
    async function handleSubmit(e) {
        e.preventDefault();
        const url = isLoggedInOrRegister === 'register' ? '/register' : '/login';

        try {
            const { data } = await axios.post(url, { username, password });
            setLoggedInUsername(username);
            setid(data.id);
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false); // Automatically hide the alert after 5 seconds (adjust the time as needed)
                }, 10000);
            } else {
                console.error(error);
                setlShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false); // Automatically hide the alert after 5 seconds (adjust the time as needed)
                }, 10000);
            }
        }
    }


    return (
        <div className="bg-blue-50 h-screen flex items-center">
            {/* Display the Alert component above the form */}
            {showAlert && (
                <Alert
                    message="Username is already taken. Please choose a different username."
                    heading="Username already taken"
                    onClose={() => setShowAlert(false)} // Close the alert for registration
                />
            )}
            {lshowAlert && (
                <Alert
                    message="Username or password is wrong. Please check your username and password."
                    heading="Wrong username or password"
                    onClose={() => setlShowAlert(false)} // Close the alert for login
                />
            )}
            {/* Render the form only when showAlert is false */}
            {!showAlert && (
                <div className="w-64 mx-auto mb-12">
                    <form onSubmit={handleSubmit}>
                        <input value={username} onChange={e => setUsername(e.target.value)} type="text" className="block w-full rounded-sm p-2 mb-2 border" placeholder="username" />
                        <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="block w-full rounded-sm p-2 mb-2 border" placeholder="password" />
                        <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
                            {isLoggedInOrRegister === 'register' ? 'Register' : 'Login'}
                        </button>
                        <div className="text-center mt-2 text-gray-400">
                            {isLoggedInOrRegister === 'register' && (
                                <div>
                                    Already a member?
                                    <button onClick={() => setIsLoggedInOrRegister('login')} className="member">Login here</button>
                                </div>
                            )}
                            {isLoggedInOrRegister == 'login' && (
                                <div>
                                    Create account?
                                    <button onClick={() => setIsLoggedInOrRegister('register')} className="member">Register here</button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
