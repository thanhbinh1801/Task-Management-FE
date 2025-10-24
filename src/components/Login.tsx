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
      console.log("response: ", res);
      toast.success("Register successful");
      localStorage.setItem("access-token", res.data.accessToken);
      props.goDashboard();
    }
    catch {
      toast.error("Register failed");
    }
  }

  function handleGoToRegister(){
    props.goRegister();
  }

  return (
    <div className="flex justify-center align-center h-screen w-screen">

      <h1 className="font-bold text-center"> Login form</h1>
      <form  onSubmit={handleSubmit}>
        <div className="mt-4">
          <label htmlFor="email">Email</label>
          <Input value={email} onChange={ (e) => { setEmail(e.target.value)}} placeholder="email" type="email" id="email"/>
        </div>
        <div className="mt-4">
          <label htmlFor="password">Password</label>
          <Input  value={password} onChange={ (e) => { setPassword(e.target.value)}} placeholder="password" type="password" id="password"/>
        </div>
        <Button className="mt-4" type="submit" >Submit</Button>
        <p>You don't have an account</p>
        <p onClick={handleGoToRegister}>Sign up now</p>
      </form>
    </div>
  )
}

export default Login;