import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function LoadingSpinner({ text = "Loading more articles..." }) {
    const { isDark } = useTheme();
    
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
                {/* Spinning circle */}
                <div className={`w-12 h-12 border-4 rounded-full animate-spin ${
                    isDark
                        ? 'border-gray-700 border-t-gray-400'
                        : 'border-gray-300 border-t-gray-600'
                }`}></div>
                {/* Inner circle for visual appeal */}
                <div className={`absolute top-2 left-2 w-8 h-8 border-2 border-transparent rounded-full animate-spin ${
                    isDark ? 'border-t-white/30' : 'border-t-gray-400/50'
                }`}></div>
            </div>
            <p className={`text-sm mt-4 animate-pulse ${
                isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>{text}</p>
        </div>
    );
}