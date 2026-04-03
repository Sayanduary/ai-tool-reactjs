import { Link } from "react-router";
import "../auth.form.scss";
export default function Register() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <main>
      <div className="form-container">
        <h1 className="">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" placeholder="Enter Your Username" />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Enter Email Address" />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter Your Password"
            />
          </div>

          <button className="button primary-button">Register</button>
        </form>
        <p>
          Already have an Account? <Link to={"/login"}>Login</Link>
        </p>
      </div>
    </main>
  );
}
