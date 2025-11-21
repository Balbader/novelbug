import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Footer() {
	return (
		<footer
			className="border-t border-slate-200/40 dark:border-slate-800/40"
			style={{
				backgroundColor: '#F9F7F4',
				boxShadow: '0 -1px 3px rgba(0, 0, 0, 0.03)',
			}}
		>
			<div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
					{/* Logo and Description */}
					<div className="col-span-1 sm:col-span-2 md:col-span-2">
						<Link
							href="/"
							className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 group"
						>
							<Image
								src="/novelbug_bounce.gif"
								alt="NovelBug Logo"
								width={70}
								height={70}
								className="sm:w-18 sm:h-18 drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
								style={{
									mixBlendMode: 'multiply',
								}}
								unoptimized
							/>
							<span className="text-xl sm:text-2xl font-serif font-light text-slate-900 dark:text-slate-50 tracking-tight">
								NovelBug
							</span>
						</Link>
						<p className="text-slate-600 dark:text-slate-400 max-w-md mb-4 sm:mb-6 font-sans font-light leading-relaxed text-sm sm:text-[15px] tracking-wide">
							Turn Knowledge into Bedtime Stories. Every lesson,
							concept, or curiosity becomes a magical bedtime
							adventure.
						</p>
						<p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500 flex items-center gap-2 font-sans font-light tracking-wide">
							Made with{' '}
							<Heart className="size-3 sm:size-4 text-amber-600/70 dark:text-amber-500/70" />{' '}
							for curious minds
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="font-sans font-light text-slate-900 dark:text-slate-50 mb-5 text-[15px] tracking-wide uppercase">
							Quick Links
						</h3>
						<ul className="space-y-3">
							<li>
								<Link
									href="/"
									className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors font-sans font-light text-[14px] tracking-wide"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									href="/stories"
									className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors font-sans font-light text-[14px] tracking-wide"
								>
									Stories
								</Link>
							</li>
							<li>
								<Link
									href="/about"
									className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors font-sans font-light text-[14px] tracking-wide"
								>
									About
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3 className="font-sans font-light text-slate-900 dark:text-slate-50 mb-5 text-[15px] tracking-wide uppercase">
							Contact
						</h3>
						<ul className="space-y-3">
							<li>
								<Link
									href="/contact"
									className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors font-sans font-light text-[14px] tracking-wide"
								>
									Get in Touch
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors font-sans font-light text-[14px] tracking-wide"
								>
									FAQ
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Copyright */}
				<div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200/40 dark:border-slate-800/40 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-500 font-sans font-light tracking-wide">
					<p>
						© {new Date().getFullYear()} NoirDoor, Inc. All rights
						reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
