import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

//template to display a news article. Like a card format

//article card function that returns jsx html etc
//recieves two props article and on click. article holds all the article data like image, descrip etc
//on click is a function to call when the card is clicked
//props are like function parameters
export default function ArticleCard({ article, onClick }) { 
    const { isDark } = useTheme();

    const getCategoryColor = (category) => {
        switch (category?.toLowerCase()) { //category? safely accesses the category. Wont crash if cat is null. Just return default
            case 'technology':
            case 'tech':
                return 'bg-blue-600';
            case 'south africa':
            case 'south-africa':
                return 'bg-green-600';
            case 'feel good':
            case 'feel-good':
                return 'bg-yellow-600';
            default:
                return 'bg-gray-600';
        }
    };

    const formatTimeAgo = (timeAgo) => {
        if (!timeAgo) return 'Just now';
        return timeAgo;
    };

    return (
        <div 
            className={`backdrop-blur-sm rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer group active:scale-[0.98] shadow-xl ${
                isDark
                    ? 'bg-white/5 border-gray-700 hover:border-gray-600 hover:shadow-2xl hover:shadow-gray-800/50'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-2xl hover:shadow-gray-200/50'
            }`}
            onClick={() => onClick(article)}
        >
            {/* Large Image */}
            <div className={`relative w-full h-64 sm:h-80 overflow-hidden ${
                isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
                <img 
                    src={article.image || article.urlToImage || 'https://picsum.photos/800/600'} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = 'https://picsum.photos/800/600';
                    }}
                />
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg ${getCategoryColor(article.category)}`}>
                        {article.category || 'General'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6">
                {/* Source and Time */}
                <div className={`flex items-center gap-2 text-xs sm:text-sm mb-3 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                    <span className="font-medium">{article.source?.name || article.source || 'Unknown'}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(article.timeAgo || article.publishedAt)}</span>
                </div>

                {/* Title */}
                <h3 className={`text-xl sm:text-2xl font-bold mb-3 leading-tight transition-colors line-clamp-2 ${
                    isDark
                        ? 'text-white group-hover:text-gray-300'
                        : 'text-gray-900 group-hover:text-gray-700'
                }`}>
                    {article.title || 'No title available'}
                </h3>

                {/* Description */}
                <p className={`text-sm sm:text-base leading-relaxed mb-4 line-clamp-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    {article.description || 'No preview available...'}
                </p>

                {/* Simple CTA */}
                <div className={`pt-4 border-t ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                    <span className={`font-semibold text-sm transition-colors ${
                        isDark
                            ? 'text-gray-400 group-hover:text-gray-300'
                            : 'text-gray-600 group-hover:text-gray-900'
                    }`}>
                        Read Article →
                    </span>
                </div>
            </div>
        </div>
    );
}