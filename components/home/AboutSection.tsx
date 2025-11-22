'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AboutSection() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (contentRef.current) {
			gsap.set(contentRef.current, { opacity: 0, y: 30 });

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							gsap.to(contentRef.current, {
								opacity: 1,
								y: 0,
								duration: 0.9,
								ease: 'power2.out',
							});
							observer.unobserve(entry.target);
						}
					});
				},
				{ threshold: 0.1 },
			);
			observer.observe(sectionRef.current!);

			return () => observer.disconnect();
		}
	}, []);

	return (
		<section
			ref={sectionRef}
			className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950"
		>
			<div className="container mx-auto max-w-4xl">
				<div className="text-center mb-12 sm:mb-16 md:mb-20">
					<div className="flex justify-center mb-6 sm:mb-8">
						<div
							className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center border"
							style={{
								backgroundColor: '#F4E9D7',
								borderColor: 'rgba(217, 125, 85, 0.2)',
							}}
						>
							<Heart
								className="size-8 sm:size-10"
								style={{ color: '#D97D55' }}
							/>
						</div>
					</div>
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light mb-4 sm:mb-5 text-slate-900 dark:text-slate-50 tracking-tight px-2 sm:px-0">
						Our Mission
					</h2>
				</div>

				<div
					ref={contentRef}
					className="space-y-6 sm:space-y-7 md:space-y-8 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide"
				>
					<p>
						We believe that learning should feel like wonder. Not
						like work, not like a chore, but like discovering a
						secret about the world. Every child deserves to
						experience that spark of curiosity, that moment when a
						concept clicks and suddenly everything makes sense.
					</p>
					<p>
						Our mission is simple but profound: to make bedtime the
						perfect moment for planting curiosity. We envision a
						world where parents feel empowered to teach their
						children anything, from gravity to gratitude, from
						photosynthesis to friendship, through the power of
						storytelling.
					</p>
					<p>
						Long-term, we see NovelBug becoming a trusted companion
						for families everywhere. A place where learning and
						bedtime stories become one, where knowledge and magic
						dance together, and where every child goes to sleep a
						little wiser, a little more curious, and a little more
						connected to the world around them.
					</p>
				</div>

				{/* CTA Button */}
				<div className="mt-12 sm:mt-16 md:mt-20 flex justify-center">
					<Link href="/about">
						<Button
							size="lg"
							variant="outline"
							className="group relative text-sm sm:text-base px-8 sm:px-12 py-5 sm:py-6 font-sans font-light tracking-wide rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-slate-200 dark:border-slate-800"
						>
							<span className="whitespace-nowrap">
								Learn More About Us
							</span>
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}
