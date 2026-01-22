import React, { useState, useRef, useCallback } from "react";
import Cropper from 'react-easy-crop';
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Upload, X, ChevronLeft, ArrowRight, Film } from "lucide-react";
import AxiosInstance from "@/api/axiosInstance";
import axios from "axios";
import { toast } from "sonner";

export function CreatePostModal({ open, onOpenChange, onPostCreated }) {
    const [step, setStep] = useState('upload'); // 'upload' | 'details'
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [caption, setCaption] = useState("");
    const [mediatype, setMediatype] = useState("")
    const [isDragging, setIsDragging] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const fileInputRef = useRef(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);


    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) processFile(selectedFile);
    };

    const processFile = (selectedFile) => {
        // Simple validation for image or video
        if (!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('video/')) {
            alert("Please upload an image or video.");
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);

        if (selectedFile.type.startsWith('video/')) {
            setMediatype("video")
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                if (video.duration > 60) {
                    alert("Video length must be maximum 1 minute.");
                    URL.revokeObjectURL(objectUrl);
                    return;
                }
                setFile(selectedFile);
                setPreview(objectUrl);
                setStep('details');
            };
            video.onerror = () => {
                alert("Invalid video file.");
                URL.revokeObjectURL(objectUrl);
            };
            video.src = objectUrl;
        } else {
            setMediatype("image")
            setFile(selectedFile);
            setPreview(objectUrl);
            setStep('details');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) processFile(droppedFile);
    };

    const handleBack = () => {
        setStep('upload');
        setFile(null);
        setPreview(null);
        setCaption("");
        setMediatype("");
    };

    const handleShare = async () => {
        // Mock share action
        try{
            setIsUploading(true);
            setUploadProgress(0);
            const safeFileName = file.name.replace(/\s+/g, "_");
            const presignedres=await AxiosInstance.post(
                "s3/presignedurl/",
                {
                    "file_name":safeFileName,
                    "file_type":file.type,
                    "folder":"posts"
                }
            );
            const { upload_url, file_url } = presignedres.data;
            console.log(upload_url,file_url)
            await axios.put(upload_url,file,{
                headers:{
                    "content-type":file.type
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percent);
                },
            }
        )
        await AxiosInstance.post(
            "createpost/",
            {
                media_url: file_url,
                media_type: mediatype,
                description: caption,
            }
        )
        onPostCreated() 
        onOpenChange(false);
        // Reset state after transition
        setTimeout(() => {
            handleBack();
        }, 300);
        toast.success("post created successfully")
    }catch(error){
        console.log(error)
        toast.error("upload failed")
    }finally {
        setIsUploading(false);
    }  

    };

    const isVideo = file?.type.startsWith('video/');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden bg-white text-slate-900 border-none shadow-2xl rounded-2xl h-[600px] flex flex-col">
                <VisuallyHidden>
                    <DialogTitle>Create new post</DialogTitle>
                </VisuallyHidden>

                <VisuallyHidden>
                    <DialogDescription>
                    Upload an image or video, crop it, and add a caption before sharing.
                    </DialogDescription>
                </VisuallyHidden>

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white z-10">
                    {step === 'details' ? (
                        <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8 hover:bg-slate-100 rounded-full">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    ) : (
                        <div className="w-8"></div> // Spacer
                    )}

                    <span className="font-semibold text-base">Create new post</span>

                    {step === 'details' ? (
                        <Button
                            variant="ghost"
                            className="text-blue-600 font-semibold hover:text-blue-700 hover:bg-blue-50 h-8 px-3"
                            disabled={isUploading}
                            onClick={handleShare}
                        >
                            {isUploading ? "Uploading..." : "Share"}
                        </Button>
                    ) : (
                        <div className="w-8"></div> // Spacer
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col relative bg-slate-50">

                    {step === 'upload' && (
                        <div
                            className={`flex flex-col items-center justify-center flex-1 m-4 border-2 border-dashed rounded-xl transition-all duration-200 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300'}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className={`p-4 rounded-full bg-slate-100 mb-4 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
                                <div className="relative">
                                    <Image className="h-10 w-10 text-slate-400" />
                                    <Film className="h-6 w-6 text-slate-400 absolute -bottom-1 -right-2 bg-slate-100 rounded-full p-0.5" />
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-slate-700 mb-2">Drag photos and videos here</h3>
                            <div className="flex flex-col items-center gap-4">
                                <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
                                    Select from computer
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept="image/*,video/*"
                                    onChange={handleFileSelect}
                                />
                            </div>
                        </div>
                    )}

                    {step === 'details' && (
                        <div className="flex flex-col md:flex-row h-full">
                            <div className="w-full md:w-[60%] bg-black flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 pointer-events-auto">
                                    <Cropper
                                        image={!isVideo ? preview : undefined}
                                        video={isVideo ? preview : undefined}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={isVideo ? 9 / 16 : 1}
                                        onCropChange={setCrop}
                                        onCropComplete={onCropComplete}
                                        onZoomChange={setZoom}
                                        showGrid={true}
                                        objectFit="contain" // Start with 'contain' to see full image, user can zoom to fill
                                    />
                                </div>
                            </div>

                            {/* Details (Right/Bottom) */}
                            <div className="w-full md:w-[40%] bg-white flex flex-col border-l border-slate-100">
                                <div className="p-4 flex items-center gap-3 border-b border-slate-50">
                                    <div className="h-8 w-8 bg-slate-200 rounded-full overflow-hidden">
                                        <img src="https://i.pravatar.cc/300?u=hiroshi" alt="User" className="h-full w-full object-cover" />
                                    </div>
                                    <span className="font-semibold text-sm">Hiroshi Tanaka</span>
                                </div>
                                {isUploading && (
                                    <div className="px-4 pb-4">
                                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-blue-600 h-2 transition-all duration-200"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1 text-right">
                                        Uploading {uploadProgress}%
                                        </p>
                                    </div>
                                )}

                                <div className="p-4 flex-1">
                                    <Textarea
                                        placeholder="Write a caption..."
                                        className="border-none resize-none focus-visible:ring-0 p-0 text-base min-h-[150px]"
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        maxLength={500}
                                    />
                                    <div className="flex justify-end mt-2">
                                        <span className="text-xs text-slate-400">{caption.length}/500</span>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    )}

                </div>
            </DialogContent>
        </Dialog>
    );
}

