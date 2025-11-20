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
			className="sticky top-0 z-50 w-full border-b border-amber-200/50 dark:border-amber-800/50 bg-amber-50/95 dark:bg-amber-950/95 backdrop-blur-md"
			style={{
				boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
			}}
		>
			<nav className="container mx-auto max-w-7xl px-4 py-4">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-3">
						<div ref={logoRef} className="relative">
							<Image
								src="/book.gif"
								alt="NovelBug Logo"
								width={50}
								height={50}
								className="drop-shadow-lg"
								style={{
									mixBlendMode: 'multiply',
								}}
								priority
							/>
						</div>
						<span className="text-2xl font-serif font-bold text-amber-900 dark:text-amber-100">
							NovelBug
						</span>
					</Link>

					{/* Navigation Links */}
					<div className="hidden md:flex items-center gap-8">
						<Link
							href="/"
							className="text-amber-800 dark:text-amber-200 hover:text-amber-700 dark:hover:text-amber-300 transition-colors font-serif font-medium"
						>
							Home
						</Link>
						<Link
							href="/stories"
							className="text-amber-800 dark:text-amber-200 hover:text-amber-700 dark:hover:text-amber-300 transition-colors font-serif font-medium"
						>
							Stories
						</Link>
						<Link
							href="/about"
							className="text-amber-800 dark:text-amber-200 hover:text-amber-700 dark:hover:text-amber-300 transition-colors font-serif font-medium"
						>
							About
						</Link>
					</div>

					{/* CTA Buttons */}
					<div className="flex items-center gap-3">
						<Button
							size="sm"
							variant="outline"
							className="border-amber-700/60 bg-amber-50/60 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-800/60 font-serif"
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
