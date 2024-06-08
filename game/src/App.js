import './App.css';
import {Routes, Route, Link} from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Search from './components/Search';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Settings from './components/Settings';

function App() {
  return (
    <div className = 'App'>
        {/* <Header/>  */}
            <Sidebar/> 

        <div className='MainContent'>

    <Routes className = 'routes'> 
      <Route path='/settings' element={<Settings/>}> </Route> 
      <Route path='/login' element={<Login/>}> </Route> 
      <Route path='/register' element={<SignUp/>}> </Route> 
      <Route path='/search' element={<Search/>}> </Route> 

    </Routes> 
    </div>
    <Footer/>
    </div>
  );
}

export default App;
