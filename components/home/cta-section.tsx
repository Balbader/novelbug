import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export function CTASection() {
	return (
		<section className="py-24 px-4 bg-gradient-to-b from-amber-100 to-amber-200/50 dark:from-amber-900 dark:to-amber-800/50">
			<div className="container mx-auto max-w-4xl">
				{/* Book page container */}
				<div
					className="relative p-8 md:p-12 bg-amber-50/95 dark:bg-amber-950/95 backdrop-blur-sm mx-auto text-center"
					style={{
						boxShadow: `
							inset 0 0 0 1px rgba(139, 69, 19, 0.2),
							0 8px 32px rgba(0, 0, 0, 0.15),
							inset 0 1px 0 rgba(255, 255, 255, 0.1)
						`,
						borderRadius: '2px',
					}}
				>
					{/* Decorative corner elements */}
					<div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-800/30 dark:border-amber-600/30" />
					<div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-800/30 dark:border-amber-600/30" />
					<div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-800/30 dark:border-amber-600/30" />
					<div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-800/30 dark:border-amber-600/30" />

					<h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-900 dark:text-amber-100 mb-6">
						NovelBug: Turn Knowledge into Bedtime Stories.
					</h2>
					<p className="text-xl text-amber-700 dark:text-amber-300 mb-8 max-w-2xl mx-auto font-serif">
						Start creating magical learning experiences tonight
					</p>
					<Button
						size="lg"
						className="text-lg px-8 py-6 bg-amber-700 hover:bg-amber-800 text-amber-50 shadow-xl font-serif border border-amber-800/50"
					>
						<BookOpen className="size-5 mr-2" />
						Begin Your Journey
					</Button>
				</div>
			</div>
		</section>
	);
}
