'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Sparkles, Moon, BookOpen, Star } from 'lucide-react';
import Image from 'next/image';

export function HeroSection() {
	const heroRef = useRef<HTMLDivElement>(null);
	const logoRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const subtitleRef = useRef<HTMLParagraphElement>(null);
	const ctaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Hero section animations
			gsap.from(logoRef.current, {
				opacity: 0,
				scale: 0.8,
				duration: 1,
				ease: 'power3.out',
			});

			gsap.from(titleRef.current, {
				opacity: 0,
				y: 50,
				duration: 1,
				delay: 0.2,
				ease: 'power3.out',
			});

			gsap.from(subtitleRef.current, {
				opacity: 0,
				y: 30,
				duration: 1,
				delay: 0.5,
				ease: 'power3.out',
			});

			gsap.from(ctaRef.current, {
				opacity: 0,
				y: 20,
				duration: 0.8,
				delay: 0.8,
				ease: 'power3.out',
			});

			// Floating animation for decorative elements
			gsap.to('.floating-star', {
				y: -20,
				duration: 2,
				repeat: -1,
				yoyo: true,
				ease: 'power1.inOut',
				stagger: 0.3,
			});
		}, heroRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={heroRef}
			className="relative overflow-hidden px-4 py-20 md:py-32 min-h-[90vh] flex items-center bg-cover bg-center bg-no-repeat"
			style={{
				backgroundImage: 'url(/bedtimeStory.png)',
			}}
		>
			{/* Overlay for text readability */}
			<div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 dark:from-black/70 dark:via-black/50 dark:to-black/70 z-0" />

			{/* Decorative stars */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
				<Star className="floating-star absolute top-20 left-10 text-yellow-400/50 size-6" />
				<Star className="floating-star absolute top-40 right-20 text-purple-400/50 size-4" />
				<Star className="floating-star absolute bottom-40 left-1/4 text-blue-400/50 size-5" />
				<Sparkles className="floating-star absolute top-1/3 right-1/4 text-pink-400/50 size-5" />
			</div>

			<div className="container mx-auto max-w-7xl relative z-10">
				<div className="flex flex-col items-center text-center space-y-8">
					{/* Logo */}
					<div ref={logoRef} className="mb-4">
						<Image
							src="/book.gif"
							alt="NovelBug Logo"
							width={120}
							height={120}
							className="drop-shadow-2xl"
							priority
						/>
					</div>

					{/* Badge */}
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm text-white border border-white/30 mb-4">
						<Moon className="size-4" />
						<span className="text-sm font-medium">
							Where learning curls up under the covers
						</span>
					</div>

					{/* Title */}
					<h1
						ref={titleRef}
						className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
					>
						<span className="bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
							Welcome to
						</span>
						<br />
						<span className="text-white drop-shadow-lg">
							NovelBug
						</span>
					</h1>

					{/* Subtitle */}
					<p
						ref={subtitleRef}
						className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl drop-shadow-md"
					>
						Every lesson, concept, or curiosity becomes a magical
						bedtime adventure.
					</p>

					{/* Description */}
					<p className="text-lg text-white/80 leading-relaxed max-w-3xl drop-shadow-md">
						Whether it's gravity or gratitude, moons or mindsets,
						NovelBug transforms what you want your child to learn
						into stories they'll want to hear.
					</p>

					{/* CTA Buttons */}
					<div
						ref={ctaRef}
						className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
					>
						<Button
							size="lg"
							className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all backdrop-blur-sm"
						>
							<BookOpen className="size-5 mr-2" />
							Start Your Story
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="text-lg px-8 py-6 border-2 border-white/50 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white"
						>
							Learn More
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
