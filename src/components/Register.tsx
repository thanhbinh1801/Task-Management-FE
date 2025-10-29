import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
    <div className="flex justify-center align-center h-screen w-screen">

      <h1 className="font-bold text-center"> Register form</h1>
      <form  onSubmit={handleSubmit}>
        <div className="mt-4">
          <label htmlFor="name">Name</label>
          <Input  value={name} onChange={ (e) => { setName(e.target.value)}} placeholder="name" type="text" id="name"/>
        </div>
        <div className="mt-4">
          <label htmlFor="email">Email</label>
          <Input value={email} onChange={ (e) => { setEmail(e.target.value)}} placeholder="email" type="email" id="email"/>
        </div>
        <div className="mt-4">
          <label htmlFor="password">Password</label>
          <Input  value={password} onChange={ (e) => { setPassword(e.target.value)}} placeholder="password" type="password" id="password"/>
        </div>
        <Button className="mt-4" type="submit">Submit</Button>
        <p>You have an account</p>
        <p onClick={handleGoToLogin}>Sign in </p>
      </form>
    </div>
  )
}

export default Register;