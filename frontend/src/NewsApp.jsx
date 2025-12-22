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
    const [selectedCategory, setSelectedCategory] = useState('all');
    
    const handleViewTechNews = () => {
        navigate('/news');
    };
    
    const scrollToSection = (sectionId) => {
        navigate('/', { state: { scrollTo: sectionId } });
    };

    // ONE simple mock article to see how it looks
    const getSingleMockArticle = () => {
        return {
            id: 1,
            title: 'AI Breakthrough Changes Everything We Know',
            source: { name: 'TechCrunch' },
            category: 'technology',
            description: 'This is a sample article description. It provides context and background information about the story, giving readers a preview of what they can expect when they read the full article.',
            image: 'https://picsum.photos/800/600?random=1',
            url: 'https://example.com/article/1',
            timeAgo: '5 hours ago'
        };
    };

    // Simple function to load ONE article when page loads
    const loadArticle = () => {
        setLoading(true);
        // Simulate a short delay (like fetching from API)
        setTimeout(() => {
            const mockArticle = getSingleMockArticle();
            setArticles([mockArticle]); // Just one article in array
            setLoading(false);
        }, 500);
    };

    // Handle category change - just reload the same article for now
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        loadArticle();
    };

    // Handle article click - open in new tab
    const handleArticleClick = (article) => {
        if (article.url) {
            window.open(article.url, '_blank', 'noopener,noreferrer');
        }
    };

    // Load article when component first loads
    useEffect(() => {
        loadArticle();
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
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2"> News</h2>
                </div>

                {/* Category Filter */}
                <CategoryFilter 
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                />

                {/* Show loading spinner or article */}
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="space-y-6 sm:space-y-8">
                        {articles.map((article) => ( //loop through articles, creates article card comp, passes
                                                //each article object as a prop 
                            <ArticleCard 
                                key={article.id}
                                article={article}
                                onClick={handleArticleClick} //curly braces, jsx inserted and run
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}