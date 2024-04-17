import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home/Home'
import Student_Login from './Forms/Login/Student_Login'
import AdminRegister from './Forms/Register/AdminRegister'
import StudentRegister from './Forms/Register/StudentRegister'
import SuperAdmin_login from './Forms/Login/SuperAdmin_Login'
import AddCourses from './Forms/Courses/AddCourses'
import Profile from './Profile/Profile'
const App = () => {
  const[detail, SetDetail] = useState("");
  const[isLoggedIn, setLoggedIn] = useState(false);
  const[LoggedId, setLoggedId] = useState(-1);
  const[ProfileName, setProfileName] = useState("")
  const[ProfileEmail, setProfileEmail] = useState("")
  const[ProfileContact, setProfileContact] = useState("")
  const[ActivateProfile,setActivateProfile] = useState(false)
  const[Enrolled, setEnrolled] = useState([])
  const[ProfileImg, setProfileImg] = useState("")
  async function handleRequest(){
    try{
       const result = await axios.get('http://localhost:5000/api/courses')
       console.log(result.data[0].name)
       SetDetail(result.data[0].name);
    }catch(error){
      console.log(error);
    }
  }
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home isLoggedIn={isLoggedIn} LoggedId={LoggedId} setProfileContact={setProfileContact} setProfileEmail={setProfileEmail} setProfileName={setProfileName} setActivateProfile={setActivateProfile} setEnrolled={setEnrolled} setProfileImg={setProfileImg}/> }></Route>
        <Route path='/register/admin' element={<AdminRegister/>}></Route>
        <Route path='/register/student' element={<StudentRegister/>}></Route>
        <Route path='/login/admin' element={<SuperAdmin_login/>}></Route>
        <Route path='/login/student' element={<Student_Login setLoggedIn={setLoggedIn} setLoggedId={setLoggedId} isLoggedIn={isLoggedIn}/> }></Route>
        <Route path='/add_courses' element={<AddCourses/>}></Route>
        {ActivateProfile?<Route path={`/student/${LoggedId}`} element={<Profile contact={ProfileContact} email={ProfileEmail} name={ProfileName} Enrolled={Enrolled} img={ProfileImg} studentId={LoggedId}/>}></Route>:''}
      </Routes>
    </div>
  )
}

export default App
