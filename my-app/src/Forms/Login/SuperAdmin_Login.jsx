import React from 'react';
import {Link} from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Login.css"
const SuperAdmin_login = () => {
  const navigate = useNavigate();
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const handleform = async (event)=>{
    event.preventDefault();
    try{
       const response = await axios.post('http://localhost:5000/admin/login',{email,password});
       console.log(response.data);
       const token = response.data.token;
       localStorage.setItem('token', token);
       navigate('/add_courses', { state: { token: token } });
    }catch(error){
      console.log(error);
    }
  }
  return (
    <div>
      <form className='SuperAdmin_login' onSubmit={handleform}>
       <label htmlFor='email'>Email</label>
       <input type='email' name='email' id='email' onChange={(event)=>setEmail(event.target.value)} required></input>
       <label htmlFor='password'>Password</label>
       <input type='password' name='password' id='password' onChange={(event)=>setPassword(event.target.value)} required></input>
       <button type='submit'>Login</button>
       <Link to='/forgetPassword'>Forget Password?</Link>
       <Link to='/register/admin'>New User?</Link>
      </form>
  </div>
  )
}

export default SuperAdmin_login
