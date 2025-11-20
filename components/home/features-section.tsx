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
		<section className="py-24 px-4">
			<div className="container mx-auto max-w-6xl">
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-slate-50">
						Why Choose NovelBug?
					</h2>
					<p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
						Transform any topic into an enchanting bedtime story
					</p>
				</div>

				<div
					ref={featuresRef}
					className="grid md:grid-cols-3 gap-8"
				>
					<div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
						<div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6">
							<BookOpen className="size-7 text-purple-600 dark:text-purple-400" />
						</div>
						<h3 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-slate-50">
							Magical Stories
						</h3>
						<p className="text-slate-600 dark:text-slate-400 leading-relaxed">
							Every lesson becomes a captivating bedtime adventure
							that your child will look forward to.
						</p>
					</div>

					<div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
						<div className="w-14 h-14 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-6">
							<Sparkles className="size-7 text-pink-600 dark:text-pink-400" />
						</div>
						<h3 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-slate-50">
							Any Topic
						</h3>
						<p className="text-slate-600 dark:text-slate-400 leading-relaxed">
							From science to values, history to emotions—we turn
							any concept into an engaging story.
						</p>
					</div>

					<div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
						<div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
							<Heart className="size-7 text-blue-600 dark:text-blue-400" />
						</div>
						<h3 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-slate-50">
							Bedtime Bonding
						</h3>
						<p className="text-slate-600 dark:text-slate-400 leading-relaxed">
							Create special moments while learning together,
							making bedtime both educational and magical.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

