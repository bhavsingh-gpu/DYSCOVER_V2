import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { processUpload, getCurrentUser, saveUserProgress } from '../services/api';

const Upload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadType, setUploadType] = useState('handwriting'); // 'handwriting' or 'document'
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setResults(null);

    // Show preview if image
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    setLoading(true);

    try {
      let content;
      let contentType = uploadType;

      if (file.type.startsWith('image/')) {
        // Convert image to base64 for Gemini
        content = await convertToBase64(file);
      } else {
        // For now, handle as text
        content = await file.text();
      }

      setResults(response);
      // Log progress
      saveUserProgress({
        date: new Date(),
        level: 3,
        practiceType: 'upload',
        notes: `Processed ${contentType}: ${file.name}`
      }).catch(err => console.error('Failed to log progress:', err));
    } catch (err) {
      setError(err.message || 'Failed to process file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const triggerFileInput = (type) => {
    setUploadType(type);
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfaf3] text-ink dark:bg-[#050816] dark:text-cream">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-12 sm:px-8">
        <div className="space-y-8 animate-fadeIn">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-ink dark:text-white">
              Upload your notes
            </h1>
            <p className="text-softSlate dark:text-cream/60 max-w-lg mx-auto">
              Snap a photo of your handwriting or upload a PDF. Gemini will clean it up and make it easier to read.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Action Cards */}
            <div
              onClick={() => triggerFileInput('handwriting')}
              className="group cursor-pointer rounded-3xl border-2 border-dashed border-dysGray/20 bg-white p-8 text-center transition hover:border-orange-500/50 hover:bg-orange-500/5 dark:bg-white/5"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-3xl">📸</div>
              <h3 className="text-lg font-bold">Handwriting Photo</h3>
              <p className="mt-2 text-sm text-dysGray">Take a clear photo of your handwritten page</p>
            </div>

            <div
              onClick={() => triggerFileInput('document')}
              className="group cursor-pointer rounded-3xl border-2 border-dashed border-dysGray/20 bg-white p-8 text-center transition hover:border-blue-500/50 hover:bg-blue-500/5 dark:bg-white/5"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl">📄</div>
              <h3 className="text-lg font-bold">PDF or Notes</h3>
              <p className="mt-2 text-sm text-dysGray">Upload a digital document or complex text file</p>
            </div>
          </div>

          {/* Hidden Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.txt"
          />

          {/* Loading State */}
          {loading && (
            <div className="text-center space-y-4 p-12 bg-white/50 rounded-3xl dark:bg-white/5 backdrop-blur-sm animate-pulse">
              <div className="flex justify-center flex-col items-center gap-4">
                <div className="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-orange-600">Gemini is analyzing your content...</p>
                <p className="text-xs text-dysGray max-w-xs">Extracting text, checking legibility, and preparing a calm version for you.</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-3xl text-center">
              <p className="font-bold">Something went wrong</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Results Display */}
          {results && !loading && (
            <div className="space-y-6 animate-fadeIn">
              <div className="rounded-3xl border border-dysGray/10 bg-white p-8 dark:bg-white/5 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Analysis Ready</h2>
                  <button
                    onClick={() => navigate('/reader', { state: { content: results.analysis } })}
                    className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:shadow-orange-500/35"
                  >
                    Start Reading 📖
                  </button>
                </div>

                {preview && (
                  <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-dysGray/10">
                    <img src={preview} alt="Upload preview" className="h-full w-full object-cover opacity-50 blur-sm" />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-dysGray bg-white/20">Preview of your upload</div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-dysGray">Extracted & Analyzed Content</h3>
                  <div className="rounded-2xl bg-black/5 p-6 text-lg leading-relaxed dark:bg-white/5 whitespace-pre-wrap">
                    {results.analysis}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Upload;
