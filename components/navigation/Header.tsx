'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Coffee } from 'lucide-react';

export function Header() {
	const headerRef = useRef<HTMLElement>(null);
	const logoRef = useRef<HTMLDivElement>(null);

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
			className="sticky top-0 z-50 w-full border-b border-slate-200/40 dark:border-slate-800/40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl"
			style={{
				boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
			}}
		>
			<nav className="container mx-auto max-w-7xl px-4 py-5">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-3 group">
						<div ref={logoRef} className="relative">
							<Image
								src="/book.gif"
								alt="NovelBug Logo"
								width={48}
								height={48}
								className="drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
								style={{
									mixBlendMode: 'multiply',
								}}
								priority
							/>
						</div>
						<span className="text-2xl font-serif font-light text-slate-900 dark:text-slate-50 tracking-tight">
							NovelBug
						</span>
					</Link>

					{/* Navigation Links */}
					<div className="hidden md:flex items-center gap-10">
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

					{/* CTA Buttons */}
					<div className="flex items-center gap-3">
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
				</div>
			</nav>
		</header>
	);
}
