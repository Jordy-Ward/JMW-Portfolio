import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const categories = [
    { id: 'tech', label: 'Tech' },
    { id: 'politics', label: 'Politics' },
    { id: 'war', label: 'War' },
    { id: 'middle-east', label: 'Middle East' },
    { id: 'sport', label: 'Sport' }
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
    const { isDark } = useTheme();
    
    return (
        <div className="mb-8">
            {/* Horizontal scroll for categories */}
            <div className="overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex gap-3 min-w-max sm:min-w-0 sm:justify-center">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onCategoryChange(category.id)}
                            className={`px-5 py-2.5 rounded-full border-2 transition-all duration-200 flex items-center gap-2 whitespace-nowrap font-medium ${
                                selectedCategory === category.id
                                    ? isDark
                                        ? 'bg-gray-700 border-gray-600 text-white shadow-lg scale-105'
                                        : 'bg-gray-900 border-gray-800 text-white shadow-lg scale-105'
                                    : isDark
                                        ? 'bg-transparent border-gray-600 text-gray-300 hover:bg-white/10 hover:border-gray-500 active:bg-white/20'
                                        : 'bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200'
                            }`}
                        >
                            <span className="text-lg">{category.emoji}</span>
                            <span>{category.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}