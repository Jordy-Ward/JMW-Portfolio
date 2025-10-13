import React from 'react';

export default function ArticleModal({ article, isOpen, onClose }) {
    if (!isOpen || !article) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-purple-700 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-purple-700">
                    <div className="flex items-center gap-3">
                        <span className="bg-purple-600 px-3 py-1 rounded-lg text-sm font-medium text-white">
                            {article.category || 'General'}
                        </span>
                        <span className="text-gray-400 text-sm">
                            {article.source?.name || article.source || 'Unknown Source'}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    <div className="p-6">
                        {/* Article Image */}
                        {(article.image || article.urlToImage) && (
                            <img 
                                src={article.image || article.urlToImage}
                                alt={article.title}
                                className="w-full h-64 object-cover rounded-xl mb-6"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        )}

                        {/* Title */}
                        <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
                            {article.title || 'No title available'}
                        </h1>

                        {/* Meta information */}
                        <div className="flex items-center gap-4 text-gray-400 text-sm mb-6 pb-4 border-b border-gray-700">
                            <span>📅 {formatDate(article.publishedAt || article.timeAgo)}</span>
                            <span>👤 {article.author || 'Unknown Author'}</span>
                            <span>👍 {article.reactions || article.score || 'N/A'} reactions</span>
                        </div>

                        {/* Article Content */}
                        <div className="prose prose-invert max-w-none">
                            <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                {article.description || 'No description available.'}
                            </p>
                            
                            {article.content && article.content !== article.description && (
                                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {article.content.replace(/\[.*?\]/g, '')} {/* Remove [+chars] markers */}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-700">
                            {article.url && (
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <span>🔗</span>
                                    Read Full Article
                                </a>
                            )}
                            <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 border border-purple-700">
                                <span>📤</span>
                                Share Article
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}