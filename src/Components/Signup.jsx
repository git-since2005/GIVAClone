import React, { useState } from "react";

function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [red, setRed] = useState("");
  let submit = async () => {
    if(form['email'].trim()!=="" || form['password'].trim()!==""){
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
    }else{
        alert("Fill all details.")
        setRed("all")
    }
  };
  return (
      <div className="m-auto flex flex-col border-3 p-10 mt-25 rounded">
        <h1 className="text-5xl m-auto">Create an account</h1>
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
        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
          className={`mt-5 rounded border p-2 outline-none ${red=="all"?"border-red-500":""}`}
          name="password"
        />
        <button onClick={submit} className=" rounded-lg border-2 font-semibold outline-none cursor-pointer hover:bg-black hover:text-white m-auto p-2 mt-6 ">SignUp</button>
        <a href="/login" className=" font-bold m-auto mt-3 ">Already have an ID?</a>
      </div>
  );
}

export default Signup;
