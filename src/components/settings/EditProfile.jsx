import React, { use, useEffect,useRef,useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label"; // Unused import removed
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save } from "lucide-react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/canvasUtils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import AxiosInstance from "@/api/axiosInstance";
import UniversalShimmer from "../ui/UniversalShimmer";
import axios from "axios";

export function EditProfile() {
    const [user, setUser] = useState(null);
    const [spokenlang,setSpokenlang]=useState([])
    const spokenlangref=useRef()
    const [formData, setFormData] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState("");
    const fileInputRef = useRef(null);

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl);
            setIsCropping(true);
        }
    };

    const readFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => resolve(reader.result), false);
            reader.readAsDataURL(file);
        });
    };

    const handleSaveCrop = async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            setAvatarUrl(croppedImage);
            setIsCropping(false);
            // Reset zoomed/cropped state if desired, or keep it.
        } catch (e) {
            console.error(e);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const fetchUser = async () => {
        try {
            const response = await AxiosInstance.get("/auth/currentuser");
            console.log(response.data)
            setUser(response.data); 
            setFormData({
                first_name:response.data.first_name||"",
                last_name: response.data.last_name || "",
                bio: response.data.bio || "",
                native_language: response.data.native_language || "",
                hourlyrate: response.data.hourlyrate || "",
                spoken_languages: response.data.spoken_languages || [],
                learning_language:response.data.learning_language || "",
                prof_photo:response.data.prof_photo||""
            })
        } catch (err) {
            console.error("Failed to fetch user", err);
        }
        };

    useEffect(() => {
            fetchUser();
        }, []);
    
    const handleChange=(e)=>{
        const {name,value}=e.target
        setFormData((prev)=>(
            {...prev,[name]:value}
        ));
    };

    const handleRemovespokenlanguage = (lang) => {
        setFormData(prev => ({
            ...prev,
            spoken_languages: prev.spoken_languages.filter(
                l => l.spoken_language !== lang
            )
        }));
    };

    const handleAddspokenlanguage = () => {
        if (!selectedLanguage) return;

        if (!formData.spoken_languages.find(
            l => l.spoken_language === selectedLanguage
        )) {
            setFormData(prev => ({
                ...prev,
                spoken_languages: [
                    ...prev.spoken_languages,
                    { spoken_language: selectedLanguage }
                ]
            }));
        }

        setSelectedLanguage(""); // reset select
    };

    const handleSaveAll = async () => {
        try {
            const payload = {
                    ...formData,
                };
            if (payload.hourlyrate === "") {
                payload.hourlyrate = null;
                }

                // 2️⃣ Fix prof_photo
            if (!payload.prof_photo) {
                delete payload.prof_photo;
                }
            payload.spoken_languages = payload.spoken_languages.map(lang => ({
                spoken_language: lang.spoken_language
                }));
            if (avatarUrl) {
                const blob = await fetch(avatarUrl).then(res => res.blob());
                const file = new File([blob], `profile_${Date.now()}.jpg`, {
                    type: "image/jpeg",
                });
                const safeFileName = file.name.replace(/\s+/g, "_");

                // Get presigned URL
                const presignedRes = await AxiosInstance.post(
                    "s3/presignedurl/",
                    {
                        file_name: safeFileName,
                        file_type: file.type,
                        folder:"profile_images"
                    }
                );

                const { upload_url, file_url } = presignedRes.data;

                // Upload to S3
                await axios.put(upload_url, file, {
                    headers: {
                        "Content-Type": file.type,
                    },
                });

                // Add image URL to payload
                payload.prof_photo = file_url;
            }

            // 3️⃣ Save profile data
            await AxiosInstance.put("/auth/currentuser", payload);

            // 4️⃣ Update local user state
            setUser(prev => ({
                ...prev,
                ...payload,
            }));

            // 5️⃣ Success feedback
            alert("Profile updated successfully ✅");

        } catch (error) {
            console.error("Profile update failed", error);
            alert("Failed to update profile ❌");
        }
    };


    if (!user) return <div><UniversalShimmer/></div>;
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-1">
                <h2 className="text-lg font-semibold">Profile Information</h2>
                <p className="text-sm text-muted-foreground">Update your personal details and public profile</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-32 w-32 border-4 border-slate-50">
                        <AvatarImage src={avatarUrl || user.prof_photo} className="object-cover" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                    <Button variant="outline" size="sm" className="gap-2" onClick={triggerFileInput}>
                        <Camera className="h-4 w-4" /> Change Photo
                    </Button>
                </div>

                <div className="flex-1 space-y-6 w-full max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">First Name</label>
                            <Input name="first_name" value={formData.first_name} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Last Name</label>
                            <Input name="last_name" value={formData.last_name} onChange={handleChange}/>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Email Address</label>
                        <Input value={user.email} readOnly />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Bio</label>
                        <Textarea
                            className="min-h-[100px]"
                            name="bio"
                            value={formData.bio||"enthusiast"}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Native Language</label>
                            <Select
                                value={formData.native_language}
                                onValueChange={(value) =>
                                    setFormData(prev => ({ ...prev, native_language: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="English">English</SelectItem>
                                    <SelectItem value="Spanish">Spanish</SelectItem>
                                    <SelectItem value="French">French</SelectItem>
                                    <SelectItem value="German">German</SelectItem>
                                    <SelectItem value="Italian">Italian</SelectItem>
                                    <SelectItem value="Chinese">Chinese</SelectItem>
                                    <SelectItem value="Russian">Russian</SelectItem>
                                    <SelectItem value="Portuguese">Portuguese</SelectItem>
                                    <SelectItem value="Korean">Korean</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Known Languages</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.spoken_languages.map((lang) => (
                                <span
                                    key={lang.spoken_language}
                                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center gap-1"
                                >
                                    {lang.spoken_language}
                                    <span
                                    className="cursor-pointer"
                                    onClick={() => handleRemovespokenlanguage(lang.spoken_language)}
                                    >
                                    ×
                                    </span>
                                </span>
                                ))}

                            </div>
                            <div className="flex gap-2" >
                                <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Add language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="English">English</SelectItem>
                                        <SelectItem value="Spanish">Spanish</SelectItem>
                                        <SelectItem value="French">French</SelectItem>
                                        <SelectItem value="German">German</SelectItem>
                                        <SelectItem value="Italian">Italian</SelectItem>
                                        <SelectItem value="Chinese">Chinese</SelectItem>
                                        <SelectItem value="Russian">Russian</SelectItem>
                                        <SelectItem value="Portuguese">Portuguese</SelectItem>
                                        <SelectItem value="Korean">Korean</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" onClick={()=>handleAddspokenlanguage()} >Add</Button>
                            </div>
                        </div>
                    </div>
                    {/* Role Specific Fields */}
                    {user.role === "student" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Learning Language</label>
                                <Select
                                    value={formData.learning_language}
                                    onValueChange={(value) =>
                                        setFormData(prev => ({ ...prev, learning_language: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="English">English</SelectItem>
                                        <SelectItem value="Spanish">Spanish</SelectItem>
                                        <SelectItem value="French">French</SelectItem>
                                        <SelectItem value="German">German</SelectItem>
                                        <SelectItem value="Italian">Italian</SelectItem>
                                        <SelectItem value="Chinese">Chinese</SelectItem>
                                        <SelectItem value="Russian">Russian</SelectItem>
                                        <SelectItem value="Portuguese">Portuguese</SelectItem>
                                        <SelectItem value="Korean">Korean</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                        </div>
                    )}

                    {user.role === "mentor" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Hourly Rate ($)</label>
                                <Input type="number" placeholder="0.00" name="hourlyrate" value={formData.hourlyrate} onChange={handleChange} />
                            </div>
                        </div>
                    )}
                </div>
                </div>

            <div className="flex justify-end pt-6 border-t">
                <Button onClick={handleSaveAll} className="gap-2 min-w-[120px]">
                    <Save className="h-4 w-4" /> Save Changes
                </Button>
            </div>

            <Dialog open={isCropping} onOpenChange={setIsCropping}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Photo</DialogTitle>
                    </DialogHeader>
                    <div className="relative w-full h-[400px] bg-slate-900 rounded-md overflow-hidden">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    <div className="flex items-center gap-4 py-2">
                        <span className="text-sm text-muted-foreground w-12">Zoom</span>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCropping(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveCrop}>Save Photo</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}