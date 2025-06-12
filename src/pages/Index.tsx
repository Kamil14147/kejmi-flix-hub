
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoCard from '@/components/VideoCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Clock, Flame, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

// Empty videos array - no mock data
const mockVideos: any[] = [];

const Index = () => {
  const [searchParams] = useSearchParams();
  const [videos, setVideos] = useState(mockVideos);
  const [filteredVideos, setFilteredVideos] = useState(mockVideos);
  const [activeTab, setActiveTab] = useState('recommended');

  const searchQuery = searchParams.get('search');

  useEffect(() => {
    let filtered = [...videos];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tab filter
    switch (activeTab) {
      case 'trending':
        filtered = filtered.sort((a, b) => b.views - a.views);
        break;
      case 'recent':
        filtered = filtered.sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());
        break;
      case 'recommended':
      default:
        // Mix of views and recency for recommendations
        filtered = filtered.sort((a, b) => {
          const scoreA = a.views * 0.7 + (new Date(a.upload_date).getTime() / 1000000) * 0.3;
          const scoreB = b.views * 0.7 + (new Date(b.upload_date).getTime() / 1000000) * 0.3;
          return scoreB - scoreA;
        });
        break;
    }

    setFilteredVideos(filtered);
  }, [videos, searchQuery, activeTab]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchQuery ? `Wyniki wyszukiwania: "${searchQuery}"` : 'Kejmiltube'}
          </h1>
          <p className="text-gray-600">
            {searchQuery ? `Znaleziono ${filteredVideos.length} filmów` : 'Odkryj najlepsze filmy na platformie'}
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-gray-100 border-gray-200">
            <TabsTrigger 
              value="recommended" 
              className="data-[state=active]:bg-youtube-red data-[state=active]:text-white text-gray-600"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Polecane
            </TabsTrigger>
            <TabsTrigger 
              value="trending" 
              className="data-[state=active]:bg-youtube-red data-[state=active]:text-white text-gray-600"
            >
              <Flame className="w-4 h-4 mr-2" />
              Popularne
            </TabsTrigger>
            <TabsTrigger 
              value="recent" 
              className="data-[state=active]:bg-youtube-red data-[state=active]:text-white text-gray-600"
            >
              <Clock className="w-4 h-4 mr-2" />
              Najnowsze
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {/* Videos Grid */}
            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    className="animate-fade-in"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-600 text-lg mb-4">
                  {searchQuery ? 'Nie znaleziono filmów' : 'Brak filmów do wyświetlenia'}
                </div>
                {!searchQuery && (
                  <Link to="/upload">
                    <Button className="btn-youtube">
                      <Plus className="w-4 h-4 mr-2" />
                      Dodaj pierwszy film
                    </Button>
                  </Link>
                )}
                {searchQuery && (
                  <Button
                    onClick={() => window.location.href = '/'}
                    className="btn-youtube"
                  >
                    Wróć do strony głównej
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
