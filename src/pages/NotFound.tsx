
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, Video } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-youtube-dark-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 bg-youtube-red rounded flex items-center justify-center">
            <Video className="w-8 h-8 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Kejmiltube</span>
        </div>

        {/* 404 Message */}
        <div className="space-y-4 mb-8">
          <h1 className="text-8xl font-bold text-youtube-red">404</h1>
          <h2 className="text-2xl font-bold text-white">Strona nie została znaleziona</h2>
          <p className="text-youtube-text-secondary">
            Przykro nam, ale strona której szukasz nie istnieje lub została przeniesiona.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link to="/">
            <Button className="btn-youtube w-full">
              <Home className="w-4 h-4 mr-2" />
              Wróć do strony głównej
            </Button>
          </Link>
          
          <div className="text-youtube-text-secondary text-sm">
            <p>Lub spróbuj:</p>
            <div className="flex flex-col space-y-2 mt-2">
              <Link 
                to="/?search=programowanie" 
                className="text-youtube-red hover:text-red-400 underline"
              >
                Wyszukaj filmy o programowaniu
              </Link>
              <Link 
                to="/upload" 
                className="text-youtube-red hover:text-red-400 underline"
              >
                Dodaj swój własny film
              </Link>
            </div>
          </div>
        </div>

        {/* Current Path Info */}
        <div className="mt-8 p-4 bg-youtube-card-bg rounded-lg">
          <p className="text-youtube-text-secondary text-xs">
            Szukana ścieżka: <code className="text-youtube-red">{location.pathname}</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
