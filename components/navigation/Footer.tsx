import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Footer() {
	return (
		<footer
			className="border-t border-slate-200/40 dark:border-slate-800/40 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-950 dark:to-slate-900/50"
			style={{
				boxShadow: '0 -1px 3px rgba(0, 0, 0, 0.03)',
			}}
		>
			<div className="container mx-auto max-w-7xl px-4 py-16">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-12">
					{/* Logo and Description */}
					<div className="col-span-1 md:col-span-2">
						<Link
							href="/"
							className="flex items-center gap-3 mb-6 group"
						>
							<Image
								src="/book.gif"
								alt="NovelBug Logo"
								width={48}
								height={48}
								className="drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
								style={{
									mixBlendMode: 'multiply',
								}}
							/>
							<span className="text-2xl font-serif font-light text-slate-900 dark:text-slate-50 tracking-tight">
								NovelBug
							</span>
						</Link>
						<p className="text-slate-600 dark:text-slate-400 max-w-md mb-6 font-sans font-light leading-relaxed text-[15px] tracking-wide">
							Turn Knowledge into Bedtime Stories. Every lesson,
							concept, or curiosity becomes a magical bedtime
							adventure.
						</p>
						<p className="text-sm text-slate-500 dark:text-slate-500 flex items-center gap-2 font-sans font-light tracking-wide">
							Made with{' '}
							<Heart className="size-4 text-amber-600/70 dark:text-amber-500/70" />{' '}
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
				<div className="mt-12 pt-8 border-t border-slate-200/40 dark:border-slate-800/40 text-center text-sm text-slate-500 dark:text-slate-500 font-sans font-light tracking-wide">
					<p>
						© {new Date().getFullYear()} NovelBug. All rights
						reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
