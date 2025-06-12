
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Upload, User, LogOut, Video } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would filter videos
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-youtube-dark-bg border-b border-youtube-card-bg z-50 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-youtube-red rounded flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Kejmiltube</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Szukaj filmów..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-youtube-card-bg border-youtube-hover-bg text-white pl-4 pr-12 focus:border-youtube-red"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-youtube-hover-bg hover:bg-youtube-red"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </form>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Upload Button */}
              <Button
                onClick={() => navigate('/upload')}
                className="btn-youtube flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Dodaj film</span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar_url} alt={user.username} />
                      <AvatarFallback className="bg-youtube-card-bg text-white">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-youtube-card-bg border-youtube-hover-bg" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url} alt={user.username} />
                      <AvatarFallback className="bg-youtube-hover-bg text-white">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-white">{user.username}</p>
                      <p className="text-xs text-youtube-text-secondary">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-youtube-hover-bg" />
                  <DropdownMenuItem 
                    onClick={() => navigate('/profile')}
                    className="text-white hover:bg-youtube-hover-bg cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/my-videos')}
                    className="text-white hover:bg-youtube-hover-bg cursor-pointer"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    <span>Moje filmy</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-youtube-hover-bg" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-white hover:bg-youtube-hover-bg cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Wyloguj</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => navigate('/login')}
                variant="ghost"
                className="text-white hover:bg-youtube-hover-bg"
              >
                Zaloguj
              </Button>
              <Button
                onClick={() => navigate('/register')}
                className="btn-youtube"
              >
                Zarejestruj
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
