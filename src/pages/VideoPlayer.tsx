
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import VideoCard from '@/components/VideoCard';
import CommentSection from '@/components/CommentSection';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Eye, ThumbsUp, ThumbsDown, Share2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Empty videos array - no mock data
const mockVideos: any[] = [];

const VideoPlayer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [video, setVideo] = useState<any>(null);
  const [suggestedVideos, setSuggestedVideos] = useState(mockVideos);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  useEffect(() => {
    // Since we don't have mock videos anymore, redirect to home
    navigate('/');
  }, [id, navigate]);

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
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link skopiowany do schowka",
      duration: 2000,
    });
  };

  if (!video) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-900 text-xl">Ładowanie...</div>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(video.upload_date), {
    addSuffix: true,
    locale: pl
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Back Button */}
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 mb-4"
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
              <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
              
              {/* Video Stats and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4 text-gray-600 text-sm">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{formatViews(video.views)} wyświetleń</span>
                  </div>
                  <span>•</span>
                  <span>{timeAgo}</span>
                  <span>•</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {video.category}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleLike}
                    variant="ghost"
                    className={`flex items-center space-x-2 ${isLiked ? 'text-youtube-red' : 'text-gray-600'} hover:bg-gray-100`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Polub</span>
                  </Button>
                  <Button
                    onClick={handleDislike}
                    variant="ghost"
                    className={`flex items-center space-x-2 ${isDisliked ? 'text-youtube-red' : 'text-gray-600'} hover:bg-gray-100`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="ghost"
                    className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Udostępnij</span>
                  </Button>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg border">
                <img
                  src={video.author_avatar}
                  alt={video.uploaded_by}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="text-gray-900 font-medium text-lg">{video.uploaded_by}</h3>
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>

              {/* Comments Section */}
              <CommentSection videoId={video.id} />
            </div>
          </div>

          {/* Suggested Videos Sidebar */}
          <div className="space-y-4">
            <h3 className="text-gray-900 font-bold text-lg">Polecane filmy</h3>
            <div className="space-y-4">
              {suggestedVideos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Brak polecanych filmów
                </div>
              ) : (
                suggestedVideos.map((suggestedVideo) => (
                  <div key={suggestedVideo.id} className="flex space-x-3">
                    <div className="flex-shrink-0 w-40">
                      <VideoCard video={suggestedVideo} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
