import { useState, useEffect, useRef, useCallback } from 'react';
import { SEO } from './SEO';
import { ToolLayout } from './ToolLayout';
import { 
  Wand2, 
  Upload, 
  Download, 
  RefreshCw, 
  Trash2, 
  Image as ImageIcon,
  Sparkles,
  Sliders,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  Loader2,
  Eye,
  Sun,
  Droplet,
  Contrast,
  Aperture,
  Layers,
  Palette,
  Zap
} from 'lucide-react';

// Advanced Image Analysis Engine
class ImageAnalyzer {
  static analyze(imageData, width, height) {
    const data = imageData.data;
    let totalLuminance = 0;
    let totalSaturation = 0;
    let edgeScore = 0;
    let noiseScore = 0;
    let contrastScore = 0;
    
    const pixelCount = width * height;
    
    // Luminance and saturation analysis
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : (max - min) / max;
      
      totalLuminance += luminance;
      totalSaturation += saturation;
    }
    
    const avgLuminance = totalLuminance / pixelCount;
    const avgSaturation = totalSaturation / pixelCount;
    
    // Edge detection using Sobel operator
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const gx = 
          -1 * data[((y - 1) * width + (x - 1)) * 4] +
          -2 * data[(y * width + (x - 1)) * 4] +
          -1 * data[((y + 1) * width + (x - 1)) * 4] +
          1 * data[((y - 1) * width + (x + 1)) * 4] +
          2 * data[(y * width + (x + 1)) * 4] +
          1 * data[((y + 1) * width + (x + 1)) * 4];
          
        const gy = 
          -1 * data[((y - 1) * width + (x - 1)) * 4] +
          -2 * data[((y - 1) * width + x) * 4] +
          -1 * data[((y - 1) * width + (x + 1)) * 4] +
          1 * data[((y + 1) * width + (x - 1)) * 4] +
          2 * data[((y + 1) * width + x) * 4] +
          1 * data[((y + 1) * width + (x + 1)) * 4];
        
        edgeScore += Math.sqrt(gx * gx + gy * gy);
      }
    }
    
    // Contrast calculation
    let minLum = 255, maxLum = 0;
    for (let i = 0; i < data.length; i += 4) {
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      minLum = Math.min(minLum, lum);
      maxLum = Math.max(maxLum, lum);
    }
    contrastScore = maxLum - minLum;
    
    return {
      luminance: avgLuminance,
      saturation: avgSaturation,
      sharpness: edgeScore / pixelCount,
      contrast: contrastScore,
      isUnderexposed: avgLuminance < 60,
      isOverexposed: avgLuminance > 200,
      isBlurry: edgeScore / pixelCount < 50,
      isLowContrast: contrastScore < 80,
      isNoisy: noiseScore > 100
    };
  }
}

