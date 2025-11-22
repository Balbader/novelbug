'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Wand2, Lightbulb, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

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
		<section
			id="features"
			className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900"
		>
			<div className="container mx-auto max-w-6xl">
				<div className="text-center mb-12 sm:mb-16 md:mb-20">
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light mb-4 sm:mb-5 text-slate-900 dark:text-slate-50 tracking-tight px-2 sm:px-0">
						Why NovelBug Works?
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
					<div className="group relative p-6 sm:p-7 md:p-8 bg-gradient-to-br from-slate-50/80 to-white dark:from-slate-900/80 dark:to-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300/80 dark:hover:border-slate-700/80 hover:shadow-xl transition-all duration-500 opacity-100">
						<div className="flex flex-col items-center text-center">
							<div
								className="w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
								style={{
									backgroundColor: '#F4E9D7',
									borderColor: 'rgba(217, 125, 85, 0.2)',
								}}
							>
								<Wand2
									className="size-7 sm:size-8 md:size-9"
									style={{ color: '#6FA4AF' }}
								/>
							</div>
							<h3 className="text-lg sm:text-xl font-serif font-normal mb-2 sm:mb-3 text-slate-900 dark:text-slate-50 tracking-tight">
								Magical Stories
							</h3>
							<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-light tracking-wide">
								Every lesson becomes a captivating bedtime
								adventure that your child will look forward to.
							</p>
						</div>
					</div>

					{/* Feature Card 2 */}
					<div className="group relative p-6 sm:p-7 md:p-8 bg-gradient-to-br from-slate-50/80 to-white dark:from-slate-900/80 dark:to-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300/80 dark:hover:border-slate-700/80 hover:shadow-xl transition-all duration-500 opacity-100">
						<div className="flex flex-col items-center text-center">
							<div
								className="w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
								style={{
									backgroundColor: '#F4E9D7',
									borderColor: 'rgba(217, 125, 85, 0.2)',
								}}
							>
								<Lightbulb
									className="size-7 sm:size-8 md:size-9"
									style={{ color: '#B8C4A9' }}
								/>
							</div>
							<h3 className="text-lg sm:text-xl font-serif font-normal mb-2 sm:mb-3 text-slate-900 dark:text-slate-50 tracking-tight">
								Feed Their Curiosity
							</h3>
							<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-light tracking-wide">
								From science to values, history to emotions, we
								turn any concept into an engaging bedtime story.
							</p>
						</div>
					</div>

					{/* Feature Card 3 */}
					<div className="group relative p-6 sm:p-7 md:p-8 bg-gradient-to-br from-slate-50/80 to-white dark:from-slate-900/80 dark:to-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300/80 dark:hover:border-slate-700/80 hover:shadow-xl transition-all duration-500 opacity-100 sm:col-span-2 md:col-span-1">
						<div className="flex flex-col items-center text-center">
							<div
								className="w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
								style={{
									backgroundColor: '#F4E9D7',
									borderColor: 'rgba(217, 125, 85, 0.2)',
								}}
							>
								<Heart
									className="size-7 sm:size-8 md:size-9"
									style={{ color: '#D97D55' }}
								/>
							</div>
							<h3 className="text-lg sm:text-xl font-serif font-normal mb-2 sm:mb-3 text-slate-900 dark:text-slate-50 tracking-tight">
								Bedtime Bonding
							</h3>
							<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-light tracking-wide">
								Create special moments while learning together,
								making bedtime both educational and magical.
							</p>
						</div>
					</div>
				</div>

				{/* CTA Button */}
				<div className="mt-12 sm:mt-16 md:mt-20 flex justify-center">
					<Link href="/generate">
						<Button
							size="lg"
							className="group relative text-sm sm:text-base px-8 sm:px-12 py-5 sm:py-6 text-white font-sans font-light tracking-wide rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
							style={{
								backgroundColor: '#D97D55',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor =
									'#C86A45';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor =
									'#D97D55';
							}}
						>
							<BookOpen className="size-4 mr-2.5 sm:mr-3 transition-transform duration-300 group-hover:rotate-6" />
							<span className="whitespace-nowrap">
								Start Creating Stories
							</span>
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}
