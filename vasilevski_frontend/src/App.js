import React, {useEffect} from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import Login from './components/Login'
import Home from './container/Home'
import { fetchUser } from './utils/fetchUser'


const App = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const user = fetchUser()
    
        if(!user) navigate ('/login')
    }, [])
    //This is to make sure, that in the beggining if there is no user, we navigate to login

    return (
        <Routes>
            <Route path="login" element={<Login />}/>
            <Route path="/*" element={<Home />}/>
        </Routes>
    )
}

export default App