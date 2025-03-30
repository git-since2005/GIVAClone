import React, {useState, useEffect} from "react";
import Logo from "../assets/GDLR0165_1-removebg-preview.png";
import Category from "./Category"
import Product from "./Product"

function Home() {
  const [products, setProducts] = useState({});
  const [image, setImage] = useState(" ")

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

  useEffect(()=>{
    fetchDatabase()
  }, [])

  return (
    <div className=" h-full w-full flex flex-col ">
      <div className=" text m-auto flex flex-col home-bg ">
        <div className="flex flex-col m-auto mt-44 ml-40 ">
          <h1 className=" text-2xl font-[Montserrat] font-medium ">
            SAVE UP TO 10%
          </h1>
          <h1 className=" text-7xl font-[aaa] ">
            Find Your New <br /> Heirloom
          </h1>
          <h1 className=" text-lg font-[aaa] ">
            Certain things are made to cherished for a lifetime--now's the tiem{" "}
            <br /> to give on your forever piece.
          </h1>
        </div>
      </div>
      <div className="products flex">
      {window.location.search === "" &&
        Object.keys(products).map((e) => {
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
          // if(products[e].category == "jewelery"){
          // }
        })}
      </div>
      <div className="products h-full w-screen flex flex-col shadow-[inset_0px_30px_70px_rgba(0,0,0,0.3)] bg-white">
        <div className="upper m-auto flex mt-10">
          <img src={Logo} className=" scale-[1.7] " />
          <div className="flex-col flex m-auto">
            <h1 className=" text-9xl text-blue-700 sale ">Sale</h1>
            <h1 className=" text-5xl text-blue-500">Upto 70% OFF</h1>
            <h1 className=" text-5xl text-blue-600">-THIS WEEK ONLY-</h1>
          </div>
        </div>
        <div className="products w-full m-auto bg-white mt-5 ">
            <div className="w-[80%] flex bg-white m-auto flex gap-11 flex-wrap ">
            <Category title="Rings" img={"https://www.giva.co/cdn/shop/collections/pink_rings_c356f6b3-6547-4e39-9b08-dfdf5ecfc2b0.jpg?v=1740475053"} />
            <Category title="Earrings" img={"https://www.giva.co/cdn/shop/collections/earrings_pink-min.png?v=1740475081"} />
            <Category title="Bracelets" img={"https://www.giva.co/cdn/shop/collections/pink_br-min.png?v=1740475031"} />
            <Category title="Sets" img={"https://www.giva.co/cdn/shop/collections/pink_br-min.png?v=1740475031"} />
            <Category title="Anklets" img={"https://www.giva.co/cdn/shop/collections/pink_br-min.png?v=1740475031"} />
            <Category title="Mangalsutra" img={"https://www.giva.co/cdn/shop/collections/pink_br-min.png?v=1740475031"} />
            <Category title="Fragrances" img={"https://www.giva.co/cdn/shop/collections/Perfume_250_x_250-min.png?v=1740474729"} />
            </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
