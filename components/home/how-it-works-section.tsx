'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { BookOpen, Sparkles, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
		<section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 bg-white dark:bg-slate-950">
			<div className="container mx-auto max-w-6xl">
				<div className="text-center mb-12 sm:mb-16 md:mb-20">
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light mb-4 sm:mb-5 text-slate-900 dark:text-slate-50 tracking-tight px-2 sm:px-0">
						How It Works
					</h2>
					<p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans font-light tracking-wide px-4 sm:px-0">
						Simple, automated, and powerful. Transform any topic
						into an engaging bedtime story in just a few steps.
					</p>
				</div>

				<div
					ref={sectionRef}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
				>
					{steps.map((step, index) => {
						const Icon = step.icon;
						return (
							<div
								key={index}
								className="group relative p-6 sm:p-7 md:p-8 bg-gradient-to-br from-slate-50/80 to-white dark:from-slate-900/80 dark:to-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300/80 dark:hover:border-slate-700/80 hover:shadow-xl transition-all duration-500"
							>
								<div className="flex flex-col items-center text-center">
									<div className="w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-amber-100/60 to-amber-50/60 dark:from-amber-900/30 dark:to-amber-950/30 flex items-center justify-center mb-5 sm:mb-6 border border-amber-200/40 dark:border-amber-800/40 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
										<Icon className="size-7 sm:size-8 md:size-9 text-amber-700/80 dark:text-amber-400/80" />
									</div>
									<h3 className="text-lg sm:text-xl font-serif font-normal mb-2 sm:mb-3 text-slate-900 dark:text-slate-50 tracking-tight">
										{step.title}
									</h3>
									<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-light tracking-wide">
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

				{/* CTA Button */}
				<div className="mt-12 sm:mt-16 md:mt-20 flex justify-center">
					<Button
						size="lg"
						className="group relative text-sm sm:text-base px-8 sm:px-12 py-5 sm:py-6 bg-amber-500/90 dark:bg-amber-500/80 text-white hover:bg-amber-600/90 dark:hover:bg-amber-600/80 font-sans font-light tracking-wide rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
					>
						<BookOpen className="size-4 mr-2.5 sm:mr-3 transition-transform duration-300 group-hover:rotate-6" />
						<span className="whitespace-nowrap">
							Create Your First Story
						</span>
					</Button>
				</div>
			</div>
		</section>
	);
}
