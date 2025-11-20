import { HeroSection } from '@/components/home/hero-section';
import { HowItWorksSection } from '@/components/home/how-it-works-section';

export default function Home() {
	return (
		<div className="min-h-screen bg-white dark:bg-slate-950">
			<HeroSection />
			<HowItWorksSection />
		</div>
	);
}
