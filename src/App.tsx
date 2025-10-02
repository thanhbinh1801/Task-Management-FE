import { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import axios from "axios";
import { toast } from "sonner";

export function App() {
  const [name, setName] = useState("Thanh Bình");
  const [email, setEmail] = useState("thanhbinhnkd@gmail.com");
  const [password, setPassword] = useState("password123");


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      console.log(email, password, name);
      const res = await axios.post("http://localhost:8000/api/v1/auth/login", {
        email,
        password,
      });
      console.log(res);
      toast.success("Login successful");
    }
    catch {
      toast.error("login failed");
    }
  }

  return (
    <div className="flex justify-center align-center h-screen w-screen">
      <h1 className="font-bold text-center"> Login form</h1>
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
      </form>
    </div>
  )
}