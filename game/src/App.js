import './App.css';
import { Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp.jsx';
import Login from './components/Login.jsx';
import Search from './components/Search.jsx';
import Sidebar from './components/Sidebar.jsx';
import Settings from './components/Settings.jsx';
import Collection from './components/Collection.jsx';
import Statistics from './components/Statistics.jsx';
import { AuthProvider } from './contexts/AuthContext.js'; 

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
