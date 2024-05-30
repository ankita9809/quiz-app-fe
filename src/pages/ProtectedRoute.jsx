import { Navigate, Outlet } from 'react-router-dom'
const PrivateRoutes = () => {
    let auth = { 'token': window.localStorage.getItem("jwt") }
    return (
        auth.token ? <Outlet /> : <Navigate to='/login' />
    )
}

export default PrivateRoutes