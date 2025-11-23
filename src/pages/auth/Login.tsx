import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("thanhbinhnkd@gmail.com");
  const [password, setPassword] = useState("password123");

  // Fix: Dùng useEffect thay vì gọi trực tiếp trong render
  useEffect(() => {
    if (localStorage.getItem("access-token")) {
      navigate("/dashboard");
    }
  }, []);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      console.log(email, password);
      const res = await apiClient.post("/auth/login", {
        email,
        password,
      });
      toast.success("Login successful");
      localStorage.setItem("access-token", res.data.accessToken);
      navigate("/dashboard");
    } catch {
      toast.error("Login failed");
    }
  }

  function handleGoToOauth2() {
    window.location.href = "http://localhost:8000/api/v1/auth/google";
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-50">
      <div className="w-full max-w-md px-6">
        <h1 className="text-3xl font-bold text-center mb-8">Task Management</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-5 bg-white border border-gray-200 p-8 rounded-lg shadow-sm"
        >
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              type="email"
              id="email"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              type="password"
              id="password"
              className="h-11"
            />
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white h-11 mt-2"
            type="submit"
          >
            Log in
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>
          <Button
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 h-11"
            onClick={handleGoToOauth2}
            type="button"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
          <div className="flex justify-center items-center gap-1 mt-4 text-sm">
            <p className="text-gray-600">Don't have an account?</p>
            <p className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
              <Link to={"/register"}>Sign up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
