import React, { useState } from "react";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [red, setRed] = useState("");
  let submit = async () => {
    if (form["email"].trim() !== "" || form["password"].trim() !== "") {
      try {
        let response = await fetch(`${import.meta.env.VITE_API_URL}/signin`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(form),
        });
        if (response.ok) {
            let json = await response.json();
            localStorage.setItem("user", JSON.stringify({"userId":json.user, "token":json.token}));
          window.location.pathname = "/";
        }
        else if (response.statusText == "CONFLICT") {
          setRed("email");
        }
        else if (response.statusText == "BAD REQUEST") {
          setRed("password");
        }
      } catch {
        setRed("password");
      }
    } else {
      alert("Fill all details.");
      setRed("all");
    }
  };
  return (
    <div className="m-auto flex flex-col border-3 p-10 mt-25 rounded">
      <h1 className="text-5xl m-auto">Login your account</h1>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
        className={` outline-none border mt-5 rounded p-2 ${
          red === "email" || red === "all" ? "border-red-500" : ""
        }`}
        name="email"
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
        className={`mt-5 rounded border p-2 outline-none ${
          red == "all" || red == "password" ? "border-red-500" : ""
        }`}
        name="password"
      />
      <button
        onClick={submit}
        className=" rounded-lg border-2 font-semibold outline-none cursor-pointer hover:bg-black hover:text-white m-auto p-2 mt-6 "
      >
        Login
      </button>
      <a href="/signup" className=" font-semibold mt-3 m-auto ">
        Don't have an ID?
      </a>
    </div>
  );
}

export default Login;
