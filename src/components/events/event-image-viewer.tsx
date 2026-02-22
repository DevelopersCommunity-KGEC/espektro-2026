"use client";

import React, { useState } from "react";
import { Expand } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";

interface EventImageViewerProps {
  image: string;
  title: string;
}

export function EventImageViewer({ image, title }: EventImageViewerProps) {
  return (
    <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-zinc-800 rounded-xl flex justify-center items-center">
      {/* Mobile: 4:5 Aspect Ratio | Desktop: Fixed Height Cover */}
      <div className="relative w-full max-w-sm md:max-w-none md:w-full aspect-[4/5] md:aspect-auto md:h-125 group">
        <img
          src={image || "/images/placeholder.webp"}
          alt={title}
          className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
        />
        {/* Full Screen Trigger */}
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="absolute bottom-4 right-4 p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all duration-300 backdrop-blur-md z-10 cursor-pointer shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label="View full image"
            >
              <Expand className="w-5 h-5" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl p-0 overflow-hidden border-none bg-transparent shadow-none">
            <span className="sr-only">
              <DialogTitle>{title} Image</DialogTitle>
            </span>
            <div className="relative w-full h-auto max-h-[90vh] flex items-center justify-center">
              <img
                src={image || "/images/placeholder.webp"}
                alt={title}
                className="w-full h-full object-contain rounded-lg"
              />
              <DialogClose className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors">
                <span className="sr-only">Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
