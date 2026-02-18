import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, FileImage } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (imageUrl: string) => void;
}

const ImageUploader = ({ onUpload }: ImageUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.bmp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : isDragReject
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
        }
      `}
    >
      <input {...getInputProps()} />
      
      <div className="mb-6">
        <div className={`
          w-20 h-20 mx-auto rounded-2xl flex items-center justify-center transition-colors
          ${isDragActive 
            ? 'bg-blue-100 dark:bg-blue-800' 
            : 'bg-gray-100 dark:bg-gray-700'
          }
        `}>
          {isDragActive ? (
            <ImageIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          ) : (
            <Upload className="w-10 h-10 text-gray-400" />
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {isDragActive ? 'Drop your image here' : 'Upload your image'}
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        Drag and drop an image, or click to browse
      </p>
      
      <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
        <div className="flex items-center space-x-1">
          <FileImage className="w-4 h-4" />
          <span>JPG, PNG, GIF, WebP</span>
        </div>
        <span>|</span>
        <span>Max 10MB</span>
      </div>

      <button
        type="button"
        className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors"
      >
        Choose File
      </button>
    </div>
  );
};

export default ImageUploader;
