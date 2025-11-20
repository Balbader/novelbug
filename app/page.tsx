import { HeroSection } from '@/components/home/hero-section';
import { QuoteSection } from '@/components/home/quote-section';
import { HowItWorksSection } from '@/components/home/how-it-works-section';
import { CTASection } from '@/components/home/cta-section';

export default function Home() {
	return (
		<div className="min-h-screen bg-white dark:bg-slate-950">
			<HeroSection />
			<HowItWorksSection />
			<QuoteSection />
		</div>
	);
}
