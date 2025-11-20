import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Footer() {
	return (
		<footer
			className="border-t border-amber-200/50 dark:border-amber-800/50 bg-amber-50/95 dark:bg-amber-950/95"
			style={{
				boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.05)',
			}}
		>
			<div className="container mx-auto max-w-7xl px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Logo and Description */}
					<div className="col-span-1 md:col-span-2">
						<Link href="/" className="flex items-center gap-3 mb-4">
							<Image
								src="/book.gif"
								alt="NovelBug Logo"
								width={50}
								height={50}
								className="drop-shadow-lg"
								style={{
									mixBlendMode: 'multiply',
								}}
							/>
							<span className="text-2xl font-serif font-bold text-amber-900 dark:text-amber-100">
								NovelBug
							</span>
						</Link>
						<p className="text-amber-700 dark:text-amber-300 max-w-md mb-4 font-serif leading-relaxed">
							Turn Knowledge into Bedtime Stories. Every lesson,
							concept, or curiosity becomes a magical bedtime
							adventure.
						</p>
						<p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2 font-serif">
							Made with{' '}
							<Heart className="size-4 text-amber-700 dark:text-amber-300" />{' '}
							for curious minds
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="font-serif font-semibold text-amber-900 dark:text-amber-100 mb-4">
							Quick Links
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/"
									className="text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 transition-colors font-serif"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									href="/stories"
									className="text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 transition-colors font-serif"
								>
									Stories
								</Link>
							</li>
							<li>
								<Link
									href="/about"
									className="text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 transition-colors font-serif"
								>
									About
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3 className="font-serif font-semibold text-amber-900 dark:text-amber-100 mb-4">
							Contact
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/contact"
									className="text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 transition-colors font-serif"
								>
									Get in Touch
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 transition-colors font-serif"
								>
									FAQ
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Copyright */}
				<div className="mt-8 pt-8 border-t border-amber-200/50 dark:border-amber-800/50 text-center text-sm text-amber-600 dark:text-amber-400 font-serif">
					<p>
						© {new Date().getFullYear()} NovelBug. All rights
						reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
