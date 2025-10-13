import React from 'react';

export default function LoadingSpinner({ text = "Loading more articles..." }) {
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
                {/* Spinning circle */}
                <div className="w-12 h-12 border-4 border-purple-700 border-t-purple-400 rounded-full animate-spin"></div>
                {/* Inner circle for visual appeal */}
                <div className="absolute top-2 left-2 w-8 h-8 border-2 border-transparent border-t-white/30 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-400 text-sm mt-4 animate-pulse">{text}</p>
        </div>
    );
}