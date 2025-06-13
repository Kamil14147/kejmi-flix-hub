
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, Save, Camera } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user's video statistics
  const { data: videoStats } = useQuery({
    queryKey: ['userVideoStats', user?.id],
    queryFn: async () => {
      if (!user) return { videoCount: 0, totalViews: 0 };
      
      const { data: videos, error } = await supabase
        .from('videos')
        .select('views')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching video stats:', error);
        return { videoCount: 0, totalViews: 0 };
      }

      const videoCount = videos.length;
      const totalViews = videos.reduce((sum, video) => sum + video.views, 0);

      return { videoCount, totalViews };
    },
    enabled: !!user,
  });

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!user) return;

    // Validate username
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      toast({
        title: "Błąd",
        description: "Nazwa użytkownika może zawierać tylko litery, cyfry i podkreślenia",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const success = await updateProfile({
        username: formData.username.trim(),
      });
      
      if (success) {
        toast({
          title: "Profil zaktualizowany",
          description: "Twoje dane zostały pomyślnie zapisane",
        });
        setIsEditing(false);
      } else {
        toast({
          title: "Błąd",
          description: "Nie udało się zaktualizować profilu. Nazwa użytkownika może być już zajęta.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować profilu",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-youtube-dark-bg py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="bg-youtube-card-bg border-youtube-hover-bg">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center space-x-2">
              <User className="w-6 h-6" />
              <span>Mój profil</span>
            </CardTitle>
            <CardDescription className="text-youtube-text-secondary">
              Zarządzaj swoimi danymi osobowymi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatar_url} alt={user.username} />
                  <AvatarFallback className="bg-youtube-hover-bg text-white text-2xl">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-youtube-red hover:bg-red-600"
                  disabled={!isEditing}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-youtube-text-secondary text-sm">
                Kliknij ikonę aparatu, aby zmienić avatar
              </p>
            </div>

            {/* Profile Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  Nazwa użytkownika
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="bg-youtube-hover-bg border-youtube-hover-bg text-white disabled:opacity-60 focus:border-youtube-red"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled={true}
                  className="bg-youtube-hover-bg border-youtube-hover-bg text-white disabled:opacity-60"
                />
                <p className="text-youtube-text-secondary text-xs">
                  Email nie może być zmieniony
                </p>
              </div>

              {/* Account Stats */}
              <div className="bg-youtube-hover-bg rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Statystyki konta</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-youtube-red">
                      {videoStats?.videoCount || 0}
                    </div>
                    <div className="text-youtube-text-secondary text-sm">Filmów</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-youtube-red">
                      {videoStats?.totalViews || 0}
                    </div>
                    <div className="text-youtube-text-secondary text-sm">Wyświetleń</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {!isEditing ? (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="btn-youtube flex-1"
                  >
                    Edytuj profil
                  </Button>
                  <Button
                    onClick={() => navigate('/my-videos')}
                    className="btn-youtube-secondary flex-1"
                  >
                    Moje filmy
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-youtube flex-1"
                  >
                    {isSaving ? (
                      'Zapisywanie...'
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Zapisz
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="ghost"
                    className="text-youtube-text-secondary hover:text-white hover:bg-youtube-hover-bg flex-1"
                  >
                    Anuluj
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
