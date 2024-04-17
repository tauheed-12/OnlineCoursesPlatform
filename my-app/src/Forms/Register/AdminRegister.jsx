import React, { useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const AdminRegister = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    name: "",
    email: "",
    contact: "",
    password: ""
  });
  function handleChange(event){
    const { name, value } = event.target;
    setInfo(prevState => ({
      ...prevState,
      [name]: value 
    }));
  };
  async function handleForm(event) {
    event.preventDefault();
    console.log(info);

    try {
      const response = await axios.post('http://localhost:5000/admin/register', info);
      console.log(response.data); 
      navigate('/add_courses')
    } catch (error) {
      console.error('Error registering admin:', error);
    }
  }

  return (
    <div>
      <div>
        <form onSubmit={handleForm}>
          <label htmlFor='name'>Full Name</label>
          <input type='text' id='name' name='name' onChange={handleChange} value={info.name} required />
          <label htmlFor='email'>Email</label>
          <input type='email' id='email' name='email' onChange={handleChange} value={info.email} required />
          <label htmlFor='contact'>Contact Number</label>
          <input type='tel' id='contact' name='contact' onChange={handleChange} value={info.contact} required />
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' name='password' onChange={handleChange} required />
          <button type='submit'>Register</button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
