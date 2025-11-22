'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, Sparkles } from 'lucide-react';

export function Header() {
	const headerRef = useRef<HTMLElement>(null);
	const logoRef = useRef<HTMLDivElement>(null);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const isMobile = useIsMobile();

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Animate logo on mount
			gsap.from(logoRef.current, {
				opacity: 0,
				scale: 0.8,
				duration: 0.8,
				ease: 'power3.out',
			});
		}, headerRef);

		return () => ctx.revert();
	}, []);

	return (
		<header
			ref={headerRef}
			className="sticky top-0 z-50 w-full border-b border-slate-200/40 dark:border-slate-800/40"
			style={{
				backgroundColor: '#F9F7F4',
				boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
			}}
		>
			<nav className="container mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center gap-1.5 sm:gap-2 md:gap-3 group min-w-0 flex-shrink-0"
					>
						<div ref={logoRef} className="relative flex-shrink-0">
							<Image
								src="/novelbug_bounce.gif"
								alt="NovelBug Logo"
								width={70}
								height={70}
								className="w-12 h-12 sm:w-14 sm:h-14 md:w-[70px] md:h-[70px] drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
								style={{
									mixBlendMode: 'multiply',
								}}
								priority
								unoptimized
							/>
						</div>
						<span className="text-lg sm:text-xl md:text-2xl font-serif font-light text-slate-900 dark:text-slate-50 tracking-tight truncate">
							NovelBug
						</span>
					</Link>

					{/* Desktop Navigation Links */}
					<div className="hidden lg:flex items-center gap-1 xl:gap-2">
						<Link
							href="/"
							className="relative text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-all duration-300 font-sans font-light text-[15px] tracking-wide px-4 py-2 rounded-md hover:bg-slate-100/50 dark:hover:bg-slate-800/30 group"
						>
							<span className="relative z-10">Home</span>
							<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#D97D55] transition-all duration-300 group-hover:w-3/4"></span>
						</Link>
						<Link
							href="/#how-it-works"
							className="relative text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-all duration-300 font-sans font-light text-[15px] tracking-wide px-4 py-2 rounded-md hover:bg-slate-100/50 dark:hover:bg-slate-800/30 group"
						>
							<span className="relative z-10">How It Works</span>
							<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#D97D55] transition-all duration-300 group-hover:w-3/4"></span>
						</Link>
						<Link
							href="/#features"
							className="relative text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-all duration-300 font-sans font-light text-[15px] tracking-wide px-4 py-2 rounded-md hover:bg-slate-100/50 dark:hover:bg-slate-800/30 group"
						>
							<span className="relative z-10">Features</span>
							<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#D97D55] transition-all duration-300 group-hover:w-3/4"></span>
						</Link>
						<Link
							href="/#about"
							className="relative text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-all duration-300 font-sans font-light text-[15px] tracking-wide px-4 py-2 rounded-md hover:bg-slate-100/50 dark:hover:bg-slate-800/30 group"
						>
							<span className="relative z-10">About</span>
							<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#D97D55] transition-all duration-300 group-hover:w-3/4"></span>
						</Link>
						<Link
							href="/#pricing"
							className="relative text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-all duration-300 font-sans font-light text-[15px] tracking-wide px-4 py-2 rounded-md hover:bg-slate-100/50 dark:hover:bg-slate-800/30 group"
						>
							<span className="relative z-10">Pricing</span>
							<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#D97D55] transition-all duration-300 group-hover:w-3/4"></span>
						</Link>
					</div>

					{/* Desktop CTA Buttons */}
					<div className="hidden lg:flex items-center gap-2 xl:gap-3">
						<Link
							href="/signin"
							className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-all duration-300 font-sans font-medium text-sm xl:text-[15px] tracking-wide px-3 xl:px-4 py-1.5 rounded-md hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
						>
							Sign in
						</Link>
						<Link
							href="/signup"
							className="text-[#D97D55] hover:text-white dark:text-[#D97D55] dark:hover:text-white transition-all duration-300 font-sans font-medium text-sm xl:text-[15px] tracking-wide px-3 xl:px-4 py-1.5 rounded-md border border-[#D97D55] hover:bg-[#D97D55] dark:hover:bg-[#D97D55] shadow-sm hover:shadow-md"
						>
							Sign up
						</Link>
						<Button
							size="default"
							className="border-0 shadow-md hover:shadow-lg font-sans font-light text-xs xl:text-sm tracking-wide transition-all duration-300 text-white px-3 xl:px-4"
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
							<Link href="/generate">
								<Sparkles className="size-3 xl:size-4 mr-1.5 xl:mr-2" />
								Try NovelBug for Free
							</Link>
						</Button>
						{/* <Button
							size="default"
							variant="outline"
							className="border-slate-200 shadow-sm hover:shadow-md font-sans font-light text-xs xl:text-sm tracking-wide transition-all duration-300 px-3 xl:px-4"
							asChild
						>
							<Link
								href="https://buymeacoffee.com/novelbug"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Coffee className="size-3 xl:size-4 mr-1.5 xl:mr-2" />
								<span className="hidden xl:inline">
									Buy me a coffee
								</span>
								<span className="xl:hidden">Coffee</span>
							</Link>
						</Button> */}
					</div>

					{/* Mobile/Tablet Menu Button */}
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="lg:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-colors flex-shrink-0"
						aria-label="Toggle menu"
					>
						{mobileMenuOpen ? (
							<X className="size-6" />
						) : (
							<Menu className="size-6" />
						)}
					</button>
				</div>
				{/* Mobile/Tablet Menu */}
				{mobileMenuOpen && (
					<div className="lg:hidden mt-3 sm:mt-4 pb-3 sm:pb-4 border-t border-slate-200/40 dark:border-slate-800/40 pt-3 sm:pt-4">
						<div className="flex flex-col gap-1 sm:gap-2">
							<Link
								href="/"
								onClick={() => setMobileMenuOpen(false)}
								className="relative text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-all duration-300 font-sans font-light text-sm sm:text-base tracking-wide py-2.5 sm:py-3 px-3 sm:px-4 rounded-md hover:bg-slate-100/50 dark:hover:bg-slate-800/30 group"
							>
								<span className="relative z-10">Home</span>
								<span className="absolute left-0 top-0 w-1 h-0 bg-[#D97D55] transition-all duration-300 group-hover:h-full rounded-l-md"></span>
							</Link>
							<Link
								href="/#how-it-works"
								onClick={() => setMobileMenuOpen(false)}
								className="relative text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-all duration-300 font-sans font-light text-sm sm:text-base tracking-wide py-2.5 sm:py-3 px-3 sm:px-4 rounded-md hover:bg-slate-100/50 dark:hover:bg-slate-800/30 group"
							>
								<span className="relative z-10">
									How It Works
								</span>
								<span className="absolute left-0 top-0 w-1 h-0 bg-[#D97D55] transition-all duration-300 group-hover:h-full rounded-l-md"></span>
							</Link>
							<Link
								href="/#features"
								onClick={() => setMobileMenuOpen(false)}
								className="relative text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-all duration-300 font-sans font-light text-sm sm:text-base tracking-wide py-2.5 sm:py-3 px-3 sm:px-4 rounded-md hover:bg-slate-100/50 dark:hover:bg-slate-800/30 group"
							>
								<span className="relative z-10">Features</span>
								<span className="absolute left-0 top-0 w-1 h-0 bg-[#D97D55] transition-all duration-300 group-hover:h-full rounded-l-md"></span>
							</Link>
							<Link
								href="/#about"
								onClick={() => setMobileMenuOpen(false)}
								className="relative text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-all duration-300 font-sans font-light text-sm sm:text-base tracking-wide py-2.5 sm:py-3 px-3 sm:px-4 rounded-md hover:bg-slate-100/50 dark:hover:bg-slate-800/30 group"
							>
								<span className="relative z-10">About</span>
								<span className="absolute left-0 top-0 w-1 h-0 bg-[#D97D55] transition-all duration-300 group-hover:h-full rounded-l-md"></span>
							</Link>
							<Link
								href="/#pricing"
								onClick={() => setMobileMenuOpen(false)}
								className="relative text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-all duration-300 font-sans font-light text-sm sm:text-base tracking-wide py-2.5 sm:py-3 px-3 sm:px-4 rounded-md hover:bg-slate-100/50 dark:hover:bg-slate-800/30 group"
							>
								<span className="relative z-10">Pricing</span>
								<span className="absolute left-0 top-0 w-1 h-0 bg-[#D97D55] transition-all duration-300 group-hover:h-full rounded-l-md"></span>
							</Link>
							<div className="flex flex-col gap-2 sm:gap-3 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-200/40 dark:border-slate-800/40">
								<Link
									href="/signin"
									onClick={() => setMobileMenuOpen(false)}
									className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-all duration-300 font-sans font-medium text-sm sm:text-base tracking-wide py-2.5 sm:py-3 px-3 sm:px-4 rounded-md hover:bg-slate-100/50 dark:hover:bg-slate-800/30 text-center"
								>
									Sign in
								</Link>
								<Link
									href="/signup"
									onClick={() => setMobileMenuOpen(false)}
									className="text-[#D97D55] hover:text-white dark:text-[#D97D55] dark:hover:text-white transition-all duration-300 font-sans font-medium text-sm sm:text-base tracking-wide py-2.5 sm:py-3 px-3 sm:px-4 rounded-md border border-[#D97D55] hover:bg-[#D97D55] dark:hover:bg-[#D97D55] shadow-sm hover:shadow-md text-center"
								>
									Sign up
								</Link>
							</div>
							<Button
								size="default"
								className="border-0 shadow-md hover:shadow-lg font-sans font-light text-sm sm:text-base tracking-wide transition-all duration-300 w-full justify-center mt-1 sm:mt-2 text-white py-2.5 sm:py-3"
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
								onClick={() => setMobileMenuOpen(false)}
								asChild
							>
								<Link href="/generate">
									<Sparkles className="size-4 sm:size-5 mr-2" />
									Try NovelBug for Free
								</Link>
							</Button>
							{/* <Button
								size="default"
								variant="outline"
								className="border-slate-200 shadow-sm hover:shadow-md font-sans font-light text-sm sm:text-base tracking-wide transition-all duration-300 w-full justify-center mt-1 sm:mt-2 py-2.5 sm:py-3"
								asChild
							>
								<Link
									href="https://buymeacoffee.com/novelbug"
									target="_blank"
									rel="noopener noreferrer"
									onClick={() => setMobileMenuOpen(false)}
								>
									<Coffee className="size-4 sm:size-5 mr-2" />
									Buy me a coffee
								</Link>
							</Button> */}
						</div>
					</div>
				)}
			</nav>
		</header>
	);
}
