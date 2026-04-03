import { Link } from "react-router";
import "../auth.form.scss";
export default function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <main>
      <div className="form-container">
        <h1 className="">Login</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
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

          <button className="button primary-button">Login</button>
        </form>
        <p>
          Don't have an Account ? <Link to={"/register"}>Register Here</Link>
        </p>
      </div>
    </main>
  );
}
