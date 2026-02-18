import { useState, useRef, useEffect } from 'react';

interface ImageProcessorProps {
  imageUrl: string;
  toolType: string;
  onProcess: (processedUrl: string) => void;
}

const ImageProcessor = ({ imageUrl, toolType: _toolType, onProcess }: ImageProcessorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState({
    quality: 80,
    width: 0,
    height: 0,
    format: 'jpeg',
    rotate: 0,
  });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setSettings(prev => ({
        ...prev,
        width: img.width,
        height: img.height,
      }));
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const processImage = async () => {
    setIsProcessing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = settings.width;
      canvas.height = settings.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply rotation
      if (settings.rotate !== 0) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((settings.rotate * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
      } else {
        ctx.drawImage(img, 0, 0, settings.width, settings.height);
      }

      // Export processed image
      const processedUrl = canvas.toDataURL(`image/${settings.format}`, settings.quality / 100);
      onProcess(processedUrl);
      setIsProcessing(false);
    };
    img.src = imageUrl;
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
        <canvas
          ref={canvasRef}
          className="hidden"
        />
        <img
          src={imageUrl}
          alt="Preview"
          className="max-h-64 mx-auto"
          style={{
            transform: `rotate(${settings.rotate}deg)`,
          }}
        />
      </div>

      {/* Controls */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Settings</h4>
        
        {/* Quality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quality: {settings.quality}%
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={settings.quality}
            onChange={(e) => setSettings({ ...settings, quality: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Width (px)
            </label>
            <input
              type="number"
              value={settings.width}
              onChange={(e) => setSettings({ ...settings, width: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Height (px)
            </label>
            <input
              type="number"
              value={settings.height}
              onChange={(e) => setSettings({ ...settings, height: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Output Format
          </label>
          <select
            value={settings.format}
            onChange={(e) => setSettings({ ...settings, format: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
        </div>

        {/* Rotation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rotation
          </label>
          <div className="flex space-x-2">
            {[0, 90, 180, 270].map((deg) => (
              <button
                key={deg}
                onClick={() => setSettings({ ...settings, rotate: deg })}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  settings.rotate === deg
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {deg}°
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={processImage}
          disabled={isProcessing}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Apply Changes'}
        </button>
      </div>
    </div>
  );
};

export default ImageProcessor;
