'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { BookOpen, Sparkles, Play } from 'lucide-react';

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
									y: 30,
								},
								{
									opacity: 1,
									y: 0,
									duration: 0.9,
									stagger: 0.15,
									ease: 'power2.out',
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
		<section className="py-32 px-4 bg-white dark:bg-slate-950">
			<div className="container mx-auto max-w-6xl">
				<div className="text-center mb-20">
					<h2 className="text-4xl md:text-5xl font-serif font-light mb-5 text-slate-900 dark:text-slate-50 tracking-tight">
						How It Works
					</h2>
					<p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans font-light tracking-wide">
						Simple, automated, and powerful. Transform any topic
						into an engaging bedtime story in just a few steps.
					</p>
				</div>

				<div
					ref={sectionRef}
					className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
				>
					{steps.map((step, index) => {
						const Icon = step.icon;
						return (
							<div
								key={index}
								className="group relative p-8 bg-gradient-to-br from-slate-50/80 to-white dark:from-slate-900/80 dark:to-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300/80 dark:hover:border-slate-700/80 hover:shadow-xl transition-all duration-500"
							>
								<div className="flex flex-col items-center text-center">
									<div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100/60 to-amber-50/60 dark:from-amber-900/30 dark:to-amber-950/30 flex items-center justify-center mb-6 border border-amber-200/40 dark:border-amber-800/40 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
										<Icon className="size-9 text-amber-700/80 dark:text-amber-400/80" />
									</div>
									<h3 className="text-xl font-serif font-normal mb-3 text-slate-900 dark:text-slate-50 tracking-tight">
										{step.title}
									</h3>
									<p className="text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-light text-sm tracking-wide">
										{step.description}
									</p>
								</div>
								{index < steps.length - 1 && (
									<div className="hidden lg:block absolute top-1/2 -right-4 w-10 h-px bg-gradient-to-r from-slate-300/60 to-transparent dark:from-slate-700/60 transform -translate-y-1/2" />
								)}
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
