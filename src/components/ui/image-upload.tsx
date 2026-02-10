"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash, X } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string;
    folder?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value,
    folder
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    };

    if (!isMounted) {
        return null;
    }

    // Strip quotes if they were accidentally added in .env
    const uploadPreset = (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "espektro_events").replace(/"/g, "");

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value && (
                    <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden border border-zinc-200 shadow-sm">
                        <div className="z-10 absolute top-2 right-2">
                            <Button
                                type="button"
                                onClick={() => onRemove(value)}
                                variant="destructive"
                                size="icon"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={value}
                        />
                    </div>
                )}
            </div>
            <CldUploadWidget
                onSuccess={onUpload}
                uploadPreset={uploadPreset}
                options={{
                    maxFiles: 1, folder: folder || "events", resourceType: "image",
                    clientAllowedFormats: ["image"],
                    maxFileSize: 10000000, // 10MB
                    sources: ["local", "url", "camera"],
                }}
            >
                {({ open }) => {
                    const onClick = () => {
                        if (disabled) return;
                        open();
                    }

                    return (
                        <div
                            onClick={onClick}
                            className={`
                                flex 
                                flex-col 
                                items-center 
                                justify-center 
                                w-full 
                                h-64 
                                border-2 
                                border-dashed 
                                border-gray-300 
                                rounded-lg 
                                transition 
                                bg-slate-50
                                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}
                            `}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <ImagePlus className="w-10 h-10 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 10MB)</p>
                            </div>
                        </div>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}

export default ImageUpload;
