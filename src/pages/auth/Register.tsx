import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import axios from "axios";
import { toast } from "sonner";


function Register(props) {
  const [name, setName] = useState("Thanh Bình");
  const [email, setEmail] = useState("thanhbinhnkd@gmail.com");
  const [password, setPassword] = useState("password123");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      console.log(email, password, name);
      const res = await axios.post("http://localhost:8000/api/v1/auth/register", {
        email,
        password,
        name
      });
      console.log("response register ", res);
      toast.success("Register successful");
    }
    catch {
      toast.error("Register failed");
    }
  }

  function handleGoToLogin(){
    props.goLogin();
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-50">
      <div className="w-full max-w-md px-6">
        <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5 bg-white border border-gray-200 p-8 rounded-lg shadow-sm">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter your name" 
              type="text" 
              id="name"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
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
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <Input 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password" 
              type="password" 
              id="password"
              className="h-11"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white h-11 mt-2" type="submit">
            Sign up
          </Button>
          <div className="flex justify-center items-center gap-1 mt-4 text-sm">
            <p className="text-gray-600">Already have an account?</p>
            <p className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium" onClick={handleGoToLogin}>
              Sign in
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register;