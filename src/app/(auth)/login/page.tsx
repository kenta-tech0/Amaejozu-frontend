
import { useRouter } from 'next/navigation';
import { LoginScreen } from '@/components/Auth/LoginScreen';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/onboarding');
  };

  return <LoginScreen onLogin={handleLogin} />;
}