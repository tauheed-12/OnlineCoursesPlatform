import React from 'react'
import './AddCourses.css'
import { useState } from 'react'
import axios from 'axios'
const AddCourses = () => {
  const[info, setInfo] = useState({
    course_name:"",
    category:"Technology",
    thumbnail:null,
    description:""
  });

async function handleForm(event){
    event.preventDefault();
    console.log(info);
    try{
        const formData = new FormData();
        formData.append('course_name',info.course_name);
        formData.append('category', info.category);
        formData.append('thumbnail', info.thumbnail);
        formData.append('description', info.description);
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5000/addCourses', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
              }
        });
        console.log(response.data);
    }catch(error){
        console.log('Error:',error);
    }
}
  
function handleChange(event){
    const {name, value, type} = event.target;
    const newValue = type === 'file' ? event.target.files[0] : value;
    setInfo(prevState => ({
        ...prevState,
        [name]: newValue
      }));
}
  return (
    <div className='AddCourses'>
      <form onSubmit={handleForm}>
        <label htmlFor='course_name'>Course Name</label>
        <input type='text' name='course_name' id='course_name' onChange={handleChange} required></input>
        <label>Category</label>
        <select onChange={handleChange} id='category' name='category' required>
            <option>Technology</option>
            <option>Personal Development</option>
            <option>Finance</option>
            <option>Humanities</option>
            <option>Medical</option>
        </select>
        <label htmlFor='thumbnail'>Thumbnail</label>
        <input type='file' id='thumbnail' name='thumbnail' onChange={handleChange} required></input>
        <label htmlFor='description'>Description</label>
        <textarea type='text' id='description' name='description' onChange={handleChange} required></textarea>
        <button type='submit'>Add</button>
      </form>
    </div>
  )
}

export default AddCourses
