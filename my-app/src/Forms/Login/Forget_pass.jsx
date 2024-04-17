import axios from 'axios'
import React from 'react'
import { useState } from 'react'
const Forget_pass = () => {
  const[Otpsent, setOtpsent] = useState(false)
  const[Email, setEmail] = useState("")
  const[Otp, setOtp] = useState("")
  const[userOtp, setUserOtp] = useState("")
  const handleSubmit = async ()=>{
    try {
      const data = {Email:Email,type:"student"}
      const response = await axios.post('http://localhost:5000/sendotp',data)
      console.log(response.data);
      if(response.status===200){
        setOtpsent(true);
        setOtp(response.data.data[0].otp)
      }
    } catch (error) {
        console.log("Error:", error)
    }
  }
  const verifyOtp = ()=>{
    if(userOtp===Otp){
      console.log("verified")
    }else{
      console.log("invalid otp")
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input id='user' name='user' value={user} onChange={(event)=>setEmail(event.target.value)} placeholder='Email Id'></input>
        {Otpsent?<input id='otp' name='otp' placeholder='OTP'></input>:''}
        {Otpsent?<button onClick={verifyOtp} onChange={(event)=>setUserOtp(event.target.value)}>Verify</button>:<button type='submit' onChange={handleChange}>Send OTP</button>}
        <button type='submit' onChange={handleChange}>Send OTP</button>
      </form>
    </div>
  )
}

export default Forget_pass
