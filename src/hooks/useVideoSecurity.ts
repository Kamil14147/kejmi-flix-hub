
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useVideoSecurity = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sanitizeInput = useCallback((input: string): string => {
    return input.replace(/<[^>]*>/g, '').trim();
  }, []);

  const validateVideoData = useCallback((data: {
    title: string;
    description?: string;
    category: string;
  }): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Title validation
    if (!data.title || data.title.length < 3 || data.title.length > 200) {
      errors.push('Tytuł musi mieć od 3 do 200 znaków');
    }

    // Description validation
    if (data.description && data.description.length > 2000) {
      errors.push('Opis nie może przekraczać 2000 znaków');
    }

    // Category validation
    if (!data.category || data.category.trim().length === 0) {
      errors.push('Kategoria jest wymagana');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  const secureVideoUpload = useCallback(async (videoData: {
    title: string;
    description?: string;
    category: string;
    video_url: string;
    thumbnail_url?: string;
  }) => {
    setIsLoading(true);
    
    try {
      // Sanitize inputs
      const sanitizedData = {
        ...videoData,
        title: sanitizeInput(videoData.title),
        description: videoData.description ? sanitizeInput(videoData.description) : undefined,
        category: sanitizeInput(videoData.category)
      };

      // Validate data
      const validation = validateVideoData(sanitizedData);
      if (!validation.isValid) {
        toast({
          title: "Błąd walidacji",
          description: validation.errors.join(', '),
          variant: "destructive"
        });
        return { success: false, errors: validation.errors };
      }

      // Upload to Supabase with authenticated user
      const { data, error } = await supabase
        .from('videos')
        .insert([sanitizedData])
        .select();

      if (error) {
        console.error('Video upload error:', error);
        toast({
          title: "Błąd podczas przesyłania",
          description: "Nie udało się przesłać filmu",
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }

      toast({
        title: "Sukces",
        description: "Film został pomyślnie przesłany"
      });

      return { success: true, data };
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Nieoczekiwany błąd",
        description: "Wystąpił błąd podczas przesyłania filmu",
        variant: "destructive"
      });
      return { success: false, error: 'Unexpected error' };
    } finally {
      setIsLoading(false);
    }
  }, [sanitizeInput, validateVideoData, toast]);

  const secureViewIncrement = useCallback(async (videoId: string) => {
    try {
      const userIP = await fetch('https://api.ipify.org?format=text').then(r => r.text()).catch(() => null);
      
      const { error } = await supabase.rpc('increment_video_views_safe', {
        video_id: videoId,
        user_ip: userIP
      });

      if (error) {
        console.error('View increment error:', error);
      }
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  }, []);

  return {
    isLoading,
    sanitizeInput,
    validateVideoData,
    secureVideoUpload,
    secureViewIncrement
  };
};
