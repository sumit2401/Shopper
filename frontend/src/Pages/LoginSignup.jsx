import React, { useState } from 'react'
import './CSS/loginsignup.css'

const LoginSignup = () => {

  const [state, setState] = useState("Login")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  })

  //update the input feild by using this onChange handler
  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const login = async () => {
    console.log("Login Function Executed", formData);
    let responseData;
    await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    }).then((response) => response.json()).then((data) => responseData = data)
    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    }
    else {
      alert(responseData.errors)
    }
  }

  const signUp = async () => {
    console.log("Signup Function executed", formData);
    let responseData;
    await fetch('http://localhost:4000/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    }).then((response) => response.json()).then((data) => responseData = data)
    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    }
    else {
      alert(responseData.errors)
    }
  }
  return (
    <div className='loginsignup'>
      <div className="loginsignupcontainer">
        <h1>{state}</h1>
        <div className="loginsignup-field">
          {state === "Sign Up" ? <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' /> : <></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
        </div>

        {state === "Sign Up" ? <button onClick={() => { state === "Login" ? login() : signUp() }}>Continue</button> : <button onClick={() => { state === "Login" ? login() : signUp() }}>Login</button>}

        {state === "Sign Up" ? <p className="loginsignup-login">Already have a account <span onClick={() => { setState("Login") }}>Login</span> here </p> : <p className="loginsignup-login">Don't have account <span onClick={() => { setState("Sign Up") }}>Sign Up</span> here </p>}
        {state === "Sign Up" ? <div className="loginsignup-agree">
          <input type="checkbox" name='' id='' />
          <p>By continuing, I agree to the terms of use & privacy policy. </p>
        </div> : <></>}

      </div>
    </div>
  )
}

export default LoginSignup
