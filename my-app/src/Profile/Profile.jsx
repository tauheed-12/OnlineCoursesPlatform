import React, { useState } from 'react';
import Navbar from '../Forms/Navbar/Navbar';
import axios from 'axios';

const Profile = ({ name, email, contact, Enrolled, img, studentId }) => {
  const [info, setInfo] = useState({
    studentId:studentId,
    name: "",
    email: "",
    contact: "",
  });
  const [isEdited, setIsEdited] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo(prevInfo => ({
      ...prevInfo,
      [name]: value
    }));
  };

  const handleFormSubmit = async(e) => {
    e.preventDefault();
    console.log("Form submitted with data:", info);
    const response = await axios.post('http://localhost:5000/edit/student_profile', info)
    console.log(response.data)
    setIsEdited(false); 
  };

  return (
    <>
      <div className="bg-blue-800 py-4 flex justify-center self-center">
        <span className="self-center text-white text-xl">CourseWorld</span>
      </div>
      {isEdited ?
        <form onSubmit={handleFormSubmit}>
          <label htmlFor='name'>New Full Name</label>
          <input type='text' id='name' name='name' onChange={handleChange} value={info.name} required></input>
          <label htmlFor='email'>New Email</label>
          <input type='email' id='email' name='email' onChange={handleChange} value={info.email} required></input>
          <label htmlFor='contact'>New Contact Number</label>
          <input type='number' id='contact' name='contact' onChange={handleChange} value={info.contact} required></input>
          <button type='submit'>Update</button>
        </form>
        :
        <div className="p-4 flex flex-col self-center justify-center my-8">
          <div className="flex gap-8 shadow-lg rounded-md w-2/5 self-center py-8 px-4">
            <img src={`http://localhost:5000/uploads/${img}`} className="h-28 w-28 rounded-full" alt="Profile"></img>
            <div className="flex flex-col justify-start self-start gap-2">
              <h1 className="text-lg font-semibold">{name}</h1>
              <span className='text-md'>{email}</span>
              <span className='text-md'>{contact}</span>
              <button className="border-solid border-blue-900 border-2 bg-blue-900 p-2 py-1 shadow-md text-white rounded-md" onClick={() => setIsEdited(true)}>Edit</button>
            </div>
          </div>
        </div>
      }

      <div className="px-8 flex flex-col">
        <h1 className="text-2xl font-semibold text-blue-800">Your Learning</h1>
        <div className="w-20 h-2 bg-blue-900"></div>
        <div className="flex">
          {Enrolled.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center min-w-80 p-2 py-4 shadow-lg ml-4 mr-4 gap-4">
              <img src={`http://localhost:5000/uploads/${item.thumbnail}`} alt={`Thumbnail ${index}`} />
              <h1>{item.course_name}</h1>
              <h3>{item.category}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Profile;
