import React, {useState, useEffect} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { GoPerson } from "react-icons/go";
import { FaRegHeart } from "react-icons/fa";
import { TbShoppingBag } from "react-icons/tb";
import Home from "./Components/Home"
import Signup from "./Components/Signup"
import Shop from "./Components/Shop"
import Users from "./Components/Users"
import Login from "./Components/Login"
import Carts from "./Components/Carts"

function App() {
  const [count, setCount] = useState(0)
  async function getCount(){
    try{
      let response = await fetch(`${import.meta.env.VITE_API_URL}/countCart`,{
        method:"POST",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({"user":JSON.parse(localStorage.getItem("user"))['userId']})
      })
      if(response.ok){
        let json = await response.json()
        setCount(json.count)
      }else{
        setCount(0)
      }
    }
    catch{
      console.log("Server still fetching.")
    }
  }
  useEffect(()=>{
    getCount()
  }, [])
  return (
    <div className=" flex flex-col ">
      <BrowserRouter>
        {<div className=" flex w-full h-[100px] bg-white ">
          <div className=" flex flex-col ">
            <img
              src="https://www.giva.co/cdn/shop/files/300x129.png"
              className=" scale-[0.4] -mt-5 "
            />
            <p className=" m-auto text-sm w-fit -mt-7 ">
              Fine Silver Jewellery
            </p>
          </div>
          <div className="options ml-15 w-fit m-auto flex gap-17">
            <a
              className={`${
                window.location.pathname == "/" ? "text-blue-500" : ""
              }`}
              href="/"
            >
              Home
            </a>
            <a
              className={`${
                window.location.pathname == "category" ? "text-blue-500" : ""
              }`}
              href="/"
            >
              Category
            </a>
            <a
              className={`${
                window.location.pathname == "collections" ? "text-blue-500" : ""
              }`}
              href="/"
            >
              Collections
            </a>
            <a
              className={`${
                window.location.pathname == "/shop" ? "text-blue-500" : ""
              }`}
              href="/shop"
            >
              Shop
            </a>
            <a
              className={`${
                window.location.pathname == "offers" ? "text-blue-500" : ""
              }`}
              href="/"
            >
              Offers
            </a>
            <a
              className={`${
                window.location.pathname == "stores" ? "text-blue-500" : ""
              }`}
              href="/"
            >
              Gift Stores
            </a>
          </div>
          <div className=" icons w-fit m-auto flex gap-10 ">
            <IoSearch size={23} className="cursor-pointer" />
            <GoPerson size={23} onClick={()=>window.location.pathname = "user"} className="cursor-pointer" />
            <FaRegHeart size={23} className="cursor-pointer" />
            <div onClick={()=>window.location.pathname = "cart"} className=" relative w-fit flex flex-col">
              <TbShoppingBag size={23} className="cursor-pointer" />
              <h1 className="relative z-1 ml-auto text-sm w-fit h-fit bg-red-500 rounded">{count}</h1>
            </div>
          </div>
        </div>}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/user" element={<Users />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Carts />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
