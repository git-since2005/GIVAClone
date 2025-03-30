import React from "react";

function VendorOrder(props) {
  return (
    <div className=" w-[60%] p-2 flex m-auto ">
      <div className="flex flex-col">
        <h1 className=" text-lg ">{props.title}</h1>
        <h1 className=" text-xl ">User: {props.user_id}</h1>
        <h1 className=" text-lg ">OrderId: {props.id}</h1>
      </div>
      <div className="flex flex-col m-auto">
        <button className=" bg-green-500 p-2 rounded cursor-pointer outline-none " onClick={async()=>{
            let datas = JSON.parse(localStorage.getItem("user"))
            let response = await fetch(`${import.meta.env.VITE_API_URL}/shipOrder`, {
                method:"POST",
                headers:{"Content-type":"application/json"},
                body:JSON.stringify({
                    token:datas.token,
                    order:props.id
                })
            })
            if(response.ok){
                window.location.reload()
            }
        }}>Accept</button>
      </div>
    </div>
  );
}

export default VendorOrder;
