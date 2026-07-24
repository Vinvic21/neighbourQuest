import react, {createContext, useContext, useState, useEffect} from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null)

    useEffect (() => {
        const storedtoken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")
        if (storedtoken && storedUser) {
            setToken(storedtoken)
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, []);
    async function login(credentials){
        const response = await api.post("/auth/login", credentials)
        const {token: newToken, user:newUser} = response.data 

        setToken(newToken);
        setUser(newUser)

        localStorage.setItem("token", newToken)
        localStorage.setItem("user", JSON.stringify(newUser))

        return newUser
    };
    async function register(data){
        const response = await api.post("/auth/register", data);
        return response.data;

    }
    function logout(){
        setUser(null);
        setToken(null);
        localStorage.removeItem("token")
        localStorage.removeItem("user")

    };
    const value = {
        user,
        token,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    }

export function useAuth() {
  return useContext(AuthContext);

}