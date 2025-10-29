import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import axios from "axios";
import { toast } from "sonner";


function Login(props: { goRegister: () => void; goDashboard: () => void; }) {
  const [email, setEmail] = useState("thanhbinhnkd@gmail.com");
  const [password, setPassword] = useState("password123");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      console.log(email, password);
      const res = await axios.post("http://localhost:8000/api/v1/auth/login", {
        email,
        password,
      });
      toast.success("Login successful");
      localStorage.setItem("access-token", res.data.accessToken);
      props.goDashboard();
    }
    catch {
      toast.error("Login failed");
    }
  }

  function handleGoToRegister(){
    props.goRegister();
  }

  function handleGoToOauth2(){
    window.location.href = "http://localhost:8000/api/v1/auth/google"; 
  }

  return (
    <div className=" flex flex-col items-center h-screen w-screen mt-8">

      <h1 className="text-4xl font-bold"> Login form</h1>
      <form  onSubmit={handleSubmit} className="flex flex-col space-y-1 border p-6 rounded-md h-auto shadow-md mt-4">
        <div className="">
          <label htmlFor="email">Email</label>
          <Input value={email} onChange={ (e) => { setEmail(e.target.value)}} placeholder="email" type="email" id="email"/>
        </div>
        <div className="mt-4">
          <label htmlFor="password">Password</label>
          <Input  value={password} onChange={ (e) => { setPassword(e.target.value)}} placeholder="password" type="password" id="password"/>
        </div>
        <Button className="bg-black text-white" type="submit" >Log in</Button>
        <p className="text-center">or</p>
        <Button className="bg-black text-white" onClick={handleGoToOauth2}>Login with Google</Button>
        <div className="flex justify-between items-center mt-4">
          <p className="text-xs">Don't have an account?</p>
          <p className="text-xs cursor-pointer" onClick={handleGoToRegister}>Sign up now</p>
        </div>
      </form>
    </div>
  )
}

export default Login;