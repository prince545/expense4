import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { toast } from 'react-hot-toast';
import { LuUpload, LuX, LuCheck, LuImage } from 'react-icons/lu';

const UploadImage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      // Check file size (max 5MB)
      if (selected.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      // Check file type
      if (!selected.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setUploaded(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select an image first.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Profile image uploaded successfully!');
      setUploaded(true);
      
      // Update user data in localStorage if response contains user info
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      // Navigate back to dashboard after successful upload
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setUploaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const event = { target: { files: [droppedFile] } };
      handleFileChange(event);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <LuImage size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Upload Profile Image</h1>
              <p className="text-primary-100 text-sm">Update your profile picture</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              file 
                ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-600' 
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {!preview ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                  <LuUpload size={24} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Drag and drop your image here, or{' '}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-24 h-24 object-cover rounded-xl shadow-lg"
                  />
                  {uploaded && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <LuCheck size={16} className="text-white" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {file?.name}
                </p>
              </div>
            )}
          </div>

          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Actions */}
          <div className="flex gap-3">
            {file && (
              <button
                onClick={handleRemoveFile}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
              >
                <LuX size={18} />
                Remove
              </button>
            )}
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                !file || uploading
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <LuUpload size={18} />
                  {uploaded ? 'Uploaded!' : 'Upload Image'}
                </>
              )}
            </button>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
