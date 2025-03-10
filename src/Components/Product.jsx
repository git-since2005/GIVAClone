import React, { useState, useEffect } from "react";

function Product(props) {
  const [image, setImage] = useState(" ");
  const [product, setProduct] = useState({});

  async function getImage(img) {
    const formData = new FormData();
    formData.append("filename", props.img || img);
    console.log(props.img, img);
    let response = await fetch(`${import.meta.env.VITE_API_URL}/getImage`, {
      method: "POST",
      headers: {
        Accept: "image/png",
      },
      body: formData,
    });
    console.log(formData);
    let blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setImage(url);
  }

  useEffect(() => {
    let fetchInfo = async () => {
      let response = await fetch(
        `${import.meta.env.VITE_API_URL}/fetchOneProduct`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ product: props.id }),
        }
      );
      if (response.ok) {
        let json = await response.json();
        setProduct(json);
        getImage(json[0].image);
      }
    };
    if (typeof props.title == "undefined") {
      fetchInfo();
    } else {
      getImage();
    }
  }, []);

  async function removeItem(id) {
    if (props.use !== "admin") {
      let response = await fetch(`${import.meta.env.VITE_API_URL}/deleteCart`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          user: JSON.parse(localStorage.getItem("user"))["userId"],
          product: id,
        }),
      });
      console.log(response);
      if (response.ok) {
        window.location.reload();
      }
    } else {
      console.log(
        JSON.stringify({
          token: JSON.parse(localStorage.getItem("user"))["token"],
          product: props.id,
        })
      );
      let response = fetch(`${import.meta.env.VITE_API_URL}/deleteProduct`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          token: JSON.parse(localStorage.getItem("user"))["token"],
          product: props.id,
        }),
      });
      if (response.ok) {
        window.location.reload();
      }
    }
  }

  return (
    <div
      onClick={() => (window.location += "?product=" + props.id)}
      className=" rounded-lg shadow-lg rounded flex flex-col transition w-[200px] h-[300px] bg-white hover:scale-[1.1] cursor-pointer "
    >
      {product[0] ? (
        <>
          <img src={image} className=" w-[100px] h-[100px] m-auto " />
          <h1 className=" text-lg font-light m-auto ml-3 ">
            {product[0].title}
          </h1>
          <h1 className=" text-base font-light m-auto ml-3 ">
            {product[0].desc}
          </h1>
          <h1 className=" text-sm font-light m-auto ml-3 ">
            {product[0].price}$
          </h1>
          <button
            onClickCapture={(e) => {
              e.stopPropagation();
              removeItem(props.id);
            }}
            className=" p-1 border-1 text-sm w-[90%] m-auto rounded cursor-pointer hover:bg-black hover:text-white "
          >
            Remove
          </button>
        </>
      ) : (
        <>
          <img src={image} className=" w-[100px] h-[100px] m-auto " />
          <h1 className=" text-lg font-light m-auto ml-3 ">{props.title}</h1>
          <h1 className=" text-base font-light m-auto ml-3 ">{props.desc}</h1>
          <h1 className=" text-sm font-light m-auto ml-3 ">{props.price}$</h1>
        </>
      )}
    </div>
  );
}

export default Product;
