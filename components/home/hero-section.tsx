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
	const iconRef = useRef<SVGSVGElement>(null);
	const sprinklesContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.from(titleRef.current, {
				opacity: 0,
				y: 30,
				duration: 1.2,
				ease: 'power2.out',
			});

			gsap.from(subtitleRef.current, {
				opacity: 0,
				y: 20,
				duration: 1,
				delay: 0.4,
				ease: 'power2.out',
			});

			gsap.from(ctaRef.current, {
				opacity: 0,
				y: 15,
				duration: 0.9,
				delay: 0.7,
				ease: 'power2.out',
			});
		}, heroRef);

		return () => ctx.revert();
	}, []);

	useEffect(() => {
		const buttonContainer = ctaRef.current;
		if (!buttonContainer) return;

		// Wait a bit for button to render
		const timeout = setTimeout(() => {
			const button = buttonContainer.querySelector(
				'button',
			) as HTMLButtonElement;
			const icon = iconRef.current;
			const sprinklesContainer = sprinklesContainerRef.current;

			if (!button || !sprinklesContainer) {
				console.warn('Button or sprinkles container not found');
				return;
			}

			const createSprinkle = () => {
				if (!sprinklesContainer || !button) return;

				const sprinkle = document.createElement('div');
				sprinkle.className = 'absolute pointer-events-none';

				// Get button position relative to container
				const buttonRect = button.getBoundingClientRect();
				const containerRect = buttonContainer.getBoundingClientRect();

				// Start from center of button
				const startX =
					buttonRect.left - containerRect.left + buttonRect.width / 2;
				const startY =
					buttonRect.top - containerRect.top + buttonRect.height / 2;

				// Random size - more variety for fireworks effect
				const size = Math.random() * 6 + 1; // 1-7px
				const isLarge = Math.random() > 0.7; // 30% chance of larger particle
				const finalSize = isLarge ? size * 1.8 : size;

				// Vibrant firework colors
				const colors = [
					'rgba(255, 100, 100, 1)', // Red
					'rgba(100, 200, 255, 1)', // Blue
					'rgba(255, 255, 100, 1)', // Yellow
					'rgba(150, 255, 150, 1)', // Green
					'rgba(255, 150, 255, 1)', // Magenta
					'rgba(255, 200, 100, 1)', // Orange
					'rgba(200, 150, 255, 1)', // Purple
					'rgba(255, 255, 255, 1)', // White
				];
				const color = colors[Math.floor(Math.random() * colors.length)];

				sprinkle.style.width = `${finalSize}px`;
				sprinkle.style.height = `${finalSize}px`;
				sprinkle.style.left = `${startX}px`;
				sprinkle.style.top = `${startY}px`;
				sprinkle.style.background = `radial-gradient(circle, ${color} 0%, ${color}80 40%, transparent 70%)`;
				sprinkle.style.borderRadius = '50%';
				sprinkle.style.boxShadow = `0 0 ${finalSize * 3}px ${color}, 0 0 ${finalSize * 6}px ${color}40`;
				sprinkle.style.transform = 'translate(-50%, -50%)';

				sprinklesContainer.appendChild(sprinkle);

				// Animate sprinkle with more dramatic firework effect
				const angle = Math.random() * Math.PI * 2;
				const distance = Math.random() * 100 + 50; // 50-150px
				const duration = Math.random() * 1.2 + 0.8; // 0.8-2s
				const rotation = Math.random() * 360;

				gsap.fromTo(
					sprinkle,
					{
						opacity: 0,
						scale: 0,
						x: 0,
						y: 0,
						rotation: 0,
					},
					{
						opacity: 1,
						scale: isLarge ? 1.5 : 1.3,
						x: Math.cos(angle) * distance,
						y: Math.sin(angle) * distance - 30,
						rotation: rotation,
						duration: duration * 0.3,
						ease: 'power3.out',
					},
				);

				gsap.to(sprinkle, {
					opacity: 0,
					scale: 0.3,
					duration: duration * 0.7,
					delay: duration * 0.3,
					ease: 'power2.in',
					onComplete: () => {
						sprinkle.remove();
					},
				});
			};

			const createSprinkles = () => {
				const count = 35; // More sprinkles for firework effect
				for (let i = 0; i < count; i++) {
					setTimeout(() => {
						createSprinkle();
					}, i * 20); // Faster stagger for more simultaneous effect
				}
			};

			const handleMouseEnter = () => {
				gsap.to(button, {
					scale: 1.02,
					boxShadow: '0 10px 40px rgba(255, 255, 255, 0.15)',
					borderColor: 'rgba(255, 255, 255, 0.25)',
					backgroundColor: 'rgba(255, 255, 255, 0.1)',
					duration: 0.6,
					ease: 'power2.out',
				});

				if (icon) {
					gsap.to(icon, {
						rotation: 8,
						scale: 1.1,
						duration: 0.6,
						ease: 'back.out(1.7)',
					});
				}

				// Create sprinkles
				createSprinkles();
			};

			const handleMouseLeave = () => {
				gsap.to(button, {
					scale: 1,
					boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
					borderColor: 'rgba(255, 255, 255, 0.1)',
					backgroundColor: 'rgba(255, 255, 255, 0.05)',
					duration: 0.5,
					ease: 'power2.out',
				});

				if (icon) {
					gsap.to(icon, {
						rotation: 0,
						scale: 1,
						duration: 0.5,
						ease: 'power2.out',
					});
				}
			};

			button.addEventListener('mouseenter', handleMouseEnter);
			button.addEventListener('mouseleave', handleMouseLeave);
		}, 100);

		return () => {
			clearTimeout(timeout);
		};
	}, []);

	return (
		<section
			ref={heroRef}
			className="relative overflow-hidden px-4 sm:px-6 py-20 sm:py-24 md:py-32 lg:py-40 min-h-[85vh] sm:min-h-[90vh] lg:min-h-[92vh] flex items-center"
		>
			{/* Background with subtle parallax effect */}
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: 'url(/bedtimeStory.png)',
					transform: 'scale(1.05)',
				}}
			/>

			{/* Refined gradient overlays */}
			<div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/20 to-slate-950/50 z-0" />
			<div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-transparent to-slate-950/30 z-0" />

			{/* Subtle vignette effect */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_transparent_50%,_rgba(15,23,42,0.3)_100%)] z-0" />

			<div className="container mx-auto max-w-5xl relative z-10">
				<div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
					{/* Main headline with refined typography */}
					<h1
						ref={titleRef}
						className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light tracking-tight text-white/95 leading-[1.1] px-2 sm:px-0"
					>
						Turn Knowledge into
						<br className="hidden sm:block" />
						<span className="sm:hidden"> </span>
						<span className="font-normal">Bedtime Stories</span>
					</h1>

					{/* Subtitle with refined spacing */}
					<p
						ref={subtitleRef}
						className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto font-sans font-light tracking-wide px-2 sm:px-0"
					>
						Every lesson, concept, or curiosity becomes a magical
						bedtime adventure. Transform what you want your child to
						learn into stories they'll want to hear.
					</p>

					<Button
						size="lg"
						className="group relative text-sm sm:text-base px-8 sm:px-12 py-5 sm:py-6 text-white font-sans font-light tracking-wide rounded-2xl shadow-sm w-full sm:w-auto overflow-hidden z-10 border-0 cursor-pointer"
						style={{
							backgroundColor: '#D97D55',
						}}
					>
						<BookOpen
							ref={iconRef}
							className="size-4 mr-2.5 sm:mr-3 relative z-10"
						/>
						<span className="whitespace-nowrap relative z-10">
							Create My First Story
						</span>
					</Button>
				</div>
			</div>
		</section>
	);
}
