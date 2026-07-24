import React, {useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext"

function RegisterPage(){
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "worker",
    })
    const [showPassword, setShowPssword] = useState(false)
     const {register} = useAuth()
     const navigate = useNavigate()

     function handleChange (e) {
        setFormData ({...formData, [e.target.name]: e.target.value})
    
     }
     async function handleSubmit (e) {
        e.preventDefault()
        try{
            await register(formData)
            navigate("/login")
        }
        catch (error){
            return "Unable to register user"

        }

     }
     function togglePassword (){
        setShowPssword(!showPassword)
     }
     return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">+</span>
          <h2>NeighborQuest</h2>
        </div>

        <h3 className="auth-title">Create Your Account</h3>
        <p className="auth-subtitle">Join as a worker or employer</p>

        <div className="auth-toggle">
          <Link to="/login">Sign In</Link>
          <Link to="/register" className="active">Sign Up</Link>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="auth-password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span onClick={togglePassword}>
              {showPassword ? "hide" : "show"}
            </span>
          </div>

          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="worker"> Worker</option>
            <option value="employer">Employer</option>
            <option value="both">Both</option>
          </select>

          <button type="submit" className="auth-submit-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;


