import React, { useState, useRef, useCallback, useEffect } from "react";
// Transformers.js import
import { pipeline, env } from '@xenova/transformers';

// कॉन्फ़िगरेशन: लोकल मॉडल्स डिसेबल करें ताकि मॉडल सीधे Hugging Face से लोड हो
env.allowLocalModels = false;

import { SEO } from "./SEO";
import { ToolLayout } from "./ToolLayout";

export default function ImageEnhancer() {
  const [originalImage, setOriginalImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [sliderPos, setSliderPos] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  
  // AI Model Reference
  const upscalerRef = useRef(null);
  
  const containerRef = useRef();
  const fileInputRef = useRef();

  // Handle Image Upload
  const handleImageUpload = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setOriginalImage({ url: URL.createObjectURL(file), file });
    setEnhancedImage(null);
    setSliderPos(50);
  }, []);

  // 100% Free Client-Side AI Processing
  const processImage = async () => {
    if (!originalImage) return;
    
    setIsProcessing(true);
    setProgress(10);
    setStatusText("Initializing AI Engine...");

    try {
      // मॉडल को पहली बार लोड करना (यूज़र के ब्राउज़र में कैश हो जाएगा)
      if (!upscalerRef.current) {
        setStatusText("Downloading AI Model (First time only, please wait)...");
        // Swin2SR एक बेहतरीन ओपन-सोर्स इमेज अपस्केलिंग मॉडल है
        upscalerRef.current = await pipeline('image-to-image', 'Xenova/swin2SR-classical-sr-x2-64', {
            progress_callback: (info) => {
                if(info.status === 'progress') {
                    setProgress(Math.round(info.progress));
                }
            }
        });
      }

      setProgress(50);
      setStatusText("AI is generating missing details...");

      // असली AI प्रोसेसिंग शुरू
      const imageToUpscale = originalImage.url;
      const result = await upscalerRef.current(imageToUpscale);

      // मॉडल से मिली नई इमेज को सेट करना
      // result.src आमतौर पर base64 या Blob URL होता है
      const finalImageUrl = typeof result === 'string' ? result : result[0]?.src || result.src;
      
      setEnhancedImage(finalImageUrl);
      setProgress(100);
      setStatusText("Complete!");

    } catch (error) {
      console.error("AI processing failed:", error);
      setStatusText("❌ Error: " + (error.message || "Failed to process image."));
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  // ऑटो-रन जब इमेज अपलोड हो
  useEffect(() => {
    if (originalImage && !enhancedImage && !isProcessing) {
      // यूज़र का UI ब्लॉक न हो इसलिए इसे setTimeout में डालते हैं
      setTimeout(() => {
          processImage();
      }, 100);
    }
  }, [originalImage]);

  // Slider Logic (Before/After)
  const handleMove = useCallback((e) => {
    if (!isDraggingSlider || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setSliderPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }, [isDraggingSlider]);

  useEffect(() => {
    if (!isDraggingSlider) return;
    const stopDrag = () => setIsDraggingSlider(false);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove, { passive: true });
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchend", stopDrag);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchend", stopDrag);
    };
  }, [isDraggingSlider, handleMove]);

  return (
    <>
      <SEO title="Free Client-Side AI Image Enhancer" description="True AI Upscaling & Deblurring running directly in your browser." />
      <ToolLayout title="Free AI Enhancer" description="100% Private, Free, and Unlimited AI Enhancement">
        
        {originalImage ? (
          <div className="space-y-4">
            {/* Status and Progress UI */}
            {isProcessing && (
              <div className="bg-white rounded-2xl border border-violet-100 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">{statusText}</span>
                  <span className="text-sm font-bold text-violet-600 tabular-nums">{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {/* Editor Area */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-700">
                  {enhancedImage ? "← Drag slider · Before / After →" : isProcessing ? "⏳ Enhancing with AI..." : "Ready"}
                </span>
                <div className="flex gap-3">
                  <button onClick={() => fileInputRef.current?.click()} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Change</button>
                  <button onClick={() => setOriginalImage(null)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                </div>
              </div>

              {/* Before/After Image Container */}
              <div 
                ref={containerRef} 
                className="relative select-none overflow-hidden bg-slate-100 min-h-[380px]"
                onMouseDown={() => enhancedImage && setIsDraggingSlider(true)}
                onTouchStart={() => enhancedImage && setIsDraggingSlider(true)}
              >
                <img src={originalImage.url} alt="Original" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
                
                {enhancedImage && (
                  <>
                    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                      <img src={enhancedImage} alt="Enhanced" className="absolute inset-0 w-full h-full object-contain" />
                    </div>
                    {/* Slider Line */}
                    <div className="absolute top-0 bottom-0 z-20 pointer-events-none" style={{ left: `${sliderPos}%` }}>
                      <div className="absolute inset-y-0 -translate-x-px w-0.5 bg-white shadow-[0_0_12px_rgba(139,92,246,0.8)]" />
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-violet-100">
                        ↔️
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Download Button */}
            {enhancedImage && !isProcessing && (
              <a href={enhancedImage} download="ai_enhanced.png" className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg">
                Download AI Enhanced Result
              </a>
            )}
          </div>
        ) : (
          /* Dropzone UI */
          <div onClick={() => fileInputRef.current?.click()} className="drop-zone cursor-pointer p-16 border-2 border-dashed border-violet-300 rounded-3xl text-center bg-violet-50 hover:bg-violet-100 transition-colors">
             <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files[0])} />
             <p className="text-xl font-bold text-slate-800">Upload Photo</p>
             <p className="text-sm text-slate-500 mt-2">100% Free Browser-Based AI Enhancement</p>
          </div>
        )}
      </ToolLayout>
    </>
  );
}
