import React from 'react'

export default function Card({ title, value, className }) {
  return (
    <div className={`flex flex-col justify-center items-center ${className}`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl mt-2">{value}</p>
    </div>
  )
}
