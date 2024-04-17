import React from 'react';
import {Link} from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'
import axios from 'axios';
const Student_Login = (props) => {
  const navigate = useNavigate();
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const handleForm = async (event)=>{
    try{
    event.preventDefault();
    const response = await axios.post('http://localhost:5000/student/login',{email,password})
    console.log(response.data.data[0].student_id);
    props.setLoggedId(response.data.data[0].student_id)
    const token = response.data.token;
    localStorage.setItem('token', token);
    if(token){
        props.setLoggedIn(true)
        navigate('/');
    }
    }catch(error){
      console.log(error)
    }
  }
  return (
    <div className='Student_Login' onSubmit={handleForm}>
      <form>
       <label htmlFor='email'>Email</label>
       <input type='email' name='email' id='email' onChange={(event)=>setEmail(event.target.value)} required></input>
       <label htmlFor='password'>Password</label>
       <input type='password' name='password' id='password' onChange={(event)=>setPassword(event.target.value)} required></input>
       <button type='submit'>Login</button>
       <Link to='/forgetPassword'>Forget Password?</Link>
       <Link to='/register/student'>New User?</Link>
      </form>
  </div>
  )
}

export default Student_Login
