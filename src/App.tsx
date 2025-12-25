import { Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/Login';
import Journal from './pages/Journal';
import './App.css'

function ProtectedRoute({children}: { children: JSX.Element }){
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App(){
  return(
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/' element={<ProtectedRoute><Journal /></ProtectedRoute>} />
    </Routes>
  );
}


