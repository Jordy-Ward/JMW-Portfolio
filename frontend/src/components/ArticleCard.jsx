import React from 'react';

export default function ArticleCard({ article, onClick }) {
    const getCategoryColor = (category) => {
        switch (category?.toLowerCase()) {
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
                return 'bg-purple-600';
        }
    };

    const formatTimeAgo = (timeAgo) => {
        if (!timeAgo) return 'Just now';
        return timeAgo;
    };

    const truncateTitle = (title, maxLength = 80) => {
        if (!title) return 'No title available';
        return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
    };

    const truncateExcerpt = (content, maxLength = 150) => {
        if (!content) return 'No preview available...';
        return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
    };

    return (
        <div 
            className="bg-white/10 rounded-xl p-6 mb-4 border border-purple-700 hover:bg-white/15 hover:border-purple-500 transition-all duration-200 cursor-pointer group"
            onClick={() => onClick(article)}
        >
            <div className="flex gap-4">
                {/* Article Image */}
                <div className="flex-shrink-0">
                    <img 
                        src={article.image || article.urlToImage || '/api/placeholder/96/96'} 
                        alt={article.title}
                        className="w-24 h-24 rounded-lg object-cover bg-gray-700"
                        onError={(e) => {
                            e.target.src = '/api/placeholder/96/96';
                        }}
                    />
                </div>

                {/* Article Content */}
                <div className="flex-1 min-w-0">
                    {/* Category and Meta Info */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getCategoryColor(article.category)}`}>
                            {article.category || 'General'}
                        </span>
                        <span className="text-gray-400 text-sm">
                            {article.source?.name || article.source || 'Unknown Source'} • {formatTimeAgo(article.timeAgo || article.publishedAt)}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {truncateTitle(article.title)}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                        {truncateExcerpt(article.description || article.content || article.excerpt)}
                    </p>

                    {/* Engagement Stats */}
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <span className="flex items-center gap-1 hover:text-purple-300 transition-colors">
                            <span>👍</span>
                            <span>{article.reactions || article.score || Math.floor(Math.random() * 200) + 50}</span>
                        </span>
                        <span className="flex items-center gap-1 hover:text-purple-300 transition-colors">
                            <span>💬</span>
                            <span>{article.comments || Math.floor(Math.random() * 50) + 5}</span>
                        </span>
                        <span className="flex items-center gap-1 hover:text-purple-300 transition-colors cursor-pointer">
                            <span>📤</span>
                            <span>Share</span>
                        </span>
                        {article.url && (
                            <span className="flex items-center gap-1 hover:text-purple-300 transition-colors cursor-pointer ml-auto">
                                <span>🔗</span>
                                <span>Read More</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}