import { HeroSection } from '@/components/home/hero-section';
import { QuoteSection } from '@/components/home/quote-section';
import { FeaturesSection } from '@/components/home/features-section';
import { CTASection } from '@/components/home/cta-section';

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-purple-50/30 to-slate-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
			<HeroSection />
			<QuoteSection />
			<FeaturesSection />
			<CTASection />
		</div>
	);
}
