import { Edit, Sparkles, Copy } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const articleLengths = [
    { length: 500, text: "Short (500-800 words)" },
    { length: 800, text: "Medium (800-1200 words)" },
    { length: 1200, text: "Long (1200+ words)" },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLengths[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();

      const { data } = await axios.post(
        "/api/ai/generate-article",
        { prompt: input, length: selectedLength.length },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setContent(data.content);
        setCopied(false); // reset copy state
      } else toast.error(data.message || "Something went wrong");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || "Server error");
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
    <div className="h-full p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 text-slate-700 bg-slate-50 min-h-screen">
      {/* left col */}
      <form onSubmit={onSubmitHandler} className="flex-1 bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-md p-4 md:p-6 border border-gray-200 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-1.5 bg-blue-50 rounded-lg">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="text-lg md:text-xl font-semibold text-slate-800">Article Configuration</h1>
        </div>

        <div className="mb-5">
          <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-2">
            Article Topic
          </label>
          <input
            id="topic"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            className="w-full p-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            placeholder="The future of Artificial Intelligence is..."
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Article Length
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            {articleLengths.map((item, index) => (
              <button
                type="button"
                key={index}
                onClick={() => setSelectedLength(item)}
                className={`text-sm px-4 py-2 rounded-lg cursor-pointer border transition-all duration-200 ${
                  selectedLength.text === item.text
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "text-slate-600 border-gray-300 hover:bg-slate-50"
                }`}
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-auto w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-3 text-sm font-medium rounded-lg shadow-sm hover:shadow-md hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
              Generating...
            </>
          ) : (
            <>
              <Edit className="w-4 h-4" />
              Generate Article
            </>
          )}
        </button>
      </form>

      {/* right col */}
      <div className="flex-1 bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-md p-4 md:p-6 border border-gray-200 flex flex-col min-h-[500px] md:min-h-[600px]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-1.5 bg-blue-50 rounded-lg">
            <Edit className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="text-lg md:text-xl font-semibold text-slate-800 flex-1">Generated Article</h1>
          {content && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-md transition-colors text-slate-700"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>

        {!content ? (
          <div className="flex flex-1 justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-4 text-slate-400">
              <div className="p-3 bg-slate-100 rounded-full">
                <Edit className="w-6 h-6" />
              </div>
              <p className="text-center max-w-[200px]">Enter a topic and click "Generate Article" to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-2 flex-1 overflow-y-auto">
            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
              {content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteArticle;