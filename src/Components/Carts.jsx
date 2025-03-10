import React, { useState, useEffect } from "react";
import Product from "./Product";

function Carts() {
  const [cart, setCart] = useState({});
  useEffect(() => {
    let fetchCart = async () => {
      let response = await fetch(`${import.meta.env.VITE_API_URL}/fetchCart`, {
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
        setCart(json);
      }
    };
    fetchCart();
  }, []);
  return (
    <div className="flex flex-wrap m-auto w-[70%] mt-5">
      {cart.status != "empty" ? Object.keys(cart).map((e) => {
        return <Product key={cart[e].product} id={cart[e].product} />;
      }): <h1 className=" text-2xl opacity-50 m-auto mt-50 ">Cart is Empty!</h1>}
    </div>
  );
}

export default Carts;
