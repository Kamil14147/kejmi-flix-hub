
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useAuthSecurity = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, login } = useAuth();
  const { toast } = useToast();

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validateUsername = useCallback((username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return usernameRegex.test(username) && username.length >= 3 && username.length <= 30;
  }, []);

  const validatePassword = useCallback((password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Hasło musi mieć co najmniej 8 znaków');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Hasło musi zawierać co najmniej jedną wielką literę');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Hasło musi zawierać co najmniej jedną małą literę');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Hasło musi zawierać co najmniej jedną cyfrę');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  const secureRegister = useCallback(async (
    email: string, 
    password: string, 
    username: string
  ) => {
    setIsLoading(true);
    
    try {
      // Validate inputs
      if (!validateEmail(email)) {
        toast({
          title: "Błąd walidacji",
          description: "Nieprawidłowy format email",
          variant: "destructive"
        });
        return { success: false };
      }

      if (!validateUsername(username)) {
        toast({
          title: "Błąd walidacji",
          description: "Nazwa użytkownika może zawierać tylko litery, cyfry i podkreślenia (3-30 znaków)",
          variant: "destructive"
        });
        return { success: false };
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        toast({
          title: "Błąd walidacji hasła",
          description: passwordValidation.errors.join(', '),
          variant: "destructive"
        });
        return { success: false };
      }

      // Sanitize inputs
      const sanitizedEmail = email.toLowerCase().trim();
      const sanitizedUsername = username.trim();

      const success = await register(sanitizedEmail, password, sanitizedUsername);
      
      if (success) {
        toast({
          title: "Sukces",
          description: "Konto zostało utworzone. Sprawdź email w celu aktywacji."
        });
      } else {
        toast({
          title: "Błąd rejestracji",
          description: "Nie udało się utworzyć konta",
          variant: "destructive"
        });
      }

      return { success };
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Nieoczekiwany błąd",
        description: "Wystąpił błąd podczas rejestracji",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [register, validateEmail, validateUsername, validatePassword, toast]);

  const secureLogin = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      if (!validateEmail(email)) {
        toast({
          title: "Błąd walidacji",
          description: "Nieprawidłowy format email",
          variant: "destructive"
        });
        return { success: false };
      }

      const sanitizedEmail = email.toLowerCase().trim();
      const success = await login(sanitizedEmail, password);
      
      if (!success) {
        toast({
          title: "Błąd logowania",
          description: "Nieprawidłowe dane logowania",
          variant: "destructive"
        });
      }

      return { success };
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Nieoczekiwany błąd",
        description: "Wystąpił błąd podczas logowania",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [login, validateEmail, toast]);

  return {
    isLoading,
    validateEmail,
    validateUsername,
    validatePassword,
    secureRegister,
    secureLogin
  };
};
