import './App.css';
import { Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Search from './components/Search';
import Sidebar from './components/Sidebar';
import Settings from './components/Settings';
import Collection from './components/Collection';
import Statistics from './components/Statistics';
import { AuthProvider } from './contexts/AuthContext'; 

function App() {
  return (
    <AuthProvider>
      <div className='App'>
        <Sidebar />

        <div className='MainContent'>

          <Routes className='routes'>
            <Route path='/settings' element={<Settings />}> </Route>
            <Route path='/login' element={<Login />}> </Route>
            <Route path='/register' element={<SignUp />}> </Route>
            <Route path='/search' element={<Search />}> </Route>
            <Route path='/collection' element={<Collection />}> </Route>
            <Route path='/statistics' element={<Statistics />}> </Route>
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
