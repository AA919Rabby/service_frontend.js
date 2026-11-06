// import React, { useState, useRef, useEffect } from "react";
// import {
//     Sparkles, X, Send, Image as ImageIcon,
//     Loader2, Bot, User, AlertCircle
// } from "lucide-react";
// import { chatWithAiApi } from "../../../api/servicesApi";

// export default function AiAssistantModal({ isOpen, onClose }) {
//     const [messages, setMessages] = useState([
//         {
//             role: "assistant",
//             content: "Hello! I am your TN Services Assistant. Ask me about available repairs, prices, or attach a photo of your issue to diagnose.",
//         },
//     ]);
//     const [inputPrompt, setInputPrompt] = useState("");
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");

//     const fileInputRef = useRef(null);
//     const messagesEndRef = useRef(null);

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     useEffect(() => {
//         if (isOpen) {
//             scrollToBottom();
//         }
//     }, [messages, isOpen]);

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setSelectedImage(file);
//             setImagePreview(URL.createObjectURL(file));
//             setErrorMessage("");
//         }
//     };

//     const handleRemoveImage = () => {
//         setSelectedImage(null);
//         setImagePreview(null);
//         if (fileInputRef.current) fileInputRef.current.value = "";
//     };

//     const handleSendMessage = async (e) => {
//         e.preventDefault();
//         const trimmedPrompt = inputPrompt.trim();

//         if (!trimmedPrompt && !selectedImage) {
//             setErrorMessage("Please type a message or select a photo.");
//             return;
//         }

//         setErrorMessage("");

//         // Keep photo preview intact for the chat history bubble
//         const currentPhotoPreview = imagePreview;
//         const imageToSend = selectedImage;

//         const userMsg = {
//             role: "user",
//             content: trimmedPrompt,
//             imagePreview: currentPhotoPreview,
//         };

//         // Append user message immediately
//         setMessages((prev) => [...prev, userMsg]);
//         setInputPrompt("");
//         handleRemoveImage();
//         setIsLoading(true);

//         try {
//             // 🌟 100% Dynamic API Call to your backend (POST /api/v1/ai/chat)
//             const res = await chatWithAiApi({
//                 prompt: trimmedPrompt,
//                 imageFile: imageToSend,
//             });

//             const reply = res?.data?.data?.reply || res?.data?.reply || "No response received from server.";

//             setMessages((prev) => [
//                 ...prev,
//                 { role: "assistant", content: reply },
//             ]);
//         } catch (err) {
//             const backendError = err?.response?.data?.message || err?.message || "AI Assistant is currently unavailable.";
//             setErrorMessage(backendError);
//             setMessages((prev) => [
//                 ...prev,
//                 { role: "assistant", content: `Error: ${backendError}` },
//             ]);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-50 flex justify-end">
//             {/* Backdrop */}
//             <div
//                 onClick={onClose}
//                 className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
//             />

//             {/* 🌟 Dedicated Right-Side Drawer Container (Dark Theme) */}
//             <aside className="relative z-50 h-full w-full sm:w-[440px] bg-[#0b0f19] border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 text-slate-100">

//                 {/* Header (Preserving your exact stacked layout) */}
//                 <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0b0f19] text-white flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                         <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
//                             <Sparkles size={20} />
//                         </div>
//                         {/* Changed layout here to stack items vertically */}
//                         <div className="flex flex-col gap-1">
//                             <h3 className="text-sm font-black tracking-tight text-white">TN AI Assistant</h3>
//                             {/* Added w-max so the background badge doesn't stretch to full width */}
//                             <span className="w-max px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
//                                 Online
//                             </span>
//                         </div>
//                     </div>
//                     <button
//                         onClick={onClose}
//                         className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer border border-slate-800"
//                     >
//                         <X size={18} />
//                     </button>
//                 </div>

//                 {/* Error Banner */}
//                 {errorMessage && (
//                     <div className="bg-rose-500/10 border-b border-rose-500/30 px-4 py-2.5 flex items-center gap-2 text-rose-400 text-xs font-semibold">
//                         <AlertCircle size={15} className="shrink-0" />
//                         <span className="flex-1">{errorMessage}</span>
//                         <button onClick={() => setErrorMessage("")} className="cursor-pointer">
//                             <X size={13} />
//                         </button>
//                     </div>
//                 )}

//                 {/* Messages Chat Area (Dark Canvas Background) */}
//                 <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#030712]">
//                     {messages.map((msg, index) => {
//                         const isAssistant = msg.role === "assistant";
//                         return (
//                             <div
//                                 key={index}
//                                 className={`flex items-start gap-2.5 ${isAssistant ? "justify-start" : "justify-end"}`}
//                             >
//                                 {isAssistant && (
//                                     <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm text-xs font-bold">
//                                         <Bot size={16} />
//                                     </div>
//                                 )}

//                                 <div className="max-w-[85%] space-y-2">
//                                     {/* Uploaded Image Thumbnail in Chat */}
//                                     {msg.imagePreview && (
//                                         <div className="rounded-2xl overflow-hidden border border-slate-800 max-h-48 bg-slate-900 shadow-xs">
//                                             <img
//                                                 src={msg.imagePreview}
//                                                 alt="Uploaded issue"
//                                                 className="w-full h-full object-cover"
//                                             />
//                                         </div>
//                                     )}

//                                     <div
//                                         className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${isAssistant
//                                                 ? "bg-[#0b0f19] border border-slate-800 text-slate-200 shadow-xs"
//                                                 : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium shadow-sm"
//                                             }`}
//                                     >
//                                         <p className="whitespace-pre-wrap">{msg.content}</p>
//                                     </div>
//                                 </div>

//                                 {!isAssistant && (
//                                     <div className="h-8 w-8 rounded-xl bg-slate-800 border border-slate-700 text-white flex items-center justify-center shrink-0 shadow-sm text-xs font-bold">
//                                         <User size={16} />
//                                     </div>
//                                 )}
//                             </div>
//                         );
//                     })}

//                     {isLoading && (
//                         <div className="flex items-start gap-2.5">
//                             <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
//                                 <Bot size={16} />
//                             </div>
//                             <div className="p-3.5 rounded-2xl bg-[#0b0f19] border border-slate-800 text-xs text-slate-400 font-bold flex items-center gap-2 shadow-xs">
//                                 <Loader2 size={15} className="animate-spin text-indigo-400" />
//                                 <span>Scanning catalog &amp; generating advice...</span>
//                             </div>
//                         </div>
//                     )}
//                     <div ref={messagesEndRef} />
//                 </div>

//                 {/* Attached Photo Preview Bar before Sending */}
//                 {imagePreview && (
//                     <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                             <img
//                                 src={imagePreview}
//                                 alt="preview"
//                                 className="h-10 w-10 rounded-lg object-cover border border-slate-700"
//                             />
//                             <span className="text-[11px] font-bold text-indigo-300">Photo attached for AI vision analysis</span>
//                         </div>
//                         <button
//                             type="button"
//                             onClick={handleRemoveImage}
//                             className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
//                         >
//                             <X size={14} />
//                         </button>
//                     </div>
//                 )}

//                 {/* Input Bar */}
//                 <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-[#0b0f19] border-t border-slate-800 flex items-center gap-2">
//                     <input
//                         type="file"
//                         accept="image/*"
//                         ref={fileInputRef}
//                         onChange={handleImageChange}
//                         className="hidden"
//                     />

//                     <button
//                         type="button"
//                         onClick={() => fileInputRef.current?.click()}
//                         className="p-2.5 rounded-xl border border-slate-800 hover:border-indigo-500/50 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
//                         title="Attach problem photo (leak, wiring, damage)"
//                     >
//                         <ImageIcon size={18} />
//                     </button>

//                     <input
//                         type="text"
//                         value={inputPrompt}
//                         onChange={(e) => setInputPrompt(e.target.value)}
//                         placeholder="Ask about a service, pricing, or repair..."
//                         className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm font-semibold outline-hidden focus:border-indigo-400 text-white placeholder:text-slate-500 shadow-inner"
//                     />

//                     <button
//                         type="submit"
//                         disabled={isLoading}
//                         className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white transition disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.35)]"
//                     >
//                         {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
//                     </button>
//                 </form>
//             </aside>
//         </div>
//     );
// }




import React, { useState, useRef, useEffect } from "react";
import {
    Sparkles, X, Send, Image as ImageIcon,
    Loader2, Bot, User, AlertCircle
} from "lucide-react";
import { chatWithAiApi } from "../../../api/servicesApi";

export default function AiAssistantModal({ isOpen, onClose }) {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hello! I am your TN Services Assistant. Ask me about available repairs, prices, or attach a photo of your issue to diagnose.",
        },
    ]);
    const [inputPrompt, setInputPrompt] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
            setErrorMessage("");
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const trimmedPrompt = inputPrompt.trim();

        if (!trimmedPrompt && !selectedImage) {
            setErrorMessage("Please type a message or select a photo.");
            return;
        }

        setErrorMessage("");

        const currentPhotoPreview = imagePreview;
        const imageToSend = selectedImage;

        const userMsg = {
            role: "user",
            content: trimmedPrompt,
            imagePreview: currentPhotoPreview,
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputPrompt("");
        handleRemoveImage();
        setIsLoading(true);

        try {
            const res = await chatWithAiApi({
                prompt: trimmedPrompt,
                imageFile: imageToSend,
            });

            const reply = res?.data?.data?.reply || res?.data?.reply || "No response received from server.";

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: reply },
            ]);
        } catch (err) {
            const backendError = err?.response?.data?.message || err?.message || "AI Assistant is currently unavailable.";
            setErrorMessage(backendError);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: `Error: ${backendError}` },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                onClick={onClose}
                className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
            />

            <aside className="relative z-50 h-full w-full sm:w-[440px] bg-white border-l border-blue-100 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 text-slate-900">

                <div className="relative p-4 sm:p-5 border-b border-blue-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 flex items-center justify-between overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <Sparkles size={20} />
                        </div>

                        <div className="flex flex-col gap-1">
                            <h3 className="text-sm font-black tracking-tight text-slate-900">
                                TN AI Assistant
                            </h3>
                            <span className="w-max px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                                Online
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="relative z-10 p-2 rounded-xl bg-white hover:bg-blue-50 text-slate-500 hover:text-indigo-600 transition cursor-pointer border border-blue-100 shadow-sm"
                    >
                        <X size={18} />
                    </button>
                </div>

                {errorMessage && (
                    <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 flex items-center gap-2 text-rose-600 text-xs font-semibold">
                        <AlertCircle size={15} className="shrink-0" />
                        <span className="flex-1">{errorMessage}</span>
                        <button onClick={() => setErrorMessage("")} className="cursor-pointer">
                            <X size={13} />
                        </button>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/40">
                    {messages.map((msg, index) => {
                        const isAssistant = msg.role === "assistant";
                        return (
                            <div
                                key={index}
                                className={`flex items-start gap-2.5 ${isAssistant ? "justify-start" : "justify-end"}`}
                            >
                                {isAssistant && (
                                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-200 text-xs font-bold">
                                        <Bot size={16} />
                                    </div>
                                )}

                                <div className="max-w-[85%] space-y-2">
                                    {msg.imagePreview && (
                                        <div className="rounded-2xl overflow-hidden border border-blue-100 max-h-48 bg-white shadow-sm">
                                            <img
                                                src={msg.imagePreview}
                                                alt="Uploaded issue"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <div
                                        className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${isAssistant
                                                ? "bg-white border border-blue-100 text-slate-700 shadow-sm"
                                                : "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-medium shadow-md shadow-indigo-200"
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </div>

                                {!isAssistant && (
                                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 border border-slate-500 text-white flex items-center justify-center shrink-0 shadow-sm text-xs font-bold">
                                        <User size={16} />
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {isLoading && (
                        <div className="flex items-start gap-2.5">
                            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center shrink-0">
                                <Bot size={16} />
                            </div>
                            <div className="p-3.5 rounded-2xl bg-white border border-blue-100 text-xs text-slate-500 font-bold flex items-center gap-2 shadow-sm">
                                <Loader2 size={15} className="animate-spin text-indigo-600" />
                                <span>Scanning catalog &amp; generating advice...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {imagePreview && (
                    <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img
                                src={imagePreview}
                                alt="preview"
                                className="h-10 w-10 rounded-lg object-cover border border-blue-200"
                            />
                            <span className="text-[11px] font-bold text-indigo-700">
                                Photo attached for AI vision analysis
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="p-1.5 rounded-lg hover:bg-blue-100 text-slate-500 hover:text-rose-600 cursor-pointer"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}

                <form onSubmit={handleSendMessage} className="relative p-3 sm:p-4 bg-white border-t border-blue-100 flex items-center gap-2">
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                    />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2.5 rounded-xl border border-blue-100 hover:border-indigo-300 bg-blue-50 hover:bg-indigo-50 text-indigo-600 transition cursor-pointer"
                        title="Attach problem photo (leak, wiring, damage)"
                    >
                        <ImageIcon size={18} />
                    </button>

                    <input
                        type="text"
                        value={inputPrompt}
                        onChange={(e) => setInputPrompt(e.target.value)}
                        placeholder="Ask about a service, pricing, or repair..."
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 text-slate-900 placeholder:text-slate-400 shadow-inner"
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white transition disabled:opacity-50 cursor-pointer shadow-lg shadow-indigo-200"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                </form>
            </aside>
        </div>
    );
}
