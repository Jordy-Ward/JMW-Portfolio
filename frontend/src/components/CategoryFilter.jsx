import React from 'react';

const categories = [
    { id: 'all', label: 'All News', emoji: '📰' },
    { id: 'technology', label: 'Tech', emoji: '💻' },
    { id: 'south-africa', label: 'South Africa', emoji: '🇿🇦' },
    { id: 'feel-good', label: 'Feel Good', emoji: '😊' }
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Browse by Category</h3>
            <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onCategoryChange(category.id)}
                        className={`px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 ${
                            selectedCategory === category.id
                                ? 'bg-purple-600 border-purple-500 text-white shadow-lg'
                                : 'bg-white/10 border-purple-700 text-gray-300 hover:bg-white/20 hover:border-purple-500'
                        }`}
                    >
                        <span>{category.emoji}</span>
                        <span className="font-medium">{category.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}