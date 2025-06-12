
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Play, Eye } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  video_url: string;
  thumbnail_url: string;
  uploaded_by: string;
  upload_date: string;
  views: number;
  author_avatar?: string;
}

interface VideoCardProps {
  video: Video;
  className?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, className = '' }) => {
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const timeAgo = formatDistanceToNow(new Date(video.upload_date), {
    addSuffix: true,
    locale: pl
  });

  return (
    <Link to={`/video/${video.id}`} className={`block ${className}`}>
      <div className="video-card group">
        {/* Thumbnail */}
        <div className="relative">
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="video-thumbnail"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
            12:34
          </div>
        </div>

        {/* Video Info */}
        <div className="p-3">
          <div className="flex space-x-3">
            {/* Author Avatar */}
            <div className="flex-shrink-0">
              <img
                src={video.author_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.uploaded_by}`}
                alt={video.uploaded_by}
                className="w-9 h-9 rounded-full"
              />
            </div>

            {/* Video Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium text-sm line-clamp-2 group-hover:text-youtube-text-secondary transition-colors">
                {video.title}
              </h3>
              <p className="text-youtube-text-secondary text-xs mt-1">
                {video.uploaded_by}
              </p>
              <div className="flex items-center space-x-2 text-youtube-text-secondary text-xs mt-1">
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{formatViews(video.views)} wyświetleń</span>
                </div>
                <span>•</span>
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
