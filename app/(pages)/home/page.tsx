import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { AboutSection } from '@/components/home/AboutSection';

export default function Page() {
	return (
		<div className="min-h-screen bg-white dark:bg-slate-950">
			<HeroSection />
			<HowItWorksSection />
			<FeaturesSection />
			<AboutSection />
		</div>
	);
}
