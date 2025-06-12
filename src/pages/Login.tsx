
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Video, Loader2 } from 'lucide-react';

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Błąd",
        description: "Wypełnij wszystkie pola",
        variant: "destructive",
      });
      return;
    }

    const success = await login(formData.email, formData.password);
    
    if (success) {
      toast({
        title: "Zalogowano pomyślnie",
        description: "Witaj z powrotem!",
      });
      navigate('/');
    } else {
      toast({
        title: "Błąd logowania",
        description: "Sprawdź swoje dane i spróbuj ponownie",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-youtube-dark-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-youtube-red rounded flex items-center justify-center">
            <Video className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Kejmiltube</span>
        </div>

        <Card className="bg-youtube-card-bg border-youtube-hover-bg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Zaloguj się</CardTitle>
            <CardDescription className="text-youtube-text-secondary">
              Wprowadź swoje dane, aby uzyskać dostęp do konta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="twoj@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-youtube-hover-bg border-youtube-hover-bg text-white placeholder:text-youtube-text-secondary focus:border-youtube-red"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Hasło
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-youtube-hover-bg border-youtube-hover-bg text-white placeholder:text-youtube-text-secondary focus:border-youtube-red"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full btn-youtube"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logowanie...
                  </>
                ) : (
                  'Zaloguj się'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-youtube-text-secondary text-sm">
                Nie masz konta?{' '}
                <Link
                  to="/register"
                  className="text-youtube-red hover:text-red-400 font-medium"
                >
                  Zarejestruj się
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
