import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import ArticleCard from './components/ArticleCard';
import LoadingSpinner from './components/LoadingSpinner';

//useState - Store data that can CHANGE. Like articles and loading state. 
//useEffect - Run CODE when the component LOADS. Like fetching initial articles
//useCallBack - REMEMBER functions so they dont get recreated unnecessarily. 
//useRef - Hold a reference to something. For infinite scroll magic. Persistence across renders

export default function NewsApp() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Auth context for header
    const { username, jwt, logout } = useAuth();
    
    // Simple state - just articles, loading, and selected category
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('tech'); // Start with tech
    const [searchQuery, setSearchQuery] = useState('');
    
    //NewsAPI key
    const API_KEY = '27188921e7cc4aab9a3e59d8f2453bc5';
    
    const handleViewTechNews = () => {
        navigate('/news');
    };
    
    const scrollToSection = (sectionId) => {
        navigate('/', { state: { scrollTo: sectionId } });
    };

    // Helper function to format time
    const getTimeAgo = (dateString) => {
        const now = new Date();
        const published = new Date(dateString);
        const diffInHours = Math.floor((now - published) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        const days = Math.floor(diffInHours / 24);
        if (days === 1) return 'Yesterday';
        return `${days} days ago`;
    };

    //Fetch news from NewsAPI
    const fetchNewsFromAPI = async (category, searchTerm = '') => {
        setLoading(true);
        
        try {
            let url;
            
            // If search term provided
            if (searchTerm.trim()) {
                url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchTerm)}&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;
            } else if (category === 'tech') {
                url = `https://newsapi.org/v2/top-headlines?category=technology&language=en&apiKey=${API_KEY}`;
            } else if (category === 'politics') {
                url = `https://newsapi.org/v2/top-headlines?category=politics&language=en&apiKey=${API_KEY}`;
            } else if (category === 'war') {
                url = `https://newsapi.org/v2/everything?q=("Ukraine war" OR "Russia Ukraine" OR "military conflict")&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;
            } else if (category === 'middle-east') {
                url = `https://newsapi.org/v2/everything?q=("Middle East" OR Gaza OR Israel OR Palestine OR Iran)&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;
            } else if (category === 'sport') {
                url = `https://newsapi.org/v2/top-headlines?category=sports&language=en&apiKey=${API_KEY}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'ok' && data.articles) {
                const validArticles = data.articles
                    .filter(article => article.title && article.url)
                    .slice(0, 50);
                
                const shuffled = validArticles.sort(() => Math.random() - 0.5);
                const selectedArticles = shuffled.slice(0, 10);
                
                const transformedArticles = selectedArticles.map((article, index) => ({
                    id: index + 1,
                    title: article.title,
                    source: { name: article.source.name },
                    category: category,
                    description: article.description || 'No description available.',
                    image: article.urlToImage || 'https://picsum.photos/800/600?random=' + index,
                    url: article.url,
                    timeAgo: getTimeAgo(article.publishedAt)
                }));

                setArticles(transformedArticles);
            } else {
                console.error('API Error:', data.message);
                setArticles([]);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setArticles([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle category change - fetch new articles
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSearchQuery('');
        fetchNewsFromAPI(category);
    };

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            fetchNewsFromAPI(selectedCategory, searchQuery);
        }
    };

    // Handle refresh - reload current view
    const handleRefresh = () => {
        fetchNewsFromAPI(selectedCategory, searchQuery);
    };

    // Handle article click - open in new tab
    const handleArticleClick = (article) => {
        if (article.url) {
            window.open(article.url, '_blank', 'noopener,noreferrer');
        }
    };

    // Load articles when component first loads
    useEffect(() => {
        fetchNewsFromAPI(selectedCategory);
    }, []);


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 text-white">
            <Header 
                username={username}
                jwt={jwt}
                onViewTechNews={handleViewTechNews}
                onLogout={logout}
                onNavigate={scrollToSection}
                onGoHome={() => navigate('/')}
                onLogin={() => navigate('/login', { state: { from: location } })}
            />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-8">
                <div className="mb-6 sm:mb-8 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">News</h2>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 pr-24 rounded-lg bg-white/10 border-2 border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-md font-medium transition-colors"
                        >
                            Search
                        </button>
                    </div>
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery('');
                                fetchNewsFromAPI(selectedCategory);
                            }}
                            className="mt-2 text-sm text-purple-300 hover:text-purple-200 underline"
                        >
                            Clear search
                        </button>
                    )}
                </form>

                {/* Category Filter */}
                <CategoryFilter 
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                />

                {/* Show loading spinner or article */}
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <div className="space-y-6 sm:space-y-8">
                            {articles.length > 0 ? (
                                articles.map((article) => (
                                    <ArticleCard 
                                        key={article.id}
                                        article={article}
                                        onClick={handleArticleClick}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-400 text-lg">No articles found. Try a different search or category.</p>
                                </div>
                            )}
                        </div>

                        {/* Refresh Button - Only show if we have articles */}
                        {articles.length > 0 && (
                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={handleRefresh}
                                    className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                                >
                                    <svg 
                                        className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                                        />
                                    </svg>
                                    Refresh News
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}