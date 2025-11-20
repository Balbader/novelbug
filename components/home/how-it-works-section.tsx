'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { BookOpen, Sparkles, Play, BarChart3 } from 'lucide-react';

export function HowItWorksSection() {
	const sectionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (sectionRef.current) {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const cards = Array.from(
								entry.target.children,
							) as HTMLElement[];
							gsap.fromTo(
								cards,
								{
									opacity: 0,
									y: 40,
								},
								{
									opacity: 1,
									y: 0,
									duration: 0.8,
									stagger: 0.2,
									ease: 'power3.out',
								},
							);
							observer.unobserve(entry.target);
						}
					});
				},
				{ threshold: 0.1 },
			);
			observer.observe(sectionRef.current);
		}
	}, []);

	const steps = [
		{
			icon: BookOpen,
			title: 'Choose Your Topic',
			description:
				'Select any lesson, concept, or curiosity you want to transform into a bedtime story.',
		},
		{
			icon: Sparkles,
			title: 'AI Magic Happens',
			description:
				'Our AI transforms your topic into an engaging, age-appropriate bedtime story with characters and adventures.',
		},
		{
			icon: Play,
			title: 'Story Ready',
			description: 'Your personalized bedtime story is ready to read.',
		},
	];

	return (
		<section className="py-24 px-4 bg-white dark:bg-slate-950">
			<div className="container mx-auto max-w-6xl">
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-amber-900 dark:text-amber-100">
						How It Works
					</h2>
					<p className="text-xl text-amber-700 dark:text-amber-300 max-w-2xl mx-auto font-serif">
						Simple, automated, and powerful. Transform any topic
						into an engaging bedtime story in just a few steps.
					</p>
				</div>

				<div
					ref={sectionRef}
					className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
				>
					{steps.map((step, index) => {
						const Icon = step.icon;
						return (
							<div
								key={index}
								className="relative p-6 bg-amber-50/50 dark:bg-amber-950/50 rounded-lg border border-amber-200/50 dark:border-amber-800/50 hover:shadow-lg transition-all"
							>
								<div className="flex flex-col items-center text-center">
									<div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mb-4 border border-amber-300/50 dark:border-amber-700/50">
										<Icon className="size-8 text-amber-700 dark:text-amber-300" />
									</div>
									<h3 className="text-xl font-serif font-semibold mb-2 text-amber-900 dark:text-amber-100">
										{step.title}
									</h3>
									<p className="text-amber-700 dark:text-amber-300 leading-relaxed font-serif text-sm">
										{step.description}
									</p>
								</div>
								{index < steps.length - 1 && (
									<div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-amber-300 dark:bg-amber-700 transform -translate-y-1/2" />
								)}
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
