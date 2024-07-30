import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store'
import { useEffect, useState } from 'react'
import { apiClient } from './lib/api-client'
import { GET_USERINFO_ROUTE } from './utils/constants'


const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};
function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USERINFO_ROUTE, {withCredentials: true,});
        if (response.status === 200 && response.data.id) { setUserInfo(response.data)}
        else {setUserInfo(undefined) }
      } catch (error) {
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {getUserData()} 
    else {setLoading(false)}

  }, [userInfo, setUserInfo]);

  if (loading) { return <div>Loading...</div> }

  return (
   <BrowserRouter>

    <Routes>
     <Route path="/auth" element={ <AuthRoute><Auth /></AuthRoute> }/>
     <Route path="/chat" element={<PrivateRoute><Chat /> </PrivateRoute>}/>
     <Route path="/profile" element={ <PrivateRoute> <Profile /> </PrivateRoute>}/>

     <Route path="*" element={<Navigate to={"/auth"} />} />
    </Routes>
   
   </BrowserRouter>
  )
}

export default App
