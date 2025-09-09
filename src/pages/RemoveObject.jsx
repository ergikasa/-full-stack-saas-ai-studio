import { Scissors, Sparkles } from 'lucide-react';
import React, { useState } from 'react'

const RemoveObject = () => {
     
  const [input, setInput] = useState('')
  const [object, setObject] = useState('')
     
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Add your remove object logic here
  }
  
  return (
    <div className="h-full overflow-y-scroll p-8 flex flex-col lg:flex-row items-start gap-8 bg-gradient-to-br from-gray-50 to-gray-100 text-slate-700">
      
      {/* left col */}
      <form 
        onSubmit={onSubmitHandler} 
        className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-md border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-4"> 
          <Sparkles className='w-7 h-7 text-[#FF4938]'/>
          <h1 className="text-2xl font-bold tracking-tight">Object Removal</h1>
        </div>

        <p className="text-sm font-medium text-gray-700">Upload Image</p>
        <input 
          onChange={(e) => setInput(e.target.files[0])} 
          accept='image/*'
          type="file" 
          className="w-full p-3 mt-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF4938] outline-none"
          required
        />

        <p className="mt-6 text-sm font-medium text-gray-700">Describe object to remove</p>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={4}
          className="w-full p-3 mt-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#F6AB41] outline-none resize-none"
          placeholder="Example: tree, car, person..."
          required
        />

        <button 
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] hover:opacity-90 transition-all text-white px-5 py-3 mt-6 text-sm font-semibold rounded-xl shadow-lg"
        >
          <Scissors className="w-5 h-5"/> Remove Object
        </button>
      </form>
      
      {/* right col */}
      <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-md border border-gray-200 min-h-96 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <Scissors className='w-6 h-6 text-[#8E37EB]'/>
          <h1 className="text-2xl font-bold tracking-tight">Results</h1>
        </div>
        <div className="flex flex-1 justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Scissors className='w-10 h-10'/>
            <p className="text-center max-w-[80%]">Upload an image and click <span className="font-medium text-[#FF4938]">"Remove Object"</span> to get started</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RemoveObject

