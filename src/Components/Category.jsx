import React from 'react'

function Category(props) {
  return (
    <div className=" flex flex-col ml-5 h-[190px] w-[190px] m-auto mt-23 gap-5 ">
      <img src={props.img} className="scale-[1.5] mb-5 mt-5" />
      <h1 className=" text-xl font-light m-auto mt-5 ">{props.title}</h1>
    </div>
  )
}

export default Category