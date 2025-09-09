import { Image, Sparkles, Download } from "lucide-react";
import React, { useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const imageStyles = [
    { style: "realistic", text: "Realistic", color: "from-gray-600 to-gray-400" },
    { style: "3d", text: "3D Render", color: "from-purple-500 to-pink-400" },
    { style: "cartoon", text: "Cartoon", color: "from-yellow-400 to-orange-500" },
    { style: "digital-art", text: "Digital Art", color: "from-blue-500 to-cyan-400" },
    { style: "anime", text: "Anime", color: "from-rose-500 to-red-400" },
    { style: "fantasy", text: "Fantasy", color: "from-indigo-500 to-purple-400" },
    { style: "cyberpunk", text: "Cyberpunk", color: "from-pink-500 to-purple-600" },
    { style: "vaporwave", text: "Vaporwave", color: "from-pink-400 to-cyan-400" },
    { style: "sketch", text: "Sketch", color: "from-gray-400 to-gray-200" },
    { style: "oil-painting", text: "Oil Painting", color: "from-yellow-600 to-red-500" },
  ];

  const [selectedStyle, setSelectedStyle] = useState("realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const prompt = `${input} in ${selectedStyle} style`;

      const { data } = await axios.post('/api/ai/generate-image', { prompt, publish });

      if (data.success) {
        setGeneratedImage(data.content);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    }

    setLoading(false);
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = "generated-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-8 flex flex-col lg:flex-row items-start gap-8 bg-gradient-to-br from-gray-50 to-gray-100 text-slate-700">
      
      {/* left col */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-md border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-7 h-7 text-[#F59E0B]" />
          <h1 className="text-2xl font-bold tracking-tight">Image Generator</h1>
        </div>

        <p className="text-sm font-medium text-gray-700">Describe your Image</p>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          className="w-full p-3 mt-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#226BFF] outline-none resize-none"
          placeholder="A futuristic cityscape at sunset..."
          required
        />

        <p className="mt-6 text-sm font-medium text-gray-700">Style</p>
        <div className="mt-3 flex gap-3 flex-wrap">
          {imageStyles.map((item, index) => {
            const isSelected = selectedStyle === item.style;
            return (
              <span
                key={index}
                onClick={() => setSelectedStyle(item.style)}
                className={`text-xs px-4 py-1.5 rounded-full cursor-pointer border transition-all duration-300 
                  ${
                    isSelected
                      ? `text-white border-transparent bg-gradient-to-r ${item.color} shadow-md`
                      : "text-gray-600 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {item.text}
              </span>
            );
          })}
        </div>

        {/* Publish Toggle */}
        <div className="flex items-center gap-3 my-6">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition"></div>
            <span className="absolute left-1 top-0.5 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></span>
          </label>
          <p className="text-sm text-gray-600">Make this image public</p>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] hover:opacity-90 transition-all text-white px-5 py-3 mt-6 text-sm font-semibold rounded-xl shadow-lg"    
        >
          {loading ? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span> : <Image className="w-5 h-5" />}
          Generate Image
        </button>
      </form>

      {/* right col */}
      <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-md flex flex-col border border-gray-200 min-h-96 max-h-[600px] overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <Image className="w-6 h-6 text-[#F59E0B]" />
          <h1 className="text-2xl font-bold tracking-tight">Generated Images</h1>
        </div>

        {!generatedImage ? (
          <div className="flex flex-1 justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Image className="w-10 h-10" />
              <p className="text-center max-w-[80%]">Enter a description, pick a style, then click <span className="font-medium text-[#226BFF]">"Generate Image"</span></p>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex flex-col items-center gap-4">
            <img src={generatedImage} alt="Generated" className="w-full rounded-xl shadow-md" />
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow-md font-medium transition"
            >
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImages;
