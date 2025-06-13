
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import VideoCard from '@/components/VideoCard';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Eye, ThumbsUp, ThumbsDown, Share2, Download, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useVideoSecurity } from '@/hooks/useVideoSecurity';

// Mock video data - updated to match the Video interface
const mockVideos = [
  {
    id: '1',
    title: 'Jak nauczyć się programowania w 2024 roku',
    description: 'Kompletny przewodnik dla początkujących programistów. Dowiedz się, jakie języki programowania warto poznać i jak zacząć swoją przygodę z kodem. W tym filmie omówimy najlepsze zasoby edukacyjne, projekty do zbudowania oraz ścieżki kariery w IT.',
    category: 'Edukacja',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=225&fit=crop',
    user_id: 'user-1',
    views: 15420,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    profiles: {
      username: 'CodeMaster',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CodeMaster'
    }
  },
  {
    id: '2',
    title: 'React vs Vue vs Angular - Które wybrać?',
    description: 'Porównanie najpopularniejszych frameworków JavaScript. Analiza zalet i wad każdego rozwiązania.',
    category: 'Technologia',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=225&fit=crop',
    user_id: 'user-2',
    views: 8932,
    created_at: '2024-01-14T15:30:00Z',
    updated_at: '2024-01-14T15:30:00Z',
    profiles: {
      username: 'WebDev Pro',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WebDevPro'
    }
  },
  {
    id: '3',
    title: 'Budowanie aplikacji mobilnej w React Native',
    description: 'Krok po kroku tworzymy aplikację mobilną używając React Native. Od podstaw do publikacji w sklepach.',
    category: 'Mobile',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop',
    user_id: 'user-3',
    views: 12856,
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
    profiles: {
      username: 'MobileDev',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MobileDev'
    }
  }
];

const VideoPlayer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { secureViewIncrement } = useVideoSecurity();
  const [video, setVideo] = useState<any>(null);
  const [suggestedVideos, setSuggestedVideos] = useState(mockVideos);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  useEffect(() => {
    // Find video by ID
    const foundVideo = mockVideos.find(v => v.id === id);
    if (foundVideo) {
      setVideo(foundVideo);
      
      // Securely increment view count
      if (id) {
        secureViewIncrement(id);
      }
      
      // Set suggested videos (exclude current video)
      setSuggestedVideos(mockVideos.filter(v => v.id !== id));
    } else {
      navigate('/');
    }
  }, [id, navigate, secureViewIncrement]);

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
    toast({
      title: isLiked ? "Usunięto z polubionych" : "Dodano do polubionych",
      duration: 2000,
    });
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link skopiowany do schowka",
        duration: 2000,
      });
    }).catch(() => {
      toast({
        title: "Nie udało się skopiować linku",
        variant: "destructive",
        duration: 2000,
      });
    });
  };

  if (!video) {
    return (
      <div className="min-h-screen bg-youtube-dark-bg flex items-center justify-center">
        <div className="text-white text-xl">Ładowanie...</div>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(video.created_at), {
    addSuffix: true,
    locale: pl
  });

  return (
    <div className="min-h-screen bg-youtube-dark-bg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Back Button */}
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-youtube-text-secondary hover:text-white hover:bg-youtube-hover-bg mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Powrót do strony głównej
            </Button>

            {/* Video Player */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                controls
                className="w-full aspect-video"
                poster={video.thumbnail_url}
                preload="metadata"
              >
                <source src={video.video_url} type="video/mp4" />
                Twoja przeglądarka nie obsługuje odtwarzania wideo.
              </video>
            </div>

            {/* Video Info */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-white">{video.title}</h1>
              
              {/* Video Stats and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4 text-youtube-text-secondary text-sm">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{formatViews(video.views)} wyświetleń</span>
                  </div>
                  <span>•</span>
                  <span>{timeAgo}</span>
                  <span>•</span>
                  <span className="bg-youtube-card-bg px-2 py-1 rounded text-xs">
                    {video.category}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleLike}
                    variant="ghost"
                    className={`flex items-center space-x-2 ${isLiked ? 'text-youtube-red' : 'text-youtube-text-secondary'} hover:bg-youtube-hover-bg`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Polub</span>
                  </Button>
                  <Button
                    onClick={handleDislike}
                    variant="ghost"
                    className={`flex items-center space-x-2 ${isDisliked ? 'text-youtube-red' : 'text-youtube-text-secondary'} hover:bg-youtube-hover-bg`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="ghost"
                    className="flex items-center space-x-2 text-youtube-text-secondary hover:bg-youtube-hover-bg"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Udostępnij</span>
                  </Button>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-start space-x-4 bg-youtube-card-bg p-4 rounded-lg">
                <img
                  src={video.profiles?.avatar_url}
                  alt={video.profiles?.username}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="text-white font-medium text-lg">{video.profiles?.username}</h3>
                  <p className="text-youtube-text-secondary text-sm mt-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Suggested Videos Sidebar */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">Polecane filmy</h3>
            <div className="space-y-4">
              {suggestedVideos.map((suggestedVideo) => (
                <div key={suggestedVideo.id} className="flex space-x-3">
                  <div className="flex-shrink-0 w-40">
                    <VideoCard video={suggestedVideo} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
