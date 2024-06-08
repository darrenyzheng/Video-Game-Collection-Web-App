import { useState } from 'react';
import { IoPerson, IoLockClosed } from "react-icons/io5";

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className='card'>
            <form>
                <h1> Login </h1> 
                <div className='inputs'>
                    <div className='input'>
                        <IoPerson className='img' />
                        <input
                            id='username'
                            type='text'
                            placeholder='Username'
                            value={username}
                            pattern='^[a-zA-Z0-9]{5,16}$'
                            onChange={(e) => { setUsername(e.target.value) }}
                            required>
                        </input>
                    </div>

                    <div className='input'>
                        <IoLockClosed className='img' />
                        <input
                            id='password'
                            type='password'
                            placeholder='Password'
                            value={password}
                            pattern='^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$'
                            onChange={(e) => { setPassword(e.target.value) }}
                            required>
                        </input>
                    </div>

                        <input 
                            id = 'register'
                            type = 'submit'></input>
                </div>
            </form>
        </div>
    );
}

export default Login;