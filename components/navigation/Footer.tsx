import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Footer() {
	return (
		<footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
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
							/>
							<span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
								NovelBug
							</span>
						</Link>
						<p className="text-slate-600 dark:text-slate-400 max-w-md mb-4">
							Turn Knowledge into Bedtime Stories. Every lesson,
							concept, or curiosity becomes a magical bedtime
							adventure.
						</p>
						<p className="text-sm text-slate-500 dark:text-slate-500 flex items-center gap-2">
							Made with <Heart className="size-4 text-pink-500" />{' '}
							for curious minds
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">
							Quick Links
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/"
									className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									href="/stories"
									className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
								>
									Stories
								</Link>
							</li>
							<li>
								<Link
									href="/about"
									className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
								>
									About
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">
							Contact
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/contact"
									className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
								>
									Get in Touch
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
								>
									FAQ
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Copyright */}
				<div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-500">
					<p>
						© {new Date().getFullYear()} NovelBug. All rights
						reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
