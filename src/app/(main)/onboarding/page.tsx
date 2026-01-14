
import { useRouter } from 'next/navigation';
import { OnboardingScreen } from '@/components/Onboarding/OnboardingScreen';

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/');
  };

  return <OnboardingScreen onComplete={handleComplete} />;
}