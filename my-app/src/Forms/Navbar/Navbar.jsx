import React from 'react'
import {Link, useSearchParams} from 'react-router-dom'
import { useState } from 'react'
import './Navbar.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Navbar = ({isLoggedIn, LoggedId, setProfileContact, setProfileEmail ,setProfileName,setActivateProfile, setEnrolled, setProfileImg, setCategory}) => {
  const navigate = useNavigate();
  const handProfile = async()=>{
      try{
        const token = localStorage.getItem('token');
        const requestData = { loggedId: LoggedId };
        const response = await axios.post('http://localhost:5000/student/profile',requestData,{
         headers: {
          'Authorization': `Bearer ${token}`
      }})
        console.log(response.data.course[0]);
        setEnrolled(response.data.course)
        setProfileContact(response.data.data[0].contact);
        setProfileEmail(response.data.data[0].email);
        setProfileName(response.data.data[0].name);
        setProfileImg(response.data.data[0].imgname);
        setActivateProfile(true)
        navigate(`/student/${LoggedId}`)
      }catch(error){
        console.log("Error:",error);
      }
  }
  return (
    <div className='Navbar'>
      <h1>CourseWorld</h1>
      <span>Filter</span>
      <select onChange={(event)=>setCategory(event.target.value)}>
            <option>Technology</option>
            <option>Personal Development</option>
            <option>Finance</option>
            <option>Humanities</option>
            <option>Medical</option>
      </select>
      <div className='Navbar_Profile'>
      </div>
      {!isLoggedIn?<Link to='/login/student'><button>Sign In</button></Link>:<button onClick={handProfile}>Profile</button>}
      {!isLoggedIn?<Link to='/login/admin'><button>Teach on CourseWorld</button></Link>:<Link to='/student/logout'><button>Logout</button></Link>}
      
      {!isLoggedIn?<Link to='/register/student'><button>Sign Up</button></Link>:''}
    </div>
  )
}

export default Navbar
