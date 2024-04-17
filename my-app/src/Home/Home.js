import React, { useState, useEffect } from 'react';
import Navbar from '../Forms/Navbar/Navbar';
import axios from 'axios';

const Home = ({ isLoggedIn, LoggedId, setProfileContact, setProfileEmail, setProfileName, setActivateProfile, setEnrolled, setProfileImg }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (category) {
          const categoryfield = { category };
          response = await axios.post('http://localhost:5000', categoryfield);
        } else {
          response = await axios.get('http://localhost:5000');
        }
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  const handleEnroll = async (course_id) => {
    try {
      const data = { course_id, LoggedId };
      console.log(data)
      if (LoggedId !== -1) {
        const response = await axios.post('http://localhost:5000/enroll', data);
        console.log(response.data);
      }
    } catch (error) {
      console.log("Error enrolling:", error);
    }
  };

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} LoggedId={LoggedId} setProfileContact={setProfileContact} 
      setProfileEmail={setProfileEmail} setProfileName={setProfileName} setCategory={setCategory}
      setActivateProfile={setActivateProfile} setEnrolled={setEnrolled} setProfileImg={setProfileImg}/>
      <div className="flex flex-wrap p-2 m-2">
        {loading && <p>Loading...</p>}
        {!loading && data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center min-w-80 p-2 py-4  shadow-lg ml-4 mr-4 gap-4 max-w-96">
            <img src={`http://localhost:5000/uploads/${item.thumbnail}`} alt={`Thumbnail ${index}`} />
            <h1 className="text-xl font-semibold">{item.course_name}</h1>
            <h3 className="text-md font-semibold">Category:- {item.category}</h3>
            <p className>{item.description}</p>
            <button onClick={() => handleEnroll(item.course_id)} className="border-solid border-blue-900 border-2 bg-blue-900 p-2 py-1 shadow-md text-white rounded-md">Enroll</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
