import react, {useState} from "react";
import {useNavigate, link} from "react-router-dom"
import {useAuth} from "../context/AuthContext"

function LoginPage() {
    const [formData, setFormData] = useState({"email": "", "password": ""});
    const [showPassword, setShowPassword] = useState(false)
    

    const {login} = useAuth();
    const navigate = useNavigate()

    function handleChange(e) {
        setFormData({...formData, [e.target.name]: e.target.value})

    }
    async function handleSubmit(e){
        e.preventDefault()
        setError("")
        try{
            await login(formData);
            navigate("/dashboard")

        }
        catch (error){
            return "IUnvalid email or password"
        }

    }
    function toggleShowPassword() {
        setShowPassword(true)
    }
    return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">+</span>
          <h2>NeighborQuest</h2>
        </div>

        <h3 className="auth-title">Welcome Back</h3>
        <p className="auth-subtitle">We are happy to see you again</p>

        <div className="auth-toggle">
          <Link to="/login" className="active">Sign In</Link>
          <Link to="/register">Sign Up</Link>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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

          <button type="submit" className="auth-submit-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
