'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export function Pricing() {
	const pricingRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (pricingRef.current) {
			const cards = Array.from(
				pricingRef.current.children,
			) as HTMLElement[];
			cards.forEach((card) => {
				gsap.set(card, { opacity: 0, y: 30 });
			});

			let hasAnimated = false;

			const animateCards = () => {
				if (hasAnimated) return;
				hasAnimated = true;
				gsap.to(cards, {
					opacity: 1,
					y: 0,
					duration: 0.9,
					stagger: 0.2,
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
			observer.observe(pricingRef.current);

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

	const features = {
		premium: [
			'Create unlimited stories',
			'Advanced story customization',
			'Priority story generation',
			'Export stories as PDF',
			'Ad-free experience',
			'Early access to new features',
			'Remain at beta price forever',
		],
	};

	return (
		<section
			id="pricing"
			className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900"
		>
			<div className="container mx-auto max-w-6xl">
				<div className="text-center mb-12 sm:mb-16 md:mb-20">
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light mb-4 sm:mb-5 text-slate-900 dark:text-slate-50 tracking-tight px-2 sm:px-0">
						Simple, Transparent Pricing
					</h2>
					<p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans font-light tracking-wide px-4 sm:px-0">
						Join the beta now and get lifetime access to all future
						features
						<br /> at the beta price forever.
					</p>
				</div>

				<div
					ref={pricingRef}
					className="flex justify-center max-w-4xl mx-auto"
				>
					{/* Premium Plan */}
					<Card className="relative flex flex-col border-2 border-[#D97D55]/40 dark:border-[#D97D55]/40 hover:border-[#D97D55]/60 dark:hover:border-[#D97D55]/60 hover:shadow-xl transition-all duration-500 w-full max-w-md">
						<div className="absolute -top-4 left-1/2 -translate-x-1/2">
							<span className="bg-[#D97D55] text-white text-xs font-sans font-medium px-3 py-1 rounded-full shadow-md">
								Limited Lifetime Offer
							</span>
						</div>
						<CardHeader className="text-center pb-4 pt-6">
							<CardTitle className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50">
								Lifetime Beta Membership Deal
							</CardTitle>
							<div className="mt-4">
								<span className="text-4xl sm:text-5xl font-serif font-light text-slate-900 dark:text-slate-50">
									$4.99
								</span>
								<span className="text-slate-600 dark:text-slate-400 font-sans font-light text-lg ml-1">
									/month
								</span>
							</div>
							<CardDescription className="text-slate-600 dark:text-slate-400 font-sans font-light mt-2">
								<span className="font-bold">
									No ads, No spams, No limits, just stories.
								</span>
								<br />
								Join the beta now and get lifetime access to all
								future features at a special price.
							</CardDescription>
						</CardHeader>
						<CardContent className="flex-1">
							<ul className="space-y-3">
								{features.premium.map((feature, index) => (
									<li
										key={index}
										className="flex items-start gap-3"
									>
										<Check
											className="size-5 text-[#D97D55] mt-0.5 flex-shrink-0"
											strokeWidth={2}
										/>
										<span className="text-sm text-slate-700 dark:text-slate-300 font-sans font-light">
											{feature}
										</span>
									</li>
								))}
							</ul>
						</CardContent>
						<CardFooter className="pt-6">
							<Button
								className="w-full border-0 shadow-md hover:shadow-lg font-sans font-light text-sm tracking-wide transition-all duration-300 text-white cursor-pointer"
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
								asChild
							>
								<Link href="/auth">
									<Sparkles className="size-4 mr-2" />
									Join the Beta Now
								</Link>
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</section>
	);
}
