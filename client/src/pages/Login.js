import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async function (e) {
    e.preventDefault();
    try {
      const isSuccess = await login(email, password);
      if (isSuccess) {
        toast.success("Login successful!");
        navigate(-1, { replace: true });
      }
    } catch (e) {
      console.error(e);
      toast.error(e.message);
    }
  };

  return (
    <div className=" mt-md-4 mt-lg-5 ">
      <div className="container" style={{ maxWidth: "29.75rem" }}>
        <h1 className="h1 m-4 text-center">Login</h1>
        <form className="login" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email or Username</label>
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            {error && <div className="text-danger mb-3">{error}</div>}
          </div>
          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-dark w-100"
              disabled={isLoading}
            >
              Login
            </button>
          </div>
          <div className="mb-3">
            <button
              type="submit"
              onClick={() => {
                setEmail("test1@user.com");
                setPassword("ABCabc123!");
              }}
              className="btn btn-outline-dark w-100"
              disabled={isLoading}
            >
              Login as a Test User
            </button>
          </div>
        </form>
        <hr className="my-4" />
        <div className="mb-3 text-center">
          <p className=" text-secondary ">
            Don't have an account?
            <span
              className=" link-success"
              role="button"
              onClick={() => navigate("/signup", { replace: true })}
            >
              {` Join now`}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
