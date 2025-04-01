import React, { useState, useEffect } from "react";
import OwnedProduct from "./OwnedProduct";
import VendorOrder from "./VendorOrder";
import Product from "./Product";

function Users() {
  const [files, uploadFile] = useState(null);
  const [form, setForm] = useState({
    title: "",
    desc: "",
    price: 0,
    quantity: 0,
    imageLink: "",
  });
  const [name, setName] = useState("");
  const [products, setProducts] = useState({});
  const [orders, setOrders] = useState({});
  const [history, setHistory] = useState({});
  const [type, setType] = useState("");

  async function fetchCreatedProducts() {
    let response = await fetch(
      `${import.meta.env.VITE_API_URL}/fetchCreatedProducts`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          user: JSON.parse(localStorage.getItem("user"))["userId"],
        }),
      }
    );
    if (response.ok) {
      let json = await response.json();
      setProducts(json);
    }
  }
  async function fetchCustomerOrders() {
    let datas = JSON.parse(localStorage.getItem("user"));
    let response = await fetch(
      `${import.meta.env.VITE_API_URL}/customerOrders`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ user: datas["userId"], token: datas["token"] }),
      }
    );
    if (response.ok) {
      let json = await response.json();
      setOrders(json.orders);
    }
  }
  let upload = async () => {
    const formData = new FormData();
    formData.append("title", form["title"]);
    formData.append("desc", form["desc"]);
    formData.append("price", form["price"]);
    formData.append("quantity", form["quantity"]);
    if (!(files || form["imageLink"])) {
      alert("Upload an image or paste URL");
      console.log(files, "Hi", files || form["imageLink"]);
    } else {
      console.log();
      if (files) {
        alert("Uploading");
        formData.append("image", files);
      } else if (form["imageLink"]) {
        formData.append("image", form["imageLink"]);
      }
      console.log(form);
      formData.append(
        "user",
        JSON.parse(localStorage.getItem("user"))["userId"]
      );

      console.log(formData);
      let response = await fetch(`${import.meta.env.VITE_API_URL}/addProduct`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        window.location.reload();
      }
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
      setType(json.user);
    }
  };

  async function fetchOrderHistory() {
    let response = await fetch(`${import.meta.env.VITE_API_URL}/orderHistory`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        token: JSON.parse(localStorage.getItem("user"))["token"],
      }),
    });
    if (response.ok) {
      let json = await response.json();
      console.log(json);
      setHistory(json.orders);
    }
  }

  useEffect(() => {
    getUser();
    fetchCreatedProducts();
    fetchCustomerOrders();
    fetchOrderHistory();
  }, []);

  return (
    <div className=" flex flex-col ">
      <h1 className=" text-6xl font-thin m-auto ml-20 mt-7 mb-7 ">
        Hi {name},
      </h1>
      <h1 className=" text-3xl font-thin m-auto ml-20 mt-7 mb-7 ">
        Order History
      </h1>
      <div className="flex flex-wrap w-[70%] m-auto p-10 gap-5 ">
        {Object.keys(history).map((e) => {
          console.log(history[e]);
          return (
            <Product
              key={history[e].id}
              id={history[e].productId}
              title={history[e].title}
              img={history[e].image || history[e].imageLink}
              desc={history[e].desc}
              price={history[e].price}
              status={history[e].status}
            />
          );
        })}
      </div>
      {type == "admin" && (
        <>
          <h1 className=" text-3xl font-thin m-auto ml-20 mt-7 mb-7 ">
            Customer orders,
          </h1>
          <div className=" flex flex-wrap w-[70%] m-auto p-10 gap-5 ">
            {Object.keys(orders).map((e) => {
              console.log(orders[e]);
              return (
                <VendorOrder
                  key={orders[e].order_id}
                  id={orders[e].order_id}
                  title={orders[e].title}
                  user_id={orders[e].user_id}
                  use="admin"
                />
              );
            })}
          </div>
          <h1 className=" text-3xl font-thin m-auto ml-20 mt-7 mb-7 ">
            Your owned products,
          </h1>
          <div className=" flex flex-wrap w-[70%] m-auto p-10 gap-5 ">
            {Object.keys(products).map((e) => {
              return (
                <OwnedProduct
                  key={products[e].id}
                  id={products[e].productId}
                  title={products[e].title}
                  desc={products[e].desc}
                  price={products[e].price}
                  img={products[e].image || products[e].imageLink}
                  use="admin"
                />
              );
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
              type="number"
              name="quantity"
              className=" border rounded p-2 outline-none "
              placeholder="Quantity"
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
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
                console.log(e.target.files[0]);
              }}
              accept="image/png"
            />
            <input
              type="url"
              onChange={(e) => {
                setForm({ ...form, [e.target.name]: e.target.value });
                console.log(e.target.name, form);
              }}
              name="imageLink"
              className=" border rounded p-2 outline-none "
              placeholder="or URL for Image"
            />
            <button
              onClick={upload}
              className=" cursor-pointer border-3 hover:text-white hover:bg-black border rounded p-2 "
            >
              Upload
            </button>
          </div>
        </>
      )}
      {localStorage.getItem("user") ? (
        <>
          <h1 className=" text-3xl font-thin m-auto ml-10 ">Get logged out:</h1>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.pathname = "login";
            }}
            className=" border-0 rounded-lg m-auto bg-red-500 cursor-pointer ml-10 mb-2 p-2 "
          >
            Sign Out
          </button>
        </>
      ) : 
      <>
        <button className="border-0 rounded-lg m-auto bg-white border-black border-2 cursor-pointer ml-10 mb-2 p-2" onClick={()=>window.location.pathname = "/signup"}>SignUp</button>
        <button className="border-0 rounded-lg m-auto bg-white border-black border-2 cursor-pointer ml-10 mb-2 p-2" onClick={()=>window.location.pathname = "/login"}>LogIn</button>
      </>}
    </div>
  );
}

export default Users;
