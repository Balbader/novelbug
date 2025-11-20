'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export function HeroSection() {
	const heroRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const subtitleRef = useRef<HTMLParagraphElement>(null);
	const ctaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.from(titleRef.current, {
				opacity: 0,
				y: 40,
				duration: 1,
				ease: 'power3.out',
			});

			gsap.from(subtitleRef.current, {
				opacity: 0,
				y: 30,
				duration: 1,
				delay: 0.3,
				ease: 'power3.out',
			});

			gsap.from(ctaRef.current, {
				opacity: 0,
				y: 20,
				duration: 0.8,
				delay: 0.6,
				ease: 'power3.out',
			});
		}, heroRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={heroRef}
			className="relative overflow-hidden px-4 py-20 md:py-28 lg:py-32 min-h-[90vh] flex items-center"
			style={{
				backgroundImage: 'url(/bedtimeStory.png)',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
			}}
		>
			{/* Subtle overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-amber-900/15 dark:from-amber-950/20 dark:via-transparent dark:to-amber-950/25 z-0" />

			<div className="container mx-auto max-w-6xl relative z-10">
				<div className="max-w-4xl mx-auto text-center">
					{/* Main headline */}
					<h1
						ref={titleRef}
						className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white mb-6"
						style={{
							textShadow:
								'0 2px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(0, 0, 0, 0.2)',
						}}
					>
						Turn Knowledge into
						<br />
						<span className="text-white">Bedtime Stories</span>
					</h1>

					{/* Subtitle */}
					<p
						ref={subtitleRef}
						className="text-xl md:text-2xl text-white leading-relaxed max-w-3xl mx-auto mb-8 font-serif"
						style={{
							textShadow:
								'0 1px 10px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 0, 0, 0.2)',
						}}
					>
						Every lesson, concept, or curiosity becomes a magical
						bedtime adventure. Transform what you want your child to
						learn into stories they'll want to hear.
					</p>

					{/* CTA buttons */}
					<div
						ref={ctaRef}
						className="flex flex-col sm:flex-row gap-4 justify-center items-center"
					>
						<Button
							size="lg"
							className="text-lg px-8 py-6 bg-amber-700 hover:bg-amber-800 text-amber-50 shadow-lg hover:shadow-xl transition-all font-serif rounded-lg"
						>
							<BookOpen className="size-5 mr-2" />
							Create My First Story
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="text-lg px-8 py-6 border-2 border-amber-700/60 bg-amber-50/60 dark:bg-amber-900/40 backdrop-blur-sm text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-800/60 hover:border-amber-700 font-serif rounded-lg transition-all"
						>
							Watch Demo
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
