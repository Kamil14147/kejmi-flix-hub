
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
  });
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
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

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 100MB for demo)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "Plik za duży",
          description: "Maksymalny rozmiar pliku to 100MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Nieprawidłowy format",
          description: "Wybierz plik wideo",
          variant: "destructive",
        });
        return;
      }
      
      setVideoFile(file);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !videoFile) {
      toast({
        title: "Błąd",
        description: "Wypełnij wszystkie wymagane pola i wybierz plik wideo",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // In a real app, this would upload to Cloudinary/Firebase Storage
      // and save metadata to Supabase database
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Film wysłany pomyślnie!",
        description: "Twój film jest już dostępny na platformie",
      });
      
      // Reset form
      setFormData({ title: '', description: '', category: '' });
      setVideoFile(null);
      setThumbnailFile(null);
      
      // Redirect to home page
      navigate('/');
      
    } catch (error) {
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
              {/* Video Upload */}
              <div className="space-y-2">
                <Label className="text-white text-lg">Plik wideo *</Label>
                <div className="border-2 border-dashed border-youtube-hover-bg rounded-lg p-8 text-center">
                  {videoFile ? (
                    <div className="space-y-2">
                      <Video className="w-12 h-12 text-youtube-red mx-auto" />
                      <p className="text-white font-medium">{videoFile.name}</p>
                      <p className="text-youtube-text-secondary text-sm">
                        {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setVideoFile(null)}
                        className="text-youtube-text-secondary hover:text-white"
                      >
                        Usuń plik
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <UploadIcon className="w-16 h-16 text-youtube-text-secondary mx-auto" />
                      <div>
                        <p className="text-white text-lg mb-2">Wybierz plik wideo do przesłania</p>
                        <p className="text-youtube-text-secondary text-sm mb-4">
                          Obsługiwane formaty: MP4, AVI, MOV, WMV (max. 100MB)
                        </p>
                        <Input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoFileChange}
                          className="hidden"
                          id="video-upload"
                        />
                        <Label
                          htmlFor="video-upload"
                          className="btn-youtube cursor-pointer inline-flex items-center space-x-2"
                        >
                          <UploadIcon className="w-4 h-4" />
                          <span>Wybierz plik</span>
                        </Label>
                      </div>
                    </div>
                  )}
                </div>
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
                        <span>Dodaj miniaturkę</span>
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
                      Przesyłanie filmu...
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
