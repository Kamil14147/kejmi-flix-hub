
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoCard from '@/components/VideoCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Clock, Flame } from 'lucide-react';

// Mock video data - in real app this would come from Supabase
const mockVideos = [
  {
    id: '1',
    title: 'Jak nauczyć się programowania w 2024 roku',
    description: 'Kompletny przewodnik dla początkujących programistów. Dowiedz się, jakie języki programowania warto poznać.',
    category: 'Edukacja',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=225&fit=crop',
    uploaded_by: 'CodeMaster',
    upload_date: '2024-01-15T10:00:00Z',
    views: 15420,
    author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CodeMaster'
  },
  {
    id: '2',
    title: 'React vs Vue vs Angular - Które wybrać?',
    description: 'Porównanie najpopularniejszych frameworków JavaScript. Analiza zalet i wad każdego rozwiązania.',
    category: 'Technologia',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=225&fit=crop',
    uploaded_by: 'WebDev Pro',
    upload_date: '2024-01-14T15:30:00Z',
    views: 8932,
    author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WebDevPro'
  },
  {
    id: '3',
    title: 'Budowanie aplikacji mobilnej w React Native',
    description: 'Krok po kroku tworzymy aplikację mobilną używając React Native. Od podstaw do publikacji w sklepach.',
    category: 'Mobile',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop',
    uploaded_by: 'MobileDev',
    upload_date: '2024-01-13T09:15:00Z',
    views: 12856,
    author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MobileDev'
  },
  {
    id: '4',
    title: 'AI i Machine Learning dla początkujących',
    description: 'Wprowadzenie do sztucznej inteligencji i uczenia maszynowego. Praktyczne przykłady z Pythonem.',
    category: 'AI',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=225&fit=crop',
    uploaded_by: 'AI Guru',
    upload_date: '2024-01-12T14:45:00Z',
    views: 25743,
    author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AIGuru'
  },
  {
    id: '5',
    title: 'Cyberbezpieczeństwo w 2024 - Co musisz wiedzieć',
    description: 'Najważniejsze trendy w cyberbezpieczeństwie. Jak chronić swoje dane i aplikacje przed atakami.',
    category: 'Bezpieczeństwo',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=225&fit=crop',
    uploaded_by: 'CyberSec Expert',
    upload_date: '2024-01-11T11:20:00Z',
    views: 9876,
    author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CyberSec'
  },
  {
    id: '6',
    title: 'DevOps i CI/CD - Automatyzacja deploymentu',
    description: 'Jak skonfigurować pipeline CI/CD w GitLab/GitHub. Automatyzacja testów i wdrożeń aplikacji.',
    category: 'DevOps',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=225&fit=crop',
    uploaded_by: 'DevOps Master',
    upload_date: '2024-01-10T16:00:00Z',
    views: 7432,
    author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DevOpsMaster'
  }
];

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
    <div className="min-h-screen bg-youtube-dark-bg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {searchQuery ? `Wyniki wyszukiwania: "${searchQuery}"` : 'Kejmiltube'}
          </h1>
          <p className="text-youtube-text-secondary">
            {searchQuery ? `Znaleziono ${filteredVideos.length} filmów` : 'Odkryj najlepsze filmy na platformie'}
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-youtube-card-bg border-youtube-hover-bg">
            <TabsTrigger 
              value="recommended" 
              className="data-[state=active]:bg-youtube-red data-[state=active]:text-white text-youtube-text-secondary"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Polecane
            </TabsTrigger>
            <TabsTrigger 
              value="trending" 
              className="data-[state=active]:bg-youtube-red data-[state=active]:text-white text-youtube-text-secondary"
            >
              <Flame className="w-4 h-4 mr-2" />
              Popularne
            </TabsTrigger>
            <TabsTrigger 
              value="recent" 
              className="data-[state=active]:bg-youtube-red data-[state=active]:text-white text-youtube-text-secondary"
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
                <div className="text-youtube-text-secondary text-lg mb-4">
                  {searchQuery ? 'Nie znaleziono filmów' : 'Brak filmów do wyświetlenia'}
                </div>
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
