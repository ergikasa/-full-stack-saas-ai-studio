import { useAuth } from '@clerk/clerk-react';
import { Hash, Sparkle, Copy } from 'lucide-react';
import React, { useState } from 'react';
import toast from "react-hot-toast";
import Markdown from 'react-markdown';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const blogcategories = ['General', 'Technology', 'Business', 'Health', 'Lifestyle', 'Education', 'Travel', 'Food'];
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log("Keyword:", input, "Category:", selectedCategory);

    try {
      setLoading(true);

      const prompt = `Generate a blog title for the keyword "${input}" in the category "${selectedCategory}"`;

      const token = await getToken();

      const { data } = await axios.post(
        '/api/ai/generate-blog-title',
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setContent(data.content);
        setCopied(false);
      } else {
        toast.error(data.message || "Something went wrong");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="h-full p-6 flex flex-col md:flex-row gap-6 text-slate-700">

      {/* left col: input */}
      <form
        onSubmit={onSubmitHandler}
        className="flex-1 bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex flex-col"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkle className='w-6 text-[#8E37EB]'/>
          <h1 className="text-xl font-semibold">AI Title Generator</h1>
        </div>

        <p className="mt-2 text-sm font-medium text-gray-700">Keyword</p>
        <input 
          onChange={(e) => setInput(e.target.value)} 
          value={input} 
          type="text" 
          className="w-full p-3 mt-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8E37EB] outline-none"
          placeholder="The future of Artificial Intelligence is..."  
          required
        />

        <p className="mt-6 text-sm font-medium text-gray-700">Category</p>
        <div className="mt-3 flex gap-3 flex-wrap">
          {blogcategories.map((item) => {
            const isSelected = selectedCategory === item;
            return (
              <span 
                key={item}
                onClick={() => setSelectedCategory(item)}
                className={`text-xs px-4 py-1.5 rounded-full cursor-pointer border transition-all duration-300
                  ${isSelected
                    ? 'bg-purple-500 text-white border-purple-500 shadow-md'
                    : 'text-gray-600 border-gray-300 hover:bg-gray-100'
                  }`}
              >
                {item}
              </span>
            )
          })}
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-5 py-3 mt-6 text-sm font-semibold rounded-xl shadow-md hover:shadow-lg hover:opacity-95 transition-all"
        >
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Hash className="w-5 h-5"/>}
          Generate Title
        </button>
      </form>

      {/* right col: result */}
      <div className="flex-1 bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex flex-col min-h-[24rem]">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold flex-1 flex items-center gap-2">
            <Hash className='w-5 h-5 text-[#8E37EB]'/> Generated Titles
          </h2>
          {content && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md transition"
            >
              <Copy className="w-3 h-3" />
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {!content ? (
            <div className="flex flex-1 justify-center items-center h-full">
              <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
                <Hash className='w-9 h-9'/>
                <p>Enter a topic and click "Generate Title" to get started</p>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
              <Markdown>{content}</Markdown>
            </div>
          )}
        </div>
      </div>

    </div>
  )
};

export default BlogTitles;
