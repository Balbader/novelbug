'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { BookOpen, Sparkles, Heart } from 'lucide-react';

export function FeaturesSection() {
	const featuresRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (featuresRef.current) {
			// Set initial opacity to 0 for all cards
			const cards = Array.from(
				featuresRef.current.children,
			) as HTMLElement[];
			cards.forEach((card) => {
				gsap.set(card, { opacity: 0, y: 25 });
			});

			let hasAnimated = false;

			const animateCards = () => {
				if (hasAnimated) return;
				hasAnimated = true;
				gsap.to(cards, {
					opacity: 1,
					y: 0,
					duration: 0.9,
					stagger: 0.15,
					ease: 'power2.out',
				});
			};

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							animateCards();
							observer.unobserve(entry.target);
						}
					});
				},
				{ threshold: 0.1 },
			);
			observer.observe(featuresRef.current);

			// Fallback: ensure cards are visible after 1 second even if observer doesn't trigger
			const fallbackTimeout = setTimeout(() => {
				if (!hasAnimated) {
					animateCards();
				}
			}, 1000);

			return () => {
				observer.disconnect();
				clearTimeout(fallbackTimeout);
			};
		}
	}, []);

	return (
		<section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
			<div className="container mx-auto max-w-6xl">
				<div className="text-center mb-12 sm:mb-16 md:mb-20">
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light mb-4 sm:mb-5 text-slate-900 dark:text-slate-50 tracking-tight px-2 sm:px-0">
						Why Choose NovelBug?
					</h2>
					<p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans font-light tracking-wide px-4 sm:px-0">
						Transform any topic into an enchanting bedtime story
					</p>
				</div>

				<div
					ref={featuresRef}
					className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
				>
					{/* Feature Card 1 */}
					<div className="group relative p-6 sm:p-8 md:p-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/70 dark:border-slate-800/70 hover:border-slate-300/90 dark:hover:border-slate-700/90 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 opacity-100">
						<div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 to-amber-50/30 dark:from-amber-950/0 dark:to-amber-950/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
						<div className="relative z-10">
							<div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-100/80 to-amber-50/80 dark:from-amber-900/40 dark:to-amber-950/40 flex items-center justify-center mb-5 sm:mb-6 md:mb-7 border border-amber-200/30 dark:border-amber-800/30 group-hover:scale-110 transition-transform duration-500">
								<BookOpen className="size-6 sm:size-7 text-amber-700/90 dark:text-amber-400/90" />
							</div>
							<h3 className="text-xl sm:text-2xl font-serif font-normal mb-3 sm:mb-4 text-slate-900 dark:text-slate-50 tracking-tight">
								Magical Stories
							</h3>
							<p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-light tracking-wide">
								Every lesson becomes a captivating bedtime
								adventure that your child will look forward to.
							</p>
						</div>
					</div>

					{/* Feature Card 2 */}
					<div className="group relative p-6 sm:p-8 md:p-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/70 dark:border-slate-800/70 hover:border-slate-300/90 dark:hover:border-slate-700/90 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 opacity-100">
						<div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 to-amber-50/30 dark:from-amber-950/0 dark:to-amber-950/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
						<div className="relative z-10">
							<div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-100/80 to-amber-50/80 dark:from-amber-900/40 dark:to-amber-950/40 flex items-center justify-center mb-5 sm:mb-6 md:mb-7 border border-amber-200/30 dark:border-amber-800/30 group-hover:scale-110 transition-transform duration-500">
								<Sparkles className="size-6 sm:size-7 text-amber-700/90 dark:text-amber-400/90" />
							</div>
							<h3 className="text-xl sm:text-2xl font-serif font-normal mb-3 sm:mb-4 text-slate-900 dark:text-slate-50 tracking-tight">
								Any Topic
							</h3>
							<p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-light tracking-wide">
								From science to values, history to emotions, we
								turn any concept into an engaging story.
							</p>
						</div>
					</div>

					{/* Feature Card 3 */}
					<div className="group relative p-6 sm:p-8 md:p-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/70 dark:border-slate-800/70 hover:border-slate-300/90 dark:hover:border-slate-700/90 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 opacity-100 sm:col-span-2 md:col-span-1">
						<div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 to-amber-50/30 dark:from-amber-950/0 dark:to-amber-950/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
						<div className="relative z-10">
							<div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-100/80 to-amber-50/80 dark:from-amber-900/40 dark:to-amber-950/40 flex items-center justify-center mb-5 sm:mb-6 md:mb-7 border border-amber-200/30 dark:border-amber-800/30 group-hover:scale-110 transition-transform duration-500">
								<Heart className="size-6 sm:size-7 text-amber-700/90 dark:text-amber-400/90" />
							</div>
							<h3 className="text-xl sm:text-2xl font-serif font-normal mb-3 sm:mb-4 text-slate-900 dark:text-slate-50 tracking-tight">
								Bedtime Bonding
							</h3>
							<p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-light tracking-wide">
								Create special moments while learning together,
								making bedtime both educational and magical.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
