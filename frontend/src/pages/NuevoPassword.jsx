import React from 'react'

export const NuevoPassword = () => {
  return (
    <>
    <h1 className="text-sky-600 font-black text-6xl capitalize">Restablece tu {''} <span className="text-slate-700">password</span></h1>

    <form action="" className="my-10 bg-white shadow rounded-lg p-10">
    
      <div className="my-5">
        <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">Nuevo password</label>
        <input id="password" type="password" placeholder="nuevo password" className="w-full mt-3 p-3 border rounded-xl bg-gray-50" />
      </div>
      

      <input type="submit" value="Reestablecer password" className="bg-orange-500 mb-5 text-white py-3 w-full uppercase font-bold rounded hover:cursor-pointer hover:bg-orange-600 transition-colors" />
    </form>
  
  </>
  )
}
