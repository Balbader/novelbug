import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { AboutSection } from '@/components/home/AboutSection';
import { Pricing } from '@/components/home/PricingSection';

export default function Home() {
	return (
		<div className="min-h-screen bg-white dark:bg-slate-950">
			<HeroSection />
			<HowItWorksSection />
			<Pricing />
			<FeaturesSection />
			<AboutSection />
		</div>
	);
}
