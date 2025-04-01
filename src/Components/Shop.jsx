import React, { useState, useEffect } from "react";
import Product from "./Product";

function Shop() {
  const [products, setProducts] = useState({});
  const [product, setProduct] = useState({});
  const [image, setImage] = useState(" ");
  const [buy, setBuy] = useState(false);
  const [mode, setMode] = useState("cod");
  const [amt, setAmt] = useState(0);
  const [checked, changeCoupon] = useState(false)

  async function buyProduct(id){
    try {
      let datas = JSON.parse(localStorage.getItem("user"))
      if(!localStorage.getItem("user")){
        window.location.pathname = "/login"
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL}/createOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product[0].productId,
          userId: datas["userId"],
          token: datas['token'],
          coupon:checked
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Product purchased successfully!");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Request failed", error);
      alert("Failed to buy the product.");
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
        if (response.ok) {
          let json = await response.json();
          setProduct(json);
          console.log("H");
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
    if(!localStorage.getItem("user")){
      window.location.pathname = "/login"
    }
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
    try {
      const formData = new FormData();
      console.log("Hi", product[0]);
      formData.append("filename", product[0].image);
      let response = await fetch(`${import.meta.env.VITE_API_URL}/getImage`, {
        method: "POST",
        body: formData,
      });
      let blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImage(url);
    } catch {
      console.log("No image found");
    }
  }
  useEffect(() => {
    getImage();
    console.log(product);
  }, [product]);

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
              img={products[e].image || products[e].imageLink}
              desc={products[e].desc}
              price={products[e].price}
            />
          );
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
                <button
                  onClick={() => {
                    setBuy(true);
                    setTimeout(() => {
                      window.scrollTo({ top: document.body.scrollHeight });
                    }, 900);
                  }}
                  className=" p-2 border-3 rounded-lg hover:bg-black transition hover:text-white cursor-pointer outline-none "
                >
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
          {buy && (
            <div className="buy mt-40 flex flex-col">
              <label htmlFor="coupon">Apply coupon GROWTHZI</label>
              <input type="checkbox" className=" ml-0 w-[1%] scale-150 mb-2  " id="coupon" checked = {checked} onChange={()=>changeCoupon(true)} value={true} />
              <div className="flex ">
                <div className="flex flex-col">
                  <div
                    className={` hover:bg-[#a3a3a3] p-2 ${
                      mode === "cod" ? "bg-[#a3a3a3]" : ""
                    } rounded `}
                    onClick={() => {
                      setMode("cod");
                    }}
                  >
                    <h1 className=" m-auto font-bold text-lg ">
                      Pay on Delivery
                    </h1>
                  </div>
                  <div
                    className={` hover:bg-[#a3a3a3] p-2 rounded ${
                      mode !== "cod" ? "bg-[#a3a3a3]" : ""
                    }`}
                    onClick={() => setMode("")}
                  >
                    <h1 className=" m-auto font-bold text-lg ">Pay via <br />Dummy-Pay</h1>
                  </div>
                </div>
                {mode != "cod" && (
                  <>
                    <div className=" w-full pay border border-black flex flex-col rounded ">
                      {/* <input
                        type="number"
                        className=" w-[4%] p-2 w-full outline-none "
                        name=""
                        value={amt}
                        onChange={(e) => setAmt(e.target.value)}
                        placeholder="Enter amount to be debited"
                      /> */}
                      <h1 className = "text-3xl ml-auto">Price: {product[0].price}$</h1>
                      <h1 className = "text-3xl ml-auto">Delivery Charges: 10$</h1>
                      {checked && <h1 className = "text-3xl ml-auto">GROWTHZI Coupon Discount: 50$</h1>}
                      <hr />
                      {checked ? <h1 className = "text-3xl ml-auto">Total: {product[0].price+10-50}$</h1> : <h1 className = "text-3xl ml-auto">Total: {product[0].price+10}$</h1>}
                    </div>
                  </>
                )}
              </div>
              <button onClick={()=>buyProduct(product[0].productId)} className="bg-yellow-600 mt-2 p-2 text-xl rounded hover:shadow-xl cursor-pointer ml-auto">
                Buy
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Shop;
