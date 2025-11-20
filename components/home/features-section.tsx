'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { BookOpen, Sparkles, Heart } from 'lucide-react';

export function FeaturesSection() {
	const featuresRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (featuresRef.current) {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							gsap.from(entry.target.children, {
								opacity: 0,
								y: 30,
								duration: 0.8,
								stagger: 0.2,
								ease: 'power3.out',
							});
							observer.unobserve(entry.target);
						}
					});
				},
				{ threshold: 0.1 },
			);
			observer.observe(featuresRef.current);
		}
	}, []);

	return (
		<section className="py-24 px-4 bg-amber-50/30 dark:bg-amber-950/30">
			<div className="container mx-auto max-w-6xl">
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-amber-900 dark:text-amber-100">
						Why Choose NovelBug?
					</h2>
					<p className="text-xl text-amber-700 dark:text-amber-300 max-w-2xl mx-auto font-serif">
						Transform any topic into an enchanting bedtime story
					</p>
				</div>

				<div ref={featuresRef} className="grid md:grid-cols-3 gap-8">
					{/* Feature Card 1 */}
					<div className="relative p-8 bg-white dark:bg-slate-900 rounded-lg border border-amber-200/50 dark:border-amber-800/50 hover:shadow-xl transition-all hover:-translate-y-1">
						<div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mb-6 border border-amber-300/50 dark:border-amber-700/50">
							<BookOpen className="size-7 text-amber-700 dark:text-amber-300" />
						</div>
						<h3 className="text-2xl font-serif font-semibold mb-3 text-amber-900 dark:text-amber-100">
							Magical Stories
						</h3>
						<p className="text-amber-700 dark:text-amber-300 leading-relaxed font-serif">
							Every lesson becomes a captivating bedtime adventure
							that your child will look forward to.
						</p>
					</div>

					{/* Feature Card 2 */}
					<div className="relative p-8 bg-white dark:bg-slate-900 rounded-lg border border-amber-200/50 dark:border-amber-800/50 hover:shadow-xl transition-all hover:-translate-y-1">
						<div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mb-6 border border-amber-300/50 dark:border-amber-700/50">
							<Sparkles className="size-7 text-amber-700 dark:text-amber-300" />
						</div>
						<h3 className="text-2xl font-serif font-semibold mb-3 text-amber-900 dark:text-amber-100">
							Any Topic
						</h3>
						<p className="text-amber-700 dark:text-amber-300 leading-relaxed font-serif">
							From science to values, history to emotions—we turn
							any concept into an engaging story.
						</p>
					</div>

					{/* Feature Card 3 */}
					<div className="relative p-8 bg-white dark:bg-slate-900 rounded-lg border border-amber-200/50 dark:border-amber-800/50 hover:shadow-xl transition-all hover:-translate-y-1">
						<div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mb-6 border border-amber-300/50 dark:border-amber-700/50">
							<Heart className="size-7 text-amber-700 dark:text-amber-300" />
						</div>
						<h3 className="text-2xl font-serif font-semibold mb-3 text-amber-900 dark:text-amber-100">
							Bedtime Bonding
						</h3>
						<p className="text-amber-700 dark:text-amber-300 leading-relaxed font-serif">
							Create special moments while learning together,
							making bedtime both educational and magical.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
