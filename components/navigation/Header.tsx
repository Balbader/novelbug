'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

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
			className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md"
		>
			<nav className="container mx-auto max-w-7xl px-4 py-4">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-3">
						<div ref={logoRef}>
							<Image
								src="/book.gif"
								alt="NovelBug Logo"
								width={50}
								height={50}
								className="drop-shadow-lg"
								priority
							/>
						</div>
						<span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
							NovelBug
						</span>
					</Link>

					{/* Navigation Links */}
					<div className="hidden md:flex items-center gap-8">
						<Link
							href="/"
							className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
						>
							Home
						</Link>
						<Link
							href="/stories"
							className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
						>
							Stories
						</Link>
						<Link
							href="/about"
							className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
						>
							About
						</Link>
					</div>

					{/* CTA Button */}
					<Button
						size="sm"
						className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
					>
						<BookOpen className="size-4 mr-2" />
						Get Started
					</Button>
				</div>
			</nav>
		</header>
	);
}
