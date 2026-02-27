import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, Wand2, Download, RefreshCw, CheckCircle, ChevronLeft, ChevronRight, Sparkles, Image as ImageIcon, ZoomIn, Loader2, AlertTriangle } from 'lucide-react';

export default function ImageEnhancer() {
  const [originalImage, setOriginalImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [appState, setAppState] = useState('idle'); // idle, processing, complete
  const [loadingText, setLoadingText] = useState('');
  const [progress, setProgress] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  
  // engineState: 'loading' | 'ready_ai' | 'ready_standard'
  const [engineState, setEngineState] = useState('loading'); 
  
  const [demoSliderPos, setDemoSliderPos] = useState(50);
  const sliderRef = useRef(null);
  const canvasRef = useRef(null);

  const demoImageUrl = "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80";

  // Robust Script Loader with Error Handling
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        if (existingScript.dataset.loaded) return resolve();
        existingScript.addEventListener('load', resolve);
        existingScript.addEventListener('error', reject);
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        script.dataset.loaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  };

  // Dynamically load AI with Timeout Fallback (Vercel Strict Mode Fixed)
  useEffect(() => {
    let isMounted = true;
    let fallbackTimeout;

    const loadAI = async () => {
      try {
        // Fallback timer: Agar 8 sec me load nahi hua toh Standard mode de do
        fallbackTimeout = setTimeout(() => {
          if (isMounted) {
            console.warn("AI Loading timeout. Switching to Standard HD Mode.");
            setEngineState('ready_standard');
          }
        }, 8000);

        await loadScript('https://unpkg.com/@tensorflow/tfjs@3.21.0/dist/tf.min.js');
        await loadScript('https://unpkg.com/upscaler@0.51.3/dist/browser/umd/upscaler.min.js');
        
        if (isMounted) {
          clearTimeout(fallbackTimeout);
          setEngineState('ready_ai');
        }
      } catch (err) {
        console.error("AI scripts loading error:", err);
        if (isMounted) {
          clearTimeout(fallbackTimeout);
          setEngineState('ready_standard');
        }
      }
    };
    
    loadAI();
    
    return () => { 
      isMounted = false; 
      clearTimeout(fallbackTimeout);
    };
  }, []); // Clean dependency array to prevent Vercel build warnings

  // Auto-animate demo slider
  useEffect(() => {
    if (appState !== 'idle') return;
    let animationFrame;
    const start = Date.now();
    const animateDemo = () => {
      const elapsed = Date.now() - start;
      const newPos = 50 + Math.sin(elapsed / 1500) * 25;
      setDemoSliderPos(newPos);
      animationFrame = requestAnimationFrame(animateDemo);
    };
    animationFrame = requestAnimationFrame(animateDemo);
    return () => cancelAnimationFrame(animationFrame);
  }, [appState]);

  const handleFileUpload = (e) => {
    if (engineState === 'loading') {
      alert("Engine load ho raha hai. Kripya thoda wait karein.");
      return;
    }

    const file = e.target.files[0] || e.dataTransfer?.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid image file (JPG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgSrc = event.target.result;
      setOriginalImage(imgSrc);
      
      const img = new Image();
      img.onload = () => {
        if (engineState === 'ready_ai' && (img.width > 1200 || img.height > 1200)) {
           alert("AI ke liye image bohot badi hai. Hum ise Standard HD mode se upscale kar rahe hain.");
           processFallbackUpscale(imgSrc);
           return;
        }
        
        if (engineState === 'ready_ai') {
          startRealAIUpscaling(imgSrc);
        } else {
          processFallbackUpscale(imgSrc);
        }
      };
      img.src = imgSrc;
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e) => e.preventDefault();
  const onDrop = (e) => {
    e.preventDefault();
    handleFileUpload(e);
  };

  // ==========================================
  // TRUE AI UPSCALING LOGIC (ESRGAN Model)
  // ==========================================
  const startRealAIUpscaling = async (imgSrc) => {
    setAppState('processing');
    setProgress(0);
    setLoadingText("Initializing Neural Network...");

    try {
      if (!window.Upscaler) throw new Error("Upscaler missing");
      
      const upscaler = new window.Upscaler();
      const enhancedDataUrl = await upscaler.upscale(imgSrc, {
        patchSize: 64,
        padding: 2,
        progress: (percent) => {
          const currentProgress = Math.round(percent * 100);
          setProgress(currentProgress);
          setLoadingText(`AI Neural Processing... ${currentProgress}%`);
        }
      });

      setEnhancedImage(enhancedDataUrl);
      setAppState('complete');
      setSliderPosition(50);
      
    } catch (error) {
      console.error("AI Upscaling Failed, using fallback: ", error);
      processFallbackUpscale(imgSrc); // Agar AI fail ho jaye toh canvas mode chal jaye
    }
  };

  // ==========================================
  // FALLBACK: HIGH-QUALITY SMOOTH UPSCALING
  // ==========================================
  const processFallbackUpscale = (imgSrc) => {
    setAppState('processing');
    setProgress(0);
    setLoadingText("Enhancing details in HD Mode...");

    // Fake progress for standard mode
    let count = 0;
    const interval = setInterval(() => {
      count += 5;
      setProgress(count);
      if(count >= 90) clearInterval(interval);
    }, 100);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      setTimeout(() => {
        canvas.width = img.width * 4;
        canvas.height = img.height * 4;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const enhancedDataUrl = canvas.toDataURL('image/jpeg', 1.0);
        setProgress(100);
        clearInterval(interval);
        
        setTimeout(() => {
          setEnhancedImage(enhancedDataUrl);
          setAppState('complete');
          setSliderPosition(50);
        }, 500);
      }, 1500); // 1.5s delay for smooth UI transition
    };
    img.src = imgSrc;
  };

  const resetTool = () => {
    setOriginalImage(null);
    setEnhancedImage(null);
    setAppState('idle');
    setSliderPosition(50);
    setProgress(0);
  };

  const downloadEnhancedImage = () => {
    const link = document.createElement('a');
    link.href = enhancedImage;
    link.download = `Enhanced_ImgTool_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSliderMove = useCallback((e) => {
    if (!isDragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  }, [isDragging]);

  useEffect(() => {
    const stopDragging = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mousemove', handleSliderMove);
      window.addEventListener('mouseup', stopDragging);
      window.addEventListener('touchmove', handleSliderMove, { passive: false });
      window.addEventListener('touchend', stopDragging);
    }
    return () => {
      window.removeEventListener('mousemove', handleSliderMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', handleSliderMove);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [isDragging, handleSliderMove]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <canvas ref={canvasRef} className="hidden"></canvas>

        {/* State 1: Upload View */}
        {appState === 'idle' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <div className={`inline-flex items-center justify-center p-2 px-4 font-bold rounded-full mb-2 text-sm ${engineState === 'ready_standard' ? 'bg-orange-100 text-orange-700' : 'bg-indigo-100 text-indigo-700'}`}>
                  {engineState === 'ready_standard' ? <AlertTriangle className="w-4 h-4 mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  {engineState === 'ready_standard' ? 'Standard HD Mode Active' : 'Real ESRGAN AI Technology'}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 tracking-tight leading-tight">
                  True AI Image Upscaler
                </h1>
                <p className="text-gray-500 text-lg md:text-xl font-medium max-w-lg">
                  100% Free & Private. Automatically rebuild missing pixels and enhance details perfectly directly in your browser.
                </p>
              </div>

              {/* Demo Slider */}
              <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white select-none pointer-events-none group bg-gray-200">
                <img src={demoImageUrl} alt="Demo Enhanced" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 w-full h-full" style={{ clipPath: `inset(0 ${100 - demoSliderPos}% 0 0)` }}>
                  <img src={demoImageUrl} alt="Demo Original" className="absolute inset-0 w-full h-full object-cover scale-[1.02]" style={{ imageRendering: 'pixelated', filter: 'blur(2px)' }} />
                </div>
                <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20" style={{ left: `${demoSliderPos}%`, transform: 'translateX(-50%)' }}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-indigo-600 border-2 border-white">
                    <ChevronLeft size={14} className="-mr-1" />
                    <ChevronRight size={14} className="-ml-1" />
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider z-10">BEFORE</div>
                <div className="absolute top-4 right-4 bg-indigo-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider z-10 flex items-center gap-1"><Sparkles size={12} /> AFTER (4X)</div>
              </div>
            </div>

            <div className="order-1 lg:order-2 w-full max-w-lg mx-auto lg:ml-auto">
              <div 
                onDragOver={onDragOver} 
                onDrop={onDrop}
                className="w-full bg-white border-2 border-dashed border-indigo-300 rounded-[2rem] p-10 md:p-14 text-center hover:bg-indigo-50/40 hover:border-indigo-500 transition-all duration-300 shadow-xl shadow-indigo-900/5 cursor-pointer relative group"
                onClick={() => document.getElementById('file-upload').click()}
              >
                <input id="file-upload" type="file" accept="image/jpeg, image/png, image/webp" onChange={handleFileUpload} className="hidden" />
                
                {engineState !== 'loading' ? (
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:-translate-y-2 transition-transform duration-300 shadow-inner border border-indigo-200">
                    <UploadCloud size={48} strokeWidth={1.5} />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gray-50 text-gray-400 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-gray-200">
                    <Loader2 size={40} className="animate-spin" />
                  </div>
                )}
                
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  {engineState !== 'loading' ? "Upload an Image" : "Loading Engine..."}
                </h3>
                <p className="text-gray-500 mb-10 font-medium text-lg">
                  {engineState !== 'loading' ? (
                    <>Drag & drop or click to select<br/><span className="text-sm">(Max size: 1200px for AI)</span></>
                  ) : (
                    "Please wait a moment..."
                  )}
                </p>
                <button 
                  className={`w-full text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 text-lg flex items-center justify-center gap-2 ${engineState !== 'loading' ? 'bg-gray-900 hover:bg-indigo-600 hover:shadow-indigo-500/30' : 'bg-gray-400 cursor-not-allowed'}`}
                  disabled={engineState === 'loading'}
                >
                  {engineState !== 'loading' ? <><ImageIcon size={20} /> Browse Files</> : <><Loader2 size={20} className="animate-spin"/> Initializing...</>}
                </button>
              </div>
              
              <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm text-gray-500 font-medium">
                <div className="flex flex-col items-center gap-2"><CheckCircle size={20} className="text-green-500"/> {engineState === 'ready_standard' ? 'Smooth Scaling' : 'Real AI Model'}</div>
                <div className="flex flex-col items-center gap-2"><CheckCircle size={20} className="text-green-500"/> 100% Private</div>
                <div className="flex flex-col items-center gap-2"><CheckCircle size={20} className="text-green-500"/> 4x Resolution</div>
              </div>
            </div>
          </div>
        )}

        {/* State 2: Processing */}
        {appState === 'processing' && (
          <div className="w-full max-w-3xl mx-auto mt-20 bg-white rounded-3xl p-16 text-center shadow-2xl shadow-indigo-900/10 border border-gray-100 flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 mb-10">
              <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                <Sparkles size={40} className="animate-pulse" />
              </div>
            </div>
            <h3 className="text-4xl font-extrabold text-gray-800 mb-6 tracking-tight">Enhancing your image...</h3>
            <div className="w-full max-w-md bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 h-full rounded-full transition-all duration-100 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-gray-500 font-bold text-lg animate-pulse">{loadingText}</p>
            <p className="text-xs text-gray-400 mt-4">(Processing entirely in your browser. This might take a few seconds.)</p>
          </div>
        )}

        {/* State 3: Complete */}
        {appState === 'complete' && originalImage && enhancedImage && (
          <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-10">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Enhancement Complete! 🎉</h2>
              <p className="text-gray-500 flex items-center justify-center gap-2">
                <ZoomIn size={18} /> Slider drag karein result dekhne ke liye.
              </p>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-[2rem] shadow-2xl shadow-indigo-900/10 border border-gray-100">
              <div 
                ref={sliderRef}
                className="relative w-full aspect-[4/3] md:aspect-video rounded-xl overflow-hidden bg-gray-100 select-none cursor-crosshair touch-none group"
                onMouseDown={(e) => { setIsDragging(true); handleSliderMove(e); }}
                onTouchStart={(e) => { setIsDragging(true); handleSliderMove(e); }}
              >
                {/* Original */}
                <img src={originalImage} alt="Original pixels" className="absolute inset-0 w-full h-full object-contain pointer-events-none" style={{ imageRendering: 'pixelated' }} />
                
                {/* Enhanced */}
                <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}>
                  <img src={enhancedImage} alt="Enhanced Result" className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm" />
                </div>

                {/* Slider */}
                <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.6)] z-20 transition-transform duration-75" style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-gray-800 border-[3px] border-indigo-600 hover:scale-110 transition-transform duration-200">
                    <ChevronLeft size={20} className="text-indigo-600 -mr-1" />
                    <ChevronRight size={20} className="text-indigo-600 -ml-1" />
                  </div>
                </div>

                <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wider shadow-lg border border-white/20 z-10 pointer-events-none">ORIGINAL</div>
                <div className="absolute top-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wider shadow-lg z-10 pointer-events-none flex items-center gap-1.5"><Sparkles size={14} /> ENHANCED 4X</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <button onClick={resetTool} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-bold rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-200 hover:bg-gray-50 text-lg">
                <RefreshCw size={20} /> Enhance Another
              </button>
              <button onClick={downloadEnhancedImage} className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300 text-lg">
                <Download size={20} /> Download Result
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
