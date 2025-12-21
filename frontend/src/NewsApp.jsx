import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import ArticleCard from './components/ArticleCard';
import LoadingSpinner from './components/LoadingSpinner';

export default function NewsApp() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Auth context for header
    const { username, jwt, logout } = useAuth();
    
    // News app state
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [page, setPage] = useState(1);
    
    // Ref for infinite scroll
    const observerRef = useRef();
    
    // Navigation functions for header
    const handleViewMessaging = () => {
        if (jwt) {
            navigate('/messaging');
        } else {
            navigate('/login', { state: { from: { pathname: '/messaging' } } });
        }
    };
    
    const handleViewTechNews = () => {
        navigate('/news'); // Stay on current page or could navigate to different news sections
    };
    
    // Scroll function for header navigation - navigate to landing with section
    const scrollToSection = (sectionId) => {
        navigate('/', { state: { scrollTo: sectionId } });
    };

    // Mock news data generator (replace with real API later)
    const generateMockArticles = (pageNum, category) => {
        const categories = ['technology', 'south-africa', 'feel-good', 'general'];
        const sources = ['TechCrunch', 'News24', 'BBC', 'Reuters', 'Good News Network'];
        const techTitles = [
            'AI Breakthrough Changes Everything We Know',
            'New Quantum Computer Achieves Record Speed',
            'Tech Giants Announce Major Collaboration',
            'Revolutionary Battery Technology Unveiled',
            'Smartphone Innovation Reaches New Heights'
        ];
        const saTitles = [
            'Cape Town Wins International Award',
            'South African Startup Raises Major Funding',
            'Johannesburg Tech Hub Expands Operations',
            'SA Universities Lead Research Initiative',
            'Local Innovation Gains Global Recognition'
        ];
        const feelGoodTitles = [
            'Community Comes Together to Help Neighbors',
            'Local Hero Saves Family from Fire',
            'Students Raise Funds for Animal Shelter',
            'Elderly Man Completes Marathon for Charity',
            'Teacher Changes Lives Through Education'
        ];

        const getTitlesForCategory = (cat) => {
            switch (cat) {
                case 'technology': return techTitles;
                case 'south-africa': return saTitles;
                case 'feel-good': return feelGoodTitles;
                default: return [...techTitles, ...saTitles, ...feelGoodTitles];
            }
        };

        const titles = getTitlesForCategory(category === 'all' ? 'general' : category);
        const articlesPerPage = 10;
        
        return Array.from({ length: articlesPerPage }, (_, index) => {
            const globalIndex = (pageNum - 1) * articlesPerPage + index;
            const titleIndex = globalIndex % titles.length;
            const selectedCategory = category === 'all' ? categories[globalIndex % categories.length] : category;
            
            return {
                id: globalIndex + 1,
                title: titles[titleIndex],
                source: { name: sources[globalIndex % sources.length] },
                category: selectedCategory,
                description: `This is a detailed description for ${titles[titleIndex]}. It provides context and background information about the story, giving readers a preview of what they can expect when they read the full article.`,
                content: `Full content for ${titles[titleIndex]}. This would normally contain the complete article text with all the details, quotes, and comprehensive coverage of the topic. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
                publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
                timeAgo: `${Math.floor(Math.random() * 12) + 1} hours ago`,
                reactions: Math.floor(Math.random() * 500) + 50,
                comments: Math.floor(Math.random() * 100) + 5,
                image: `https://picsum.photos/400/300?random=${globalIndex}`,
                url: `https://example.com/article/${globalIndex + 1}`,
                author: `Author ${(globalIndex % 5) + 1}`
            };
        });
    };

    // Load articles function
    const loadArticles = useCallback(async (pageNum, category, append = true) => {
        if (loading) return;
        
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
            const newArticles = generateMockArticles(pageNum, category);
            
            if (newArticles.length === 0) {
                setHasMore(false);
            } else {
                if (append) {
                    setArticles(prev => [...prev, ...newArticles]);
                } else {
                    setArticles(newArticles);
                }
            }
        } catch (error) {
            console.error('Error loading articles:', error);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    // Handle category change
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setArticles([]);
        setPage(1);
        setHasMore(true);
        loadArticles(1, category, false);
    };

    // Handle article click - open article URL in new tab
    const handleArticleClick = (article) => {
        if (article.url) {
            window.open(article.url, '_blank', 'noopener,noreferrer');
        }
    };

    // Infinite scroll observer
    const lastArticleElementCallback = useCallback((node) => {
        if (loading) return;
        if (observerRef.current) observerRef.current.disconnect();
        
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                const nextPage = page + 1;
                setPage(nextPage);
                loadArticles(nextPage, selectedCategory, true);
            }
        });
        
        if (node) observerRef.current.observe(node);
    }, [loading, hasMore, page, selectedCategory, loadArticles]);

        // Initial load
    useEffect(() => {
        loadArticles(1, selectedCategory, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 text-white">
            {/* Reuse the main Header component */}
            <Header 
                username={username}
                jwt={jwt}
                onViewMessaging={handleViewMessaging}
                onViewTechNews={handleViewTechNews}
                onLogout={logout}
                onNavigate={scrollToSection}
                onGoHome={() => navigate('/')}
                onLogin={() => navigate('/login', { state: { from: location } })}
            />

            {/* Main Content Area */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">📰 Latest News</h2>
                    <p className="text-sm sm:text-base text-gray-400">Swipe through the latest stories</p>
                </div>

                {/* Category Filter */}
                <CategoryFilter 
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                />

                {/* Articles Grid - Instagram/TikTok style */}
                <div className="space-y-6 sm:space-y-8">
                    {articles.map((article, index) => {
                        // Attach ref to last article for infinite scroll
                        if (articles.length === index + 1) {
                            return (
                                <div key={article.id} ref={lastArticleElementCallback}>
                                    <ArticleCard 
                                        article={article}
                                        onClick={handleArticleClick}
                                    />
                                </div>
                            );
                        } else {
                            return (
                                <ArticleCard 
                                    key={article.id}
                                    article={article}
                                    onClick={handleArticleClick}
                                />
                            );
                        }
                    })}
                </div>

                {/* Loading State */}
                {loading && <LoadingSpinner />}

                {/* No More Articles */}
                {!loading && !hasMore && articles.length > 0 && (
                    <div className="text-center py-8 sm:py-12">
                        <p className="text-gray-400 text-sm sm:text-base mb-4">🎉 You've reached the end! No more articles to load.</p>
                        <button 
                            onClick={() => handleCategoryChange(selectedCategory)}
                            className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white px-6 py-2.5 rounded-lg transition-colors font-medium text-sm sm:text-base"
                        >
                            Refresh Articles
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && articles.length === 0 && (
                    <div className="text-center py-12 sm:py-16">
                        <div className="text-5xl sm:text-6xl mb-4">📰</div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Articles Found</h3>
                        <p className="text-gray-400 mb-6 text-sm sm:text-base px-4">Try selecting a different category or refresh the page.</p>
                        <button 
                            onClick={() => handleCategoryChange('all')}
                            className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white px-6 py-2.5 rounded-lg transition-colors font-medium text-sm sm:text-base"
                        >
                            View All News
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}