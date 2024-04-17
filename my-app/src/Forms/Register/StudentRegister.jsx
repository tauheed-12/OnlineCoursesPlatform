import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const StudentRegister = () => {
  const [info, setInfo] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    profile: null 
  });
  const navigate = useNavigate();
  async function handleform(event) {
    event.preventDefault();
    console.log(info);
    
    try {
      const formData = new FormData();
      formData.append('name', info.name);
      formData.append('email', info.email);
      formData.append('contact', info.contact);
      formData.append('profile', info.profile); 
      formData.append('password', info.password);
      const response = await axios.post('http://localhost:5000/student/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data); 
      navigate('/login/student',)
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function handleChange(event) {
    const { name, value, type } = event.target;
    const newValue = type === 'file' ? event.target.files[0] : value;
    setInfo(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  }

  return (
    <div>
      <form onSubmit={handleform}>
        <label htmlFor='name'>Full Name</label>
        <input type='text' id='name' name='name' onChange={handleChange} value={info.name} required></input>
        <label htmlFor='email'>Email</label>
        <input type='email' id='email' name='email' onChange={handleChange} value={info.email} required></input>
        <label htmlFor='contact'>Contact Number</label>
        <input type='number' id='contact' name='contact' onChange={handleChange} value={info.contact} required></input>
        <label>Password</label>
        <input type='password' id='password' name='password' onChange={handleChange} value={info.password} required></input>
        <label htmlFor='profile'>Upload a Profile Pic</label>
        <input type='file' id='profile' name='profile' onChange={handleChange} required></input>
        <button type='submit'>Register</button>
      </form>
    </div>
  );
}

export default StudentRegister;