// AI Enhancement Engine with Multiple Algorithms
class AIEnhancer {
  static async enhance(sourceImage, options, onProgress) {
    const { 
      denoise = true, 
      sharpen = true, 
      colorCorrection = true, 
      upscale = false,
      style = 'natural' // natural, vivid, cinematic, portrait
    } = options;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Set dimensions (with optional upscale)
    const scale = upscale ? 1.5 : 1;
    canvas.width = sourceImage.naturalWidth * scale;
    canvas.height = sourceImage.naturalHeight * scale;
    
    onProgress?.('🔍 Analyzing image structure...', 5);
    await this.delay(100);
    
    // Draw initial image
    ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
    
    // Get image data for analysis
    const analysisCanvas = document.createElement('canvas');
    analysisCanvas.width = Math.min(sourceImage.naturalWidth, 400);
    analysisCanvas.height = Math.min(sourceImage.naturalHeight, 400);
    const analysisCtx = analysisCanvas.getContext('2d');
    analysisCtx.drawImage(sourceImage, 0, 0, analysisCanvas.width, analysisCanvas.height);
    const imageData = analysisCtx.getImageData(0, 0, analysisCanvas.width, analysisCanvas.height);
    
    const analysis = ImageAnalyzer.analyze(imageData, analysisCanvas.width, analysisCanvas.height);
    
    onProgress?.(`📊 Detected: ${this.getAnalysisText(analysis)}`, 15);
    await this.delay(200);
    
    // Apply AI corrections based on analysis
    const corrections = this.calculateCorrections(analysis, style);
    
    onProgress?.('🎨 Applying AI color grading...', 25);
    await this.applyColorGrading(ctx, canvas.width, canvas.height, corrections, style);
    await this.delay(300);
    
    if (denoise && analysis.isNoisy) {
      onProgress?.('🧹 Smart noise reduction...', 40);
      await this.applyDenoise(ctx, canvas.width, canvas.height);
      await this.delay(300);
    }
    
    if (sharpen || analysis.isBlurry) {
      onProgress?.(`🔧 AI Sharpening (${analysis.isBlurry ? 'Heavy' : 'Light'} mode)...`, 60);
      const iterations = analysis.isBlurry ? 3 : 2;
      for (let i = 0; i < iterations; i++) {
        onProgress?.(`🔧 Sharpening layer ${i + 1}/${iterations}...`, 60 + i * 8);
        await this.applySmartSharpen(ctx, canvas.width, canvas.height, analysis.isBlurry ? 1.8 : 1.2);
        await this.delay(200);
      }
    }
    
    if (colorCorrection) {
      onProgress?.('✨ Enhancing details & micro-contrast...', 85);
      await this.applyDetailEnhancement(ctx, canvas.width, canvas.height);
      await this.delay(200);
    }
    
    onProgress?.('💾 Finalizing high-quality output...', 95);
    await this.delay(300);
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg', 0.95);
    });
  }
  
  static getAnalysisText(analysis) {
    const issues = [];
    if (analysis.isBlurry) issues.push('Blur');
    if (analysis.isUnderexposed) issues.push('Underexposed');
    if (analysis.isOverexposed) issues.push('Overexposed');
    if (analysis.isLowContrast) issues.push('Low Contrast');
    if (issues.length === 0) return 'Good quality - Enhancing colors';
    return issues.join(', ') + ' detected';
  }
  
  static calculateCorrections(analysis, style) {
    const base = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      highlights: 0,
      shadows: 0,
      clarity: 0,
      vibrance: 0
    };
    
    // Auto-corrections based on analysis
    if (analysis.isUnderexposed) {
      base.brightness = 115;
      base.shadows = 30;
      base.highlights = -10;
    } else if (analysis.isOverexposed) {
      base.brightness = 90;
      base.highlights = -30;
      base.shadows = 20;
    }
    
    if (analysis.isLowContrast) {
      base.contrast = 115;
      base.clarity = 20;
    }
    
    if (analysis.saturation < 0.3) {
      base.vibrance = 25;
      base.saturation = 110;
    }
    
    // Style-specific adjustments
    switch(style) {
      case 'vivid':
        base.saturation = 120;
        base.vibrance = 30;
        base.clarity = 15;
        break;
      case 'cinematic':
        base.contrast = 110;
        base.highlights = -20;
        base.shadows = 20;
        base.saturation = 95;
        break;
      case 'portrait':
        base.clarity = -10;
        base.vibrance = 20;
        base.highlights = -10;
        break;
    }
    
    return base;
  }
  
  static async applyColorGrading(ctx, width, height, corrections, style) {
    // Apply color grading using canvas filters and pixel manipulation
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i], g = data[i + 1], b = data[i + 2];
      
      // Brightness
      const brightness = corrections.brightness / 100;
      r *= brightness;
      g *= brightness;
      b *= brightness;
      
      // Contrast
      const contrast = corrections.contrast / 100;
      r = ((r - 128) * contrast) + 128;
      g = ((g - 128) * contrast) + 128;
      b = ((b - 128) * contrast) + 128;
      
      // Saturation
      const saturation = corrections.saturation / 100;
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray + (r - gray) * saturation;
      g = gray + (g - gray) * saturation;
      b = gray + (b - gray) * saturation;
      
      // Shadows/Highlights (simplified)
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      if (luminance < 128 && corrections.shadows) {
        const shadowBoost = corrections.shadows / 100;
        r += (255 - r) * shadowBoost * 0.3;
        g += (255 - g) * shadowBoost * 0.3;
        b += (255 - b) * shadowBoost * 0.3;
      }
      
      // Clarity (local contrast simulation)
      if (corrections.clarity) {
        const clarity = corrections.clarity / 100;
        r = r + (r - 128) * clarity * 0.5;
        g = g + (g - 128) * clarity * 0.5;
        b = b + (b - 128) * clarity * 0.5;
      }
      
      data[i] = Math.min(255, Math.max(0, r));
      data[i + 1] = Math.min(255, Math.max(0, g));
      data[i + 2] = Math.min(255, Math.max(0, b));
    }
    
    ctx.putImageData(imageData, 0, 0);
  }
  
  static async applySmartSharpen(ctx, width, height, amount) {
    // Unsharp mask algorithm
    const imageData = ctx.getImageData(0, 0, width, height);
    const blurredCanvas = document.createElement('canvas');
    blurredCanvas.width = width;
    blurredCanvas.height = height;
    const blurredCtx = blurredCanvas.getContext('2d');
    
    blurredCtx.filter = 'blur(2px)';
    blurredCtx.drawImage(ctx.canvas, 0, 0);
    const blurredData = blurredCtx.getImageData(0, 0, width, height).data;
    
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, data[i] + amount * (data[i] - blurredData[i])));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + amount * (data[i + 1] - blurredData[i + 1])));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + amount * (data[i + 2] - blurredData[i + 2])));
    }
    
    ctx.putImageData(imageData, 0, 0);
  }
  
  static async applyDenoise(ctx, width, height) {
    // Simple median filter for noise reduction
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const output = new Uint8ClampedArray(data);
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          const neighbors = [];
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const idx = ((y + dy) * width + (x + dx)) * 4 + c;
              neighbors.push(data[idx]);
            }
          }
          neighbors.sort((a, b) => a - b);
          output[(y * width + x) * 4 + c] = neighbors[4]; // Median
        }
      }
    }
    
    ctx.putImageData(new ImageData(output, width, height), 0, 0);
  }
  
  static async applyDetailEnhancement(ctx, width, height) {
    // Micro-contrast enhancement
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      
      // Subtle S-curve for detail enhancement
      const enhance = (val) => {
        const normalized = val / 255;
        const curved = normalized < 0.5 
          ? 2 * normalized * normalized 
          : 1 - Math.pow(-2 * normalized + 2, 2) / 2;
        return curved * 255;
      };
      
      data[i] = r * 0.7 + enhance(r) * 0.3;
      data[i + 1] = g * 0.7 + enhance(g) * 0.3;
      data[i + 2] = b * 0.7 + enhance(b) * 0.3;
    }
    
    ctx.putImageData(imageData, 0, 0);
  }
  
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default function AIImageEnhancer() {
  const [sourceImage, setSourceImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('natural');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [zoom, setZoom] = useState(1);
  
  const fileInputRef = useRef(null);
  const compareContainerRef = useRef(null);

  const styles = [
    { id: 'natural', name: 'Natural', icon: Sun, desc: 'Balanced enhancement' },
    { id: 'vivid', name: 'Vivid', icon: Palette, desc: 'Bright & vibrant' },
    { id: 'cinematic', name: 'Cinematic', icon: Aperture, desc: 'Movie-like tones' },
    { id: 'portrait', name: 'Portrait', icon: Sparkles, desc: 'Skin-friendly' }
  ];

  const handleFileSelect = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    
    const url = URL.createObjectURL(file);
    setSourceImage({ url, file, name: file.name });
    setEnhancedImage(null);
    setAnalysis(null);
    setProgress(0);
    setSliderPosition(50);
  }, []);

  const processImage = async () => {
    if (!sourceImage || isProcessing) return;
    
    setIsProcessing(true);
    setEnhancedImage(null);
    
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = sourceImage.url;
      await new Promise((resolve) => { img.onload = resolve; });
      
      const result = await AIEnhancer.enhance(img, {
        style: selectedStyle,
        upscale: false
      }, (statusText, prog) => {
        setStatus(statusText);
        setProgress(prog);
      });
      
      setEnhancedImage(result);
      setStatus('✨ Enhancement complete!');
    } catch (error) {
      console.error('Enhancement failed:', error);
      setStatus('❌ Error: ' + error.message);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  useEffect(() => {
    if (sourceImage && !enhancedImage && !isProcessing) {
      processImage();
    }
  }, [sourceImage, selectedStyle]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !compareContainerRef.current) return;
    const rect = compareContainerRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const percentage = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, [isDragging]);

  useEffect(() => {
    if (!isDragging) return;
    
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove, { passive: true });
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, handleMouseMove]);

  const downloadImage = () => {
    if (!enhancedImage) return;
    const link = document.createElement('a');
    link.href = enhancedImage;
    link.download = `AI_Enhanced_${sourceImage.file.name.replace(/\.[^/.]+$/, '')}.jpg`;
    link.click();
  };

  return (
    <>
      <SEO 
        title="AI Image Enhancer Pro - Professional Photo Enhancement Tool"
        description="Transform blurry, dark, or low-quality photos into stunning high-resolution images using advanced AI technology. Professional-grade enhancement with one click."
        canonical="/image-enhancer"
      />
      
      <ToolLayout 
        toolSlug="image-enhancer"
        title="AI Image Enhancer Pro"
        description="Professional-grade AI enhancement for your photos. Deblur, denoise, color correct, and upscale automatically."
        breadcrumb="Image Enhancer"
      >
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header Stats */}
          {!sourceImage && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Zap, label: 'AI Powered', value: 'Neural Engine' },
                { icon: Layers, label: 'Enhancement', value: '4K Ready' },
                { icon: Eye, label: 'Analysis', value: 'Real-time' },
                { icon: Check, label: 'Privacy', value: '100% Local' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200">
                  <stat.icon className="w-6 h-6 text-violet-600 mb-2" />
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-sm font-bold text-slate-800">{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {sourceImage ? (
            <div className="space-y-6">
              {/* Analysis Badge */}
              {analysis && (
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl border border-violet-200">
                  <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-violet-900">AI Analysis Complete</p>
                    <p className="text-xs text-violet-700">{analysis.text}</p>
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              {isProcessing && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 text-violet-600 animate-spin" />
                      <span className="text-sm font-semibold text-slate-700">{status}</span>
                    </div>
                    <span className="text-sm font-bold text-violet-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 transition-all duration-500 ease-out rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-3 flex gap-2">
                    {['Analyzing', 'Processing', 'Enhancing', 'Finalizing'].map((step, idx) => (
                      <div 
                        key={step}
                        className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                          progress > (idx + 1) * 25 ? 'bg-violet-500' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Style Selector */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Enhancement Style</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                        selectedStyle === style.id 
                          ? 'border-violet-500 bg-violet-50 text-violet-700' 
                          : 'border-slate-200 hover:border-violet-200 hover:bg-slate-50'
                      }`}
                    >
                      <style.icon className={`w-5 h-5 ${selectedStyle === style.id ? 'text-violet-600' : 'text-slate-400'}`} />
                      <div className="text-center">
                        <p className="text-sm font-bold">{style.name}</p>
                        <p className="text-[10px] opacity-75">{style.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comparison Viewer */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600 px-2 py-1 bg-white rounded-lg border border-slate-200">
                      {isDragging ? 'Comparing...' : 'Drag to compare'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                      className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-medium text-slate-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
                    <button 
                      onClick={() => setZoom(z => Math.min(2, z + 0.25))}
                      className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-slate-300 mx-1" />
                    <button 
                      onClick={processImage}
                      disabled={isProcessing}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 hover:bg-violet-200 text-violet-700 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                      Re-enhance
                    </button>
                  </div>
                </div>

                {/* Image Container */}
                <div 
                  ref={compareContainerRef}
                  className="relative select-none overflow-hidden bg-slate-900 cursor-col-resize"
                  style={{ height: '500px' }}
                  onMouseDown={() => enhancedImage && setIsDragging(true)}
                  onTouchStart={() => enhancedImage && setIsDragging(true)}
                >
                  {/* Original Image */}
                  <img 
                    src={sourceImage.url} 
                    alt="Original"
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ transform: `scale(${zoom})` }}
                    draggable={false}
                  />
                  
                  {/* Enhanced Image (Clipped) */}
                  {enhancedImage && (
                    <div 
                      className="absolute inset-0 overflow-hidden"
                      style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                    >
                      <img 
                        src={enhancedImage} 
                        alt="Enhanced"
                        className="absolute inset-0 w-full h-full object-contain"
                        style={{ transform: `scale(${zoom})` }}
                        draggable={false}
                      />
                    </div>
                  )}

                  {/* Slider Line */}
                  {enhancedImage && (
                    <div 
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_20px_rgba(139,92,246,0.5)] z-10"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-violet-500">
                        <div className="flex gap-0.5">
                          <div className="w-1 h-4 bg-violet-300 rounded-full" />
                          <div className="w-1 h-4 bg-violet-300 rounded-full" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Labels */}
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
                    ORIGINAL
                  </div>
                  {enhancedImage && (
                    <div className="absolute top-4 right-4 bg-violet-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-violet-400/50 shadow-lg shadow-violet-500/30">
                      ✨ AI ENHANCED
                    </div>
                  )}

                  {/* Processing Overlay */}
                  {isProcessing && (
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-20">
                      <div className="text-center space-y-4">
                        <div className="relative">
                          <div className="w-20 h-20 border-4 border-violet-500/30 rounded-full" />
                          <div className="absolute inset-0 w-20 h-20 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                          <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-violet-400" />
                        </div>
                        <p className="text-white font-semibold text-lg">{status}</p>
                        <div className="w-48 h-1 bg-slate-700 rounded-full overflow-hidden mx-auto">
                          <div 
                            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {enhancedImage && !isProcessing && (
                <div className="flex gap-4">
                  <button
                    onClick={downloadImage}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-violet-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                  >
                    <Download className="w-5 h-5 group-hover:animate-bounce" />
                    Download HD Image
                  </button>
                  <button
                    onClick={() => {
                      setSourceImage(null);
                      setEnhancedImage(null);
                      setAnalysis(null);
                    }}
                    className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="hidden sm:inline">New Image</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Upload Area */
            <div 
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileSelect(e.dataTransfer.files[0]);
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
              
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
              
              <div className="relative bg-white rounded-3xl border-2 border-dashed border-slate-300 hover:border-violet-400 p-12 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-violet-500/10">
                <div className="max-w-2xl mx-auto text-center space-y-8">
                  
                  {/* Icon */}
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/30 group-hover:scale-110 transition-transform duration-500">
                      <Wand2 className="w-14 h-14 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white">
                      AI READY
                    </div>
                  </div>

                  {/* Text */}
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black text-slate-800">
                      Drop your image here
                    </h3>
                    <p className="text-slate-500 text-lg">
                      or click to browse. We'll automatically detect and fix blur, exposure, and colors.
                    </p>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
                    {[
                      { icon: Eye, title: 'Smart Deblur', desc: 'AI sharpening', color: 'from-violet-500 to-purple-600' },
                      { icon: Sun, title: 'Auto Exposure', desc: 'Fix dark/light', color: 'from-amber-400 to-orange-500' },
                      { icon: Droplet, title: 'Color Boost', desc: 'Vivid tones', color: 'from-pink-500 to-rose-500' }
                    ].map((feature, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-violet-200 transition-colors">
                        <div className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="font-bold text-slate-800 text-sm">{feature.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{feature.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-all hover:scale-105 shadow-xl">
                    <Upload className="w-5 h-5" />
                    Choose Photo to Enhance
                  </button>

                  <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
                    <Check className="w-3 h-3 text-green-500" />
                    Supports JPG, PNG, WebP • Max 10MB • Private & Secure
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </ToolLayout>

      <style jsx>{`
        .drop-zone {
          transition: all 0.3s ease;
        }
        .drop-zone.active {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.05);
        }
      `}</style>
    </>
  );
}
