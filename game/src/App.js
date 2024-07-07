import './App.css';
import {Routes, Route, Link} from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Search from './components/Search';
import Sidebar from './components/Sidebar';
import Settings from './components/Settings';
import Collection from './components/Collection';
import Statistics from './components/Statistics';

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
      <Route path='/collection' element={<Collection/>}> </Route> 
      <Route path='/statistics' element={<Statistics/>}> </Route> 

    </Routes> 
    </div>
    </div>
  );
}

export default App;
