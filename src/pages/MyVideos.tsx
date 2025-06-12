
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import VideoCard from '@/components/VideoCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Plus, Eye, Calendar } from 'lucide-react';

const MyVideos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myVideos, setMyVideos] = useState<any[]>([]);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    // In a real app, this would fetch user's videos from Supabase
    // For now, we'll use an empty array since we don't have real data persistence
    setMyVideos([]);
  }, [user]);

  const totalViews = myVideos.reduce((sum, video) => sum + video.views, 0);

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-youtube-dark-bg py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Moje filmy</h1>
              <p className="text-youtube-text-secondary">
                Zarządzaj swoimi publikacjami na Kejmiltube
              </p>
            </div>
            <Button
              onClick={() => navigate('/upload')}
              className="btn-youtube flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Dodaj nowy film</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-youtube-card-bg border-youtube-hover-bg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-youtube-text-secondary text-sm">Liczba filmów</p>
                  <p className="text-2xl font-bold text-white">{myVideos.length}</p>
                </div>
                <Video className="w-8 h-8 text-youtube-red" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-youtube-card-bg border-youtube-hover-bg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-youtube-text-secondary text-sm">Łączne wyświetlenia</p>
                  <p className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</p>
                </div>
                <Eye className="w-8 h-8 text-youtube-red" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-youtube-card-bg border-youtube-hover-bg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-youtube-text-secondary text-sm">Ostatnia publikacja</p>
                  <p className="text-2xl font-bold text-white">
                    {myVideos.length > 0 ? 'Dziś' : '-'}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-youtube-red" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Videos List */}
        {myVideos.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Twoje publikacje</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {myVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  className="animate-fade-in"
                />
              ))}
            </div>
          </div>
        ) : (
          <Card className="bg-youtube-card-bg border-youtube-hover-bg">
            <CardHeader className="text-center">
              <CardTitle className="text-white">Nie masz jeszcze żadnych filmów</CardTitle>
              <CardDescription className="text-youtube-text-secondary">
                Zacznij dzielić się swoimi filmami ze społecznością Kejmiltube
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <div className="mb-6">
                <Video className="w-24 h-24 text-youtube-text-secondary mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-white font-medium">Dodaj swój pierwszy film</p>
                  <p className="text-youtube-text-secondary text-sm max-w-md mx-auto">
                    Podziel się swoją kreatywnością, wiedzą lub pasją z innymi użytkownikami platformy
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/upload')}
                  className="btn-youtube"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Dodaj pierwszy film
                </Button>
                
                <div className="text-youtube-text-secondary text-xs">
                  <p>Wskazówki:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Używaj ciekawych tytułów</li>
                    <li>Dodawaj dokładne opisy</li>
                    <li>Wybieraj odpowiednie kategorie</li>
                    <li>Twórz atrakcyjne miniaturki</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyVideos;
