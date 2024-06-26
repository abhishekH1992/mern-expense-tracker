import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import TransactionPage from './pages/TransactionPage'
import NotFound from './pages/NotFound'
import Header from './components/ui/Header'
import { GET_AUTHENTICATED_USER } from './graphql/queries/user.query'
import { useQuery } from '@apollo/client'
import { Toaster } from "react-hot-toast"

function App() {
    const authUser = false;
    const { loading, data, err } = useQuery(GET_AUTHENTICATED_USER);
    console.log("Authenticated User:", data);
    if(loading) return null;
    return (
        <div>
            {data?.authUser && <Header/>}
            <Routes>
                <Route path='/' element={data.authUser ? <HomePage /> : <Navigate to="/login"/>} />
                <Route path='/login' element={!data.authUser ? <LoginPage /> : <Navigate to="/"/>} />
                <Route path='/signup' element={!data.authUser ? <SignUpPage /> : <Navigate to="/"/>} />
                <Route path='/transaction/:id' element={data.authUser ? <TransactionPage /> : <Navigate to="/login"/>} />
                <Route path='*' element={data.authUser ? <NotFound /> : <Navigate to="/login"/>} />
            </Routes>
            <Toaster />
        </div>
    )
}

export default App;
