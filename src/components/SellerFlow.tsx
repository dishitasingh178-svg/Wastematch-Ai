import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, CheckCircle2, Sparkles, ArrowRight, ArrowLeft, Image as ImageIcon, AlertCircle, Cpu } from 'lucide-react';
import { SellerListingPayload, ContaminationLevel, AvailabilityStatus } from '../types';
import { DEFAULT_SELLER_LISTING } from '../data/mockData';
import { analyzeWaste, AIAnalyzeResponse } from '../ai/analyzeWaste';

interface SellerFlowProps {
  onStartMatching: (listingData: SellerListingPayload) => void;
  onCancel: () => void;
}

export const SellerFlow: React.FC<SellerFlowProps> = ({
  onStartMatching,
  onCancel
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isAiLoadingMatch, setIsAiLoadingMatch] = useState(false);

  // Form State
  const [uploadedImage, setUploadedImage] = useState<string>(
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalyzeResponse | null>(null);

  const [formData, setFormData] = useState<SellerListingPayload>({
    ...DEFAULT_SELLER_LISTING,
    materialName: '',
    materialCategory: '',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
  });

  // Step 2 AI Analysis & Scanning sequence
  useEffect(() => {
    let isCancelled = false;

    if (step === 2) {
      setIsScanning(true);
      setScanProgress(15);

      const progressInterval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 85) return prev;
          return prev + 20;
        });
      }, 300);

      const runAI = async () => {
        try {
          const result = await analyzeWaste({
            image: uploadedImage || '',
            userProvided: formData.materialName ? {
              wasteName: formData.materialName,
              quantity: formData.quantityTonnes,
              location: formData.location
            } : {
              quantity: formData.quantityTonnes,
              location: formData.location
            }
          });

          if (!isCancelled) {
            setAiAnalysis(result);
            setScanProgress(100);
            setIsScanning(false);
            clearInterval(progressInterval);

            // Auto-populate listing payload with AI deductions
            const mappedContamination: ContaminationLevel = 
              result.contaminationLevel === 'none' ? 'None' :
              result.contaminationLevel === 'medium' ? 'Medium' :
              result.contaminationLevel === 'high' ? 'High' : 'Low';

            setFormData((prev) => ({
              ...prev,
              materialName: result.material || prev.materialName || 'Identified Material',
              materialCategory: result.category || result.materialType || prev.materialCategory || 'Industrial Stream',
              composition: result.composition || prev.composition,
              contamination: mappedContamination,
              potentialUses: result.potentialReuses && result.potentialReuses.length > 0 ? result.potentialReuses : prev.potentialUses,
              aiIdentifiedConfidence: result.confidence || prev.aiIdentifiedConfidence,
              additionalNotes: result.summary || result.compliance?.notes || prev.additionalNotes
            }));
          }
        } catch {
          if (!isCancelled) {
            setIsScanning(false);
            setScanProgress(100);
          }
        }
      };

      runAI();

      return () => {
        isCancelled = true;
        clearInterval(progressInterval);
      };
    }
  }, [step, uploadedImage]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setUploadedImage(dataUrl);
        setAiAnalysis(null);

        setFormData((prev) => ({
          ...prev,
          materialName: '',
          materialCategory: '',
          imageUrl: dataUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (presetUrl: string, name: string) => {
    setUploadedImage(presetUrl);
    setAiAnalysis(null);
    setFormData((prev) => ({
      ...prev,
      materialName: name,
      imageUrl: presetUrl
    }));
  };

  const handleProceedToStep2 = () => {
    if (!uploadedImage) {
      setUploadedImage('https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80');
    }
    setStep(2);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAiLoadingMatch(true);
    
    // Simulate AI ranking matching pipeline
    setTimeout(() => {
      setIsAiLoadingMatch(false);
      onStartMatching({
        ...formData,
        imageUrl: uploadedImage
      });
    }, 1800);
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#F2FAF5] via-[#F8FCF9] to-[#EDF7F1] py-10 px-4 sm:px-6 lg:px-8" id="seller-flow-root">
      <div className="max-w-3xl mx-auto">
        
        {/* Top Header & Progress */}
        <div className="mb-8">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#146B4A] hover:text-[#0B3D2E] transition-colors mb-4 cursor-pointer bg-[#E1F4E8] px-3 py-1.5 rounded-lg border border-[#A8DEBF]"
            id="seller-back-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel and return to home</span>
          </button>

          {/* Progress Indicator */}
          <div className="bg-[#EBF7F0] rounded-2xl p-4 border border-[#C2E7D1] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-heading font-bold text-xs ${
                step === 1 ? 'bg-[#0B3D2E] text-white shadow-xs' : 'bg-[#D4EFE0] text-[#0B3D2E]'
              }`}>
                01
              </div>
              <div className="hidden sm:block">
                <span className="text-xs font-heading font-extrabold text-[#0B3D2E] block">Upload Photo</span>
                <span className="text-[10px] text-[#3B5446] font-medium">Visual waste sample</span>
              </div>
            </div>

            <div className={`h-1 flex-1 mx-4 rounded-full ${step >= 2 ? 'bg-[#238B5A]' : 'bg-[#D4EFE0]'}`} />

            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-heading font-bold text-xs ${
                step === 2 ? 'bg-[#0B3D2E] text-white shadow-xs' : step > 2 ? 'bg-[#D4EFE0] text-[#0B3D2E]' : 'bg-white/60 text-[#60756A] border border-[#C2E7D1]'
              }`}>
                02
              </div>
              <div className="hidden sm:block">
                <span className="text-xs font-heading font-extrabold text-[#0B3D2E] block">AI Analysis</span>
                <span className="text-[10px] text-[#3B5446] font-medium">Material ID & Specs</span>
              </div>
            </div>

            <div className={`h-1 flex-1 mx-4 rounded-full ${step >= 3 ? 'bg-[#238B5A]' : 'bg-[#D4EFE0]'}`} />

            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-heading font-bold text-xs ${
                step === 3 ? 'bg-[#0B3D2E] text-white shadow-xs' : 'bg-white/60 text-[#60756A] border border-[#C2E7D1]'
              }`}>
                03
              </div>
              <div className="hidden sm:block">
                <span className="text-xs font-heading font-extrabold text-[#0B3D2E] block">Create Listing</span>
                <span className="text-[10px] text-[#3B5446] font-medium">Offer parameters</span>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 1: UPLOAD */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-[#C2E7D1] shadow-xl shadow-[#0B3D2E]/5"
            id="seller-step-1-upload"
          >
            <div className="mb-6">
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B3D2E]">
                Tell us what you have.
              </h2>
              <p className="text-sm text-[#3B5446] mt-1 font-medium">
                Upload a photo and our AI will identify the material properties and potential secondary industrial uses.
              </p>
            </div>

            {/* Upload Box */}
            <div className="relative">
              <label
                htmlFor="waste-photo-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-[#A8DEBF] hover:border-[#238B5A] bg-[#EBF7F0]/50 hover:bg-[#EBF7F0] rounded-2xl p-8 text-center cursor-pointer transition-all duration-200"
              >
                {uploadedImage ? (
                  <div className="space-y-4 w-full flex flex-col items-center">
                    <div className="relative w-full max-w-sm h-48 rounded-xl overflow-hidden shadow-md border-2 border-[#A8DEBF]">
                      <img
                        src={uploadedImage}
                        alt="Uploaded industrial waste preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-[#0B3D2E] text-[#C8EBD5] text-[10px] font-extrabold shadow-sm">
                        Image Loaded
                      </div>
                    </div>
                    <p className="text-xs font-bold text-[#146B4A]">
                      Click or drop another file to change image
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-[#D4EFE0] text-[#0B3D2E] flex items-center justify-center shadow-xs border border-[#A8DEBF]">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="font-heading font-bold text-base text-[#0B3D2E] block">
                        Upload waste photo
                      </span>
                      <span className="text-xs text-[#3B5446] mt-1 block font-medium">
                        Drag & drop or browse from your device
                      </span>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-md bg-[#E1F4E8] text-[#146B4A] text-[11px] font-extrabold border border-[#A8DEBF]">
                      JPG / PNG / WEBP
                    </span>
                  </div>
                )}
                <input
                  id="waste-photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Quick-Pick Sample Samples */}
            <div className="mt-6 pt-6 border-t border-[#D4EFE0]">
              <span className="text-xs font-extrabold text-[#146B4A] uppercase tracking-wider block mb-3">
                Or select a sample industrial waste stream:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  {
                    name: 'Silica Waste',
                    url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=400&q=80'
                  },
                  {
                    name: 'Foundry Slag',
                    url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=400&q=80'
                  },
                  {
                    name: 'PET Flakes',
                    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=400&q=80'
                  },
                  {
                    name: 'Aluminium Shavings',
                    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80'
                  }
                ].map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => handlePresetSelect(sample.url, sample.name)}
                    className="p-2 rounded-xl bg-[#EBF7F0] hover:bg-[#D4EFE0] border border-[#C2E7D1] hover:border-[#238B5A] text-left transition-all cursor-pointer flex items-center gap-2"
                  >
                    <img
                      src={sample.url}
                      alt={sample.name}
                      className="w-8 h-8 rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-xs font-bold text-[#0B3D2E] truncate">{sample.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleProceedToStep2}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#0B3D2E] hover:bg-[#146B4A] text-white font-heading font-bold text-sm shadow-md transition-all cursor-pointer"
                id="seller-continue-step-1"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-[#35A66F]" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: AI IDENTIFICATION */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-[#C2E7D1] shadow-xl shadow-[#0B3D2E]/5"
            id="seller-step-2-ai-analysis"
          >
            <div className="mb-6">
              <div className="inline-block text-xs font-extrabold uppercase tracking-widest text-[#238B5A] mb-1">
                Step 2 of 3
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B3D2E]">
                Understanding your waste
              </h2>
              <p className="text-sm text-[#3B5446] mt-1 font-medium">
                Visual feature extraction and material classification against industrial databases.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Image Preview with Scanning Animation */}
              <div className="md:col-span-5 relative w-full h-64 rounded-2xl overflow-hidden shadow-md border-2 border-[#A8DEBF] bg-[#EBF7F0]">
                <img
                  src={uploadedImage || DEFAULT_SELLER_LISTING.imageUrl}
                  alt="Analyzing waste sample"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Laser Scanning Bar */}
                {isScanning && (
                  <motion.div
                    animate={{ y: [0, 240, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#35A66F] to-transparent shadow-[0_0_12px_#35A66F]"
                  />
                )}

                <div className="absolute bottom-3 left-3 right-3 bg-[#0B3D2E]/90 backdrop-blur-xs text-white p-2.5 rounded-xl text-xs flex items-center justify-between border border-[#146B4A]">
                  <span className="font-medium">Analysis Status</span>
                  <span className="font-extrabold text-[#35A66F]">
                    {isScanning ? `Analyzing (${scanProgress}%)` : 'Complete'}
                  </span>
                </div>
              </div>

              {/* Analysis Steps & Identification Result */}
              <div className="md:col-span-7 space-y-4">
                {isScanning ? (
                  <div className="space-y-3 py-4">
                    <p className="text-sm font-bold text-[#0B3D2E] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#238B5A] animate-spin" />
                      <span>Analyzing material signatures...</span>
                    </p>
                    
                    <div className="space-y-2 text-xs">
                      <div className={`flex items-center gap-2 ${scanProgress >= 25 ? 'text-[#146B4A] font-bold' : 'text-[#60756A]'}`}>
                        <CheckCircle2 className="w-4 h-4 text-[#238B5A]" />
                        <span>Identifying material matrix</span>
                      </div>
                      <div className={`flex items-center gap-2 ${scanProgress >= 50 ? 'text-[#146B4A] font-bold' : 'text-[#60756A]'}`}>
                        <CheckCircle2 className="w-4 h-4 text-[#238B5A]" />
                        <span>Estimating chemical composition</span>
                      </div>
                      <div className={`flex items-center gap-2 ${scanProgress >= 75 ? 'text-[#146B4A] font-bold' : 'text-[#60756A]'}`}>
                        <CheckCircle2 className="w-4 h-4 text-[#238B5A]" />
                        <span>Checking reuse and offtake possibilities</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    {/* Identification Badge */}
                    <div className="bg-[#EBF7F0] p-5 rounded-2xl border border-[#A8DEBF]">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#146B4A]">
                            AI IDENTIFIED
                          </span>
                          {aiAnalysis?.source === 'gemini-vision' ? (
                            <span className="px-2 py-0.5 rounded-md bg-[#146B4A]/15 text-[#0B3D2E] font-bold text-[10px] flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-[#238B5A]" /> Gemini Vision
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-[#238B5A]/15 text-[#0B3D2E] font-bold text-[10px] flex items-center gap-1">
                              <Cpu className="w-3 h-3 text-[#238B5A]" /> Industrial Classifier
                            </span>
                          )}
                        </div>
                        <span className="px-2.5 py-0.5 rounded-md bg-[#0B3D2E] text-[#C8EBD5] font-extrabold text-[11px]">
                          {aiAnalysis?.confidence || formData.aiIdentifiedConfidence || 92}% confidence
                        </span>
                      </div>
                      <h3 className="font-heading font-extrabold text-2xl text-[#0B3D2E]">
                        {aiAnalysis?.material || formData.materialName || 'Identified Material'}
                      </h3>
                      <p className="text-xs text-[#3B5446] mt-0.5 font-medium">
                        Category: <strong className="text-[#0B3D2E]">{aiAnalysis?.category || aiAnalysis?.materialType || formData.materialCategory}</strong>
                        {aiAnalysis?.composition && (
                          <span className="block mt-1 text-[11px] text-[#238B5A] font-semibold">
                            Matrix: {aiAnalysis.composition}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Potential Uses */}
                    <div className="bg-[#F8FCF9] p-4 rounded-2xl border border-[#D4EFE0]">
                      <span className="text-xs font-bold text-[#0B3D2E] block mb-2">
                        Potential Industrial Applications:
                      </span>
                      <ul className="space-y-1.5 text-xs text-[#3B5446]">
                        {(aiAnalysis?.potentialReuses && aiAnalysis.potentialReuses.length > 0 
                          ? aiAnalysis.potentialReuses 
                          : formData.potentialUses || [
                              'Cement production & pozzolanic binder',
                              'Construction materials & precast aggregates',
                              'Industrial abrasive & secondary raw material'
                            ]
                        ).map((use, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${idx % 3 === 0 ? 'bg-[#238B5A]' : idx % 3 === 1 ? 'bg-[#146B4A]' : 'bg-[#35A66F]'}`} />
                            <span>{use}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recyclability & Contamination preview */}
                    {aiAnalysis && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-[#EFF9F2] border border-[#C2E7D1]">
                          <span className="text-[10px] uppercase font-bold text-[#3B5446] block">Contamination Risk</span>
                          <span className="font-bold text-[#0B3D2E] capitalize">{aiAnalysis.contaminationLevel || 'Low'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#EFF9F2] border border-[#C2E7D1]">
                          <span className="text-[10px] uppercase font-bold text-[#3B5446] block">Recyclability</span>
                          <span className="font-bold text-[#0B3D2E]">{aiAnalysis.recyclability || 'High'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-[#D4EFE0] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-[#146B4A] hover:text-[#0B3D2E] transition-colors cursor-pointer bg-[#E1F4E8] border border-[#A8DEBF]"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={isScanning}
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#0B3D2E] hover:bg-[#146B4A] disabled:opacity-50 text-white font-heading font-bold text-sm shadow-md shadow-[#0B3D2E]/20 transition-all cursor-pointer"
                id="seller-continue-step-2"
              >
                <span>Continue to Listing Details</span>
                <ArrowRight className="w-4 h-4 text-[#35A66F]" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: CREATE LISTING FORM */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-[#C2E7D1] shadow-xl shadow-[#0B3D2E]/5"
            id="seller-step-3-form"
          >
            <div className="mb-6">
              <div className="inline-block text-xs font-extrabold uppercase tracking-widest text-[#238B5A] mb-1">
                Step 3 of 3
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B3D2E]">
                Create your listing.
              </h2>
              <p className="text-sm text-[#3B5446] mt-1 font-medium">
                Provide quantity and pricing parameters so AI can match verified buyers near you.
              </p>
            </div>

            <form onSubmit={handleFinalSubmit} className="space-y-6">
              
              {/* Material & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-7">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0B3D2E] mb-1.5" htmlFor="material-name">
                    Material
                  </label>
                  <input
                    id="material-name"
                    type="text"
                    value={formData.materialName}
                    onChange={(e) => setFormData({ ...formData, materialName: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#C2E7D1] bg-[#F8FCF9] text-[#0B3D2E] text-sm font-semibold focus:outline-hidden focus:border-[#238B5A] focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0B3D2E] mb-1.5" htmlFor="quantity">
                    Quantity
                  </label>
                  <div className="flex">
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantityTonnes}
                      onChange={(e) => setFormData({ ...formData, quantityTonnes: Number(e.target.value) })}
                      required
                      className="w-full px-4 py-3 rounded-l-xl border border-r-0 border-[#C2E7D1] bg-[#F8FCF9] text-[#0B3D2E] text-sm font-semibold focus:outline-hidden focus:border-[#238B5A] focus:bg-white"
                    />
                    <span className="px-3.5 py-3 rounded-r-xl border border-[#C2E7D1] bg-[#E1F4E8] text-[#0B3D2E] font-bold text-xs flex items-center">
                      tonnes
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0B3D2E] mb-1.5" htmlFor="expected-price">
                    Expected price
                  </label>
                  <div className="flex">
                    <span className="px-3.5 py-3 rounded-l-xl border border-[#C2E7D1] bg-[#E1F4E8] text-[#0B3D2E] font-bold text-xs flex items-center">
                      ₹
                    </span>
                    <input
                      id="expected-price"
                      type="number"
                      step="100"
                      value={formData.expectedPricePerUnit}
                      onChange={(e) => setFormData({ ...formData, expectedPricePerUnit: Number(e.target.value) })}
                      required
                      className="w-full px-4 py-3 rounded-r-xl border border-l-0 border-[#C2E7D1] bg-[#F8FCF9] text-[#0B3D2E] text-sm font-semibold focus:outline-hidden focus:border-[#238B5A] focus:bg-white"
                    />
                    <span className="ml-2 text-xs text-[#3B5446] font-semibold self-center">/ tonne</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0B3D2E] mb-1.5" htmlFor="location">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#C2E7D1] bg-[#F8FCF9] text-[#0B3D2E] text-sm font-semibold focus:outline-hidden focus:border-[#238B5A] focus:bg-white"
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0B3D2E] mb-1.5" htmlFor="availability">
                    Availability
                  </label>
                  <select
                    id="availability"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value as AvailabilityStatus })}
                    className="w-full px-4 py-3 rounded-xl border border-[#C2E7D1] bg-[#F8FCF9] text-[#0B3D2E] text-sm font-semibold focus:outline-hidden focus:border-[#238B5A] focus:bg-white cursor-pointer"
                  >
                    <option value="Available now">Available now</option>
                    <option value="Within 7 days">Within 7 days</option>
                    <option value="Recurring monthly">Recurring monthly</option>
                    <option value="Custom schedule">Custom schedule</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0B3D2E] mb-1.5" htmlFor="composition">
                    Material composition (Optional)
                  </label>
                  <input
                    id="composition"
                    type="text"
                    value={formData.composition}
                    onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                    placeholder="e.g. SiO2 > 88%, moisture < 4%"
                    className="w-full px-4 py-3 rounded-xl border border-[#C2E7D1] bg-[#F8FCF9] text-[#0B3D2E] text-sm font-medium focus:outline-hidden focus:border-[#238B5A] focus:bg-white"
                  />
                </div>
              </div>

              {/* Contamination Radio Group */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0B3D2E] mb-2">
                  Contamination Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['None', 'Low', 'Medium', 'High'] as ContaminationLevel[]).map((level) => {
                    const isSelected = formData.contamination === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData({ ...formData, contamination: level })}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                          isSelected
                            ? 'bg-[#0B3D2E] text-[#C8EBD5] border-[#0B3D2E] shadow-sm'
                            : 'bg-[#EBF7F0] text-[#0B3D2E] border-[#C2E7D1] hover:border-[#238B5A]'
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0B3D2E] mb-1.5" htmlFor="notes">
                  Additional information
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  placeholder="Add details on storage conditions, packaging, or handling equipment..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#C2E7D1] bg-[#F8FCF9] text-[#0B3D2E] text-sm font-medium focus:outline-hidden focus:border-[#238B5A] focus:bg-white"
                />
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#D4EFE0] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-[#146B4A] hover:text-[#0B3D2E] transition-colors cursor-pointer bg-[#E1F4E8] border border-[#A8DEBF]"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#0B3D2E] hover:bg-[#146B4A] text-white font-heading font-bold text-base shadow-xl shadow-[#0B3D2E]/25 transition-all cursor-pointer hover:scale-[1.01]"
                  id="seller-submit-find-buyers"
                >
                  <span>Find buyers</span>
                  <ArrowRight className="w-5 h-5 text-[#35A66F]" />
                </button>
              </div>
            </form>
          </motion.div>
        )}

      </div>

      {/* AI LOADING OVERLAY */}
      <AnimatePresence>
        {isAiLoadingMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0B3D2E]/90 backdrop-blur-md flex items-center justify-center p-4 text-white text-center"
            id="seller-ai-matching-loading-screen"
          >
            <div className="max-w-md w-full bg-[#146B4A]/60 rounded-3xl p-8 border border-[#35A66F]/40 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-[#238B5A] mx-auto flex items-center justify-center mb-6 shadow-lg">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>

              <h3 className="font-heading font-extrabold text-2xl text-white mb-2">
                Finding companies that can use your waste...
              </h3>
              <p className="text-xs text-[#C8EBD5] mb-6">
                Scanning regional industrial clusters for high-compatibility matches.
              </p>

              <div className="space-y-2.5 text-left text-xs bg-[#0B3D2E]/70 p-4 rounded-xl border border-[#35A66F]/30">
                <div className="flex items-center gap-2 text-[#35A66F]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Checking material compatibility</span>
                </div>
                <div className="flex items-center gap-2 text-[#35A66F]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Checking quantity and logistics radius</span>
                </div>
                <div className="flex items-center gap-2 text-[#35A66F]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ranking potential buyers</span>
                </div>
                <div className="flex items-center gap-2 text-[#C8EBD5]">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Estimating match quality & environmental benefit</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
