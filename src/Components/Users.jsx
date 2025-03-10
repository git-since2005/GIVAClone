import React, { useState, useEffect } from "react";
import Product from "./Product";

function Users() {
  const [files, uploadFile] = useState(null);
  const [form, setForm] = useState({ title: "", desc: "", price: 0 });
  const [name, setName] = useState("");
  const [products, setProducts] = useState({});
  
  async function fetchCreatedProducts() {
    let response = await fetch(`${import.meta.env.VITE_API_URL}/fetchCreatedProducts`, {
      method:"POST",
      headers:{
        "Content-type":"application/json"
      },
      body: JSON.stringify({user : JSON.parse(localStorage.getItem("user"))['userId']})
    });
    if (response.ok) {
      let json = await response.json();
      setProducts(json);
    }
  }
  let upload = async () => {
    console.log(`${import.meta.env.VITE_API_URL}`);
    const formData = new FormData();
    formData.append("image", files);
    formData.append("title", form["title"]);
    formData.append("desc", form["desc"]);
    formData.append("price", form["price"]);
    formData.append("user", JSON.parse(localStorage.getItem("user"))['userId'])
    console.log(formData);
    let response = await fetch(`${import.meta.env.VITE_API_URL}/addProduct`, {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      window.location.reload();
    }
  };

  let getUser = async () => {
    let response = await fetch(`${import.meta.env.VITE_API_URL}/userData`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        user: JSON.parse(localStorage.getItem("user"))["userId"],
      }),
    });
    if (response.ok) {
      let json = await response.json();
      setName(json.name);
    }
  };

  useEffect(() => {
    getUser();
    fetchCreatedProducts();
  }, []);

  return (
    <div className=" flex flex-col ">
      <h1 className=" text-6xl font-thin m-auto ml-20 mt-7 mb-7 ">
        Hi {name},
      </h1>
      <h1 className=" text-3xl font-thin m-auto ml-20 mt-7 mb-7 ">
        Your owned products,
      </h1>
      <div className=" flex flex-wrap w-[70%] m-auto p-10 gap-5 ">
        {Object.keys(products).map((e) => {
          console.log(products[e].image)
          return <Product key={products[e].id} id={products[e].productId} img = {products[e].image} use="admin" />;
        })}
      </div>
      <div className=" border-3 rounded-xl flex flex-col m-auto p-10 gap-5 ">
        <h1 className="text-3xl ">Upload your product</h1>
        <input
          type="text"
          className=" border rounded p-2 outline-none "
          onChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
          name="title"
          placeholder="Title"
        />
        <input
          type="text"
          className=" border rounded p-3 outline-none "
          onChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
          name="desc"
          placeholder="Description"
        />
        <input
          type="number"
          className=" border rounded p-2 outline-none "
          onChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
          min={1}
          max={100000000}
          name="price"
          placeholder="Price"
        />
        Image:
        <input
          type="file"
          className=" border rounded "
          onChange={(e) => {
            uploadFile(e.target.files[0]);
            console.log(e.target.files);
          }}
          accept="image/png"
        />
        <button
          onClick={upload}
          className=" cursor-pointer border-3 hover:text-white hover:bg-black border rounded p-2 "
        >
          Upload
        </button>
      </div>
      <h1 className=" text-3xl font-thin m-auto ml-10 ">Get logged out:</h1>
      <button onClick={()=>{localStorage.removeItem("user")}} className=" border-0 rounded-lg m-auto bg-red-500 cursor-pointer ml-10 mb-2 p-2 ">Sign Out</button>
    </div>
  );
}

export default Users;
