'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Coffee, Menu, X } from 'lucide-react';

export function Header() {
	const headerRef = useRef<HTMLElement>(null);
	const logoRef = useRef<HTMLDivElement>(null);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
			className="sticky top-0 z-50 w-full border-b border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-white"
			style={{
				boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
			}}
		>
			<nav className="container mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-5">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center gap-2 sm:gap-3 group"
					>
						<div ref={logoRef} className="relative">
							<Image
								src="/novelbug_bounce.gif"
								alt="NovelBug Logo"
								width={70}
								height={70}
								className="sm:w-18 sm:h-18 drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
								style={{
									mixBlendMode: 'multiply',
								}}
								priority
								unoptimized
							/>
						</div>
						<span className="text-xl sm:text-2xl font-serif font-light text-slate-900 dark:text-slate-50 tracking-tight">
							NovelBug
						</span>
					</Link>

					{/* Desktop Navigation Links */}
					<div className="hidden md:flex items-center gap-8 lg:gap-10">
						<Link
							href="/"
							className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-colors font-sans font-light text-[15px] tracking-wide"
						>
							Home
						</Link>
						<Link
							href="/stories"
							className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-colors font-sans font-light text-[15px] tracking-wide"
						>
							Stories
						</Link>
						<Link
							href="/about"
							className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-colors font-sans font-light text-[15px] tracking-wide"
						>
							About
						</Link>
					</div>

					{/* Desktop CTA Button */}
					<div className="hidden md:flex items-center gap-3">
						<Button
							size="sm"
							variant="outline"
							className="border-slate-300/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-400/80 dark:hover:border-slate-600/80 font-sans font-light text-[14px] tracking-wide transition-all duration-300"
							asChild
						>
							<a
								href="https://buymeacoffee.com/novelbug"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Coffee className="size-4 mr-2" />
								Buy me a coffee
							</a>
						</Button>
					</div>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="md:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
						aria-label="Toggle menu"
					>
						{mobileMenuOpen ? (
							<X className="size-6" />
						) : (
							<Menu className="size-6" />
						)}
					</button>
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className="md:hidden mt-4 pb-4 border-t border-slate-200/40 dark:border-slate-800/40 pt-4">
						<div className="flex flex-col gap-4">
							<Link
								href="/"
								onClick={() => setMobileMenuOpen(false)}
								className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-colors font-sans font-light text-[15px] tracking-wide py-2"
							>
								Home
							</Link>
							<Link
								href="/stories"
								onClick={() => setMobileMenuOpen(false)}
								className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-colors font-sans font-light text-[15px] tracking-wide py-2"
							>
								Stories
							</Link>
							<Link
								href="/about"
								onClick={() => setMobileMenuOpen(false)}
								className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-colors font-sans font-light text-[15px] tracking-wide py-2"
							>
								About
							</Link>
							<Button
								size="sm"
								variant="outline"
								className="border-slate-300/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-400/80 dark:hover:border-slate-600/80 font-sans font-light text-[14px] tracking-wide transition-all duration-300 w-full justify-center mt-2"
								asChild
							>
								<a
									href="https://buymeacoffee.com/novelbug"
									target="_blank"
									rel="noopener noreferrer"
									onClick={() => setMobileMenuOpen(false)}
								>
									<Coffee className="size-4 mr-2" />
									Buy me a coffee
								</a>
							</Button>
						</div>
					</div>
				)}
			</nav>
		</header>
	);
}
