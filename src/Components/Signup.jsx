import React, { useState } from "react";

function Signup() {
  const [form, setForm] = useState({name:"", email: "", password: "", phone:"", user:"" });
  const [red, setRed] = useState("");
  let submit = async () => {
    if(form['email'].trim()!=="" || form['password'].trim()!=="" || form['name'].trim()!==""){
      if(!form['email'].includes("@gmail.com")){
        setRed("email")
      } else if(form['password'].length < 8){
        setRed("password")
      } else if(form['phone'].length != 10){
        setRed("phone")
      }
      else{
        try{
          let response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(form),
          });
          console.log(response)
          if (response.statusText == "CONFLICT"){
            setRed("email")
          }
          if (response.ok) {
            window.location.pathname = "/";
          }
        }catch{
          setRed("email")
        }
      }
    }else{
        alert("Fill all details.")
        setRed("all")
    }
  };
  return (
      <div className="m-auto flex flex-col border-3 p-10 mt-15 rounded">
        <h1 className="text-5xl m-auto">Create an account</h1>
        <input type="text" className={` outline-none border mt-5 rounded p-2 ${
            red === "name" || red==="all" ? "border-red-500" : ""
          }`} name="name" placeholder="Name" onChange={(e)=>setForm({...form, [e.target.name]:e.target.value})} />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
          className={` outline-none border mt-5 rounded p-2 ${
            red === "email" || red==="all" ? "border-red-500" : ""
          }`}
          name="email"
        />
        {red=="email" && <h1 className="text-lg text-red-500">Invalid Email</h1>}
        <input type="number" name="phone" className={` outline-none border mt-5 rounded p-2 ${
            red === "phone" || red==="all" ? "border-red-500" : ""
          }`} placeholder="Phone" onChange={(e)=>setForm({...form, [e.target.name]:e.target.value})} />
          {red=="Phone" && <h1 className="text-lg text-red-500">"Invalid phone</h1>}
          {red=='phone' && <h1 className="text-lg text-red-500">Invalid phone</h1>}
        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
          className={`mt-5 rounded border p-2 outline-none ${red=="all"?"border-red-500":""}`}
          name="password"
        />
        {red=="password" && <h1 className="text-lg text-red-500">"Password must be at least 8 characters.</h1>}
        <h1 className="text-xl mt-1">Type of user</h1>
        <select name="user" onChange={(e)=>{setForm({...form, [e.target.name]:e.target.value});console.log(e.target.value)}} className= {`p-2 border mt-3 rounded ${red=="all"?"border-red-500":""} outline-none`}>
          <option value="consumer" selected>Consumer</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={submit} className=" rounded-lg border-2 font-semibold outline-none cursor-pointer hover:bg-black hover:text-white m-auto p-2 mt-6 ">SignUp</button>
        <a href="/login" className=" font-bold m-auto mt-3 ">Already have an ID?</a>
      </div>
  );
}

export default Signup;
