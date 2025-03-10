import React, { useState, useEffect } from "react";
import Product from "./Product";

function Shop() {
  const [products, setProducts] = useState({});
  const [product, setProduct] = useState({});
  const [image, setImage] = useState(" ")


  async function fetchProducts() {
    let response = await fetch("https://fakestoreapi.com/products");
    if (response.ok) {
      let json = await response.json();
      setProducts({ ...products, json });
    }
  }
  async function fetchDatabase() {
    let response = await fetch(
      `${import.meta.env.VITE_API_URL}/fetchDatabase`,
      {
        method: "POST",
      }
    );
    if (response.ok) {
      let json = await response.json();
      setProducts(json);
    }
  }

  async function fetchOne() {
    try {
      let id = new URLSearchParams(window.location.search).get("product");
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/fetchOneProduct`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            product: id,
          }),
        }
      );
      if (id) {
        if(response.ok){
            let json = await response.json();
            setProduct(json);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    fetchOne();
    fetchDatabase();
  }, []);

  async function addCart(id) {
    let response = await fetch(`${import.meta.env.VITE_API_URL}/addCart`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        user: JSON.parse(localStorage.getItem("user"))["userId"],
        product: id,
      }),
    });
  }

  async function getImage() {
    try{
      const formData = new FormData();
      formData.append("filename", product[0].image);
      let response = await fetch(`${import.meta.env.VITE_API_URL}/getImage`, {
      method: "POST",
      body: formData,
    });
    let blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setImage(url)
    }
    catch{
      console.log("No image found")
    }
  }
  useEffect(() => {
    getImage()
    console.log(product)
  }, [product])
  

  return (
    <div className=" w-[80%] m-auto mt-10 flex flex-wrap gap-5 ">
      {window.location.search === "" &&
        Object.keys(products).map((e) => {
          console.log(products[e]);
          return (
            <Product
              key={products[e].id}
              id={products[e].productId}
              title={products[e].title}
              img={products[e].image}
              desc={products[e].desc}
              price={products[e].price}
            />
          );
          // if(products[e].category == "jewelery"){
          // }
        })}
      {window.location.search !== "" && product[0] && (
            <div className="flex flex-col m-auto w-full">
            <button
                className=" p-2 bg-black cursor-pointer m-auto ml-0 rounded-lg text-white "
                onClick={() => (window.location = window.location.origin + "/shop")}
            >
                Back
            </button>
            <div className="flex gap-5 m-auto">
                <img
                src={image}
                className=" rounded w-[400px] h-[400px] "
                loading="lazy"
                />
                <div className="flex flex-col">
                <h1 className=" text-3xl ">{product[0]["title"]}</h1>
                <h1 className=" text-lg ">{product[0]["desc"]}</h1>
                <h1 className=" text-xl ">{product[0]["price"]}$</h1>
                <div className="flex flex-col mt-5 gap-5">
                    <button className=" p-2 border-3 rounded-lg hover:bg-black transition hover:text-white cursor-pointer outline-none ">
                    Buy
                    </button>
                    <button
                    onClick={() => addCart(product[0]["productId"])}
                    className=" p-2 border-3 rounded-lg hover:bg-white transition hover:text-black cursor-pointer outline-none bg-black text-white "
                    >
                    Add to Cart
                    </button>
                </div>
                </div>
            </div>
            </div>
        )}
    </div>
  );
}

export default Shop;
