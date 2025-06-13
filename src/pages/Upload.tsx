
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload as UploadIcon, Video, Image, Loader2 } from 'lucide-react';

const Upload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    video_url: '',
  });
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const categories = [
    'Edukacja',
    'Technologia',
    'Gaming',
    'Muzyka',
    'Sport',
    'Rozrywka',
    'Nauka',
    'Podróże',
    'Gotowanie',
    'Lifestyle',
    'Business',
    'Inne'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Nieprawidłowy format",
          description: "Wybierz plik obrazu",
          variant: "destructive",
        });
        return;
      }
      
      setThumbnailFile(file);
    }
  };

  const validateYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const extractThumbnailFromUrl = (url: string): string => {
    // Extract video ID from YouTube URL and return thumbnail URL
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    if (match) {
      return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
    }
    return '/placeholder.svg';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.video_url) {
      toast({
        title: "Błąd",
        description: "Wypełnij wszystkie wymagane pola",
        variant: "destructive",
      });
      return;
    }

    if (!validateYouTubeUrl(formData.video_url)) {
      toast({
        title: "Błąd",
        description: "Podaj poprawny link do YouTube",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Błąd",
        description: "Musisz być zalogowany aby dodać film",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      let thumbnailUrl = extractThumbnailFromUrl(formData.video_url);

      // If user uploaded custom thumbnail, we would upload it to Supabase Storage here
      // For now, we'll use the YouTube thumbnail or placeholder
      if (thumbnailFile) {
        // In a production app, upload to Supabase Storage
        thumbnailUrl = URL.createObjectURL(thumbnailFile);
      }

      const { data, error } = await supabase
        .from('videos')
        .insert([
          {
            title: formData.title.trim(),
            description: formData.description.trim(),
            category: formData.category,
            video_url: formData.video_url.trim(),
            thumbnail_url: thumbnailUrl,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Upload error:', error);
        toast({
          title: "Błąd podczas zapisywania",
          description: "Spróbuj ponownie",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Film został dodany!",
        description: "Twój film jest teraz dostępny na platformie",
      });
      
      // Reset form
      setFormData({ title: '', description: '', category: '', video_url: '' });
      setThumbnailFile(null);
      
      // Redirect to the new video
      navigate(`/video/${data.id}`);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Błąd podczas wysyłania",
        description: "Spróbuj ponownie",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-youtube-dark-bg py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="bg-youtube-card-bg border-youtube-hover-bg">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center space-x-2">
              <UploadIcon className="w-6 h-6" />
              <span>Dodaj nowy film</span>
            </CardTitle>
            <CardDescription className="text-youtube-text-secondary">
              Podziel się swoim filmem ze społecznością Kejmiltube
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Video URL */}
              <div className="space-y-2">
                <Label htmlFor="video_url" className="text-white">
                  Link do filmu (YouTube) *
                </Label>
                <Input
                  id="video_url"
                  name="video_url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.video_url}
                  onChange={handleInputChange}
                  className="bg-youtube-hover-bg border-youtube-hover-bg text-white placeholder:text-youtube-text-secondary focus:border-youtube-red"
                  required
                />
                <p className="text-youtube-text-secondary text-xs">
                  Wklej link do filmu na YouTube
                </p>
              </div>

              {/* Thumbnail Upload */}
              <div className="space-y-2">
                <Label className="text-white">Miniaturka (opcjonalne)</Label>
                <div className="border border-youtube-hover-bg rounded-lg p-4">
                  {thumbnailFile ? (
                    <div className="flex items-center space-x-4">
                      <img
                        src={URL.createObjectURL(thumbnailFile)}
                        alt="Thumbnail preview"
                        className="w-32 h-18 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-white">{thumbnailFile.name}</p>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setThumbnailFile(null)}
                          className="text-youtube-text-secondary hover:text-white mt-2"
                        >
                          Usuń miniaturkę
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Image className="w-8 h-8 text-youtube-text-secondary mx-auto mb-2" />
                      <p className="text-youtube-text-secondary text-sm mb-2">
                        Zostanie użyta miniaturka z YouTube lub możesz dodać własną
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                        id="thumbnail-upload"
                      />
                      <Label
                        htmlFor="thumbnail-upload"
                        className="btn-youtube-secondary cursor-pointer inline-flex items-center space-x-2"
                      >
                        <UploadIcon className="w-4 h-4" />
                        <span>Dodaj własną miniaturkę</span>
                      </Label>
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">
                  Tytuł *
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Wprowadź tytuł filmu"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="bg-youtube-hover-bg border-youtube-hover-bg text-white placeholder:text-youtube-text-secondary focus:border-youtube-red"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Opis *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Opisz swój film..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="bg-youtube-hover-bg border-youtube-hover-bg text-white placeholder:text-youtube-text-secondary focus:border-youtube-red min-h-[120px]"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="text-white">Kategoria *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="bg-youtube-hover-bg border-youtube-hover-bg text-white">
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                  <SelectContent className="bg-youtube-card-bg border-youtube-hover-bg">
                    {categories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="text-white hover:bg-youtube-hover-bg"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full btn-youtube"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Zapisywanie filmu...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Opublikuj film
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Upload;
