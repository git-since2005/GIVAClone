import React, { useState, useEffect } from "react";

function OwnedProduct(props) {
  const [form, setForm] = useState({
    title: props.title,
    desc: props.desc,
    price: props.price,
    imageLink: "",
  });
  const [img, setImg] = useState("");
  const [image, setImage] = useState(null);
  let inputStyles =
    " p-1 w[9%] border-1 border-black rounded m-auto resize-none ";

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
      if (response.ok) {
        window.location.reload();
      }
    } else {
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

  async function updateItem(id) {
    const formData = new FormData();
    formData.append("record_id", form.record_id);
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("image", image);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/updateProduct`, {
        method: "POST",
        headers:{
          "Content-type":"application/json"
        },
        body: JSON.stringify({
          title: form["title"],
          desc: form["desc"],
          price: form["price"],
          product: props.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Product updated successfully!");
      } else {
        alert(`Error: Updating in Product`);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  }
  async function getImage(img) {
    let image = "";
    if (props.img) {
      image = props.img;
    } else if (img) {
      image = img;
    }
    if (!image.includes(".")) {
      const formData = new FormData();
      formData.append("filename", props.img || img);
      let response = await fetch(`${import.meta.env.VITE_API_URL}/getImage`, {
        method: "POST",
        headers: {
          Accept: "image/png",
        },
        body: formData,
      });
      let blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImg(url);
    } else {
      setImg(props.img || img);
    }
  }
  useEffect(() => {
    getImage(props.img);
  }, []);
  return (
    <div className=" w-[100%] rounded flex shadow-lg m-auto ">
      <img src={img} className=" w-[110px] h-[110px] " />
      <input
        className={inputStyles}
        type="text"
        value={form['title']}
        name="title"
        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
      />
      <textarea
        className={inputStyles}
        value={form['desc']}
        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
        name="desc"
      ></textarea>
      <input
        type="number"
        name="price"
        value={form['price']}
        className={inputStyles}
        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
      />
      <div className="controls m-auto flex flex-col gap-2">
        <button
          className=" cursor-pointer bg-red-500 p-2 rounded "
          onClick={() => removeItem(props.id)}
        >
          Delete
        </button>
        <button
          className=" cursor-pointer bg-green-500 p-2 rounded "
          onClick={() => updateItem(props.id)}
        >
          Update
        </button>
      </div>
    </div>
  );
}

export default OwnedProduct;
