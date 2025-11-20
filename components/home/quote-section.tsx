export function QuoteSection() {
	return (
		<section className="py-16 px-4 bg-gradient-to-b from-amber-50 to-amber-100/50 dark:from-amber-950 dark:to-amber-900/30">
			<div className="container mx-auto max-w-4xl">
				{/* Book page container */}
				<div
					className="relative p-8 md:p-12 bg-amber-50/90 dark:bg-amber-950/90 backdrop-blur-sm mx-auto"
					style={{
						boxShadow: `
							inset 0 0 0 1px rgba(139, 69, 19, 0.2),
							0 4px 16px rgba(0, 0, 0, 0.1),
							inset 0 1px 0 rgba(255, 255, 255, 0.1)
						`,
						borderRadius: '2px',
					}}
				>
					{/* Decorative corner elements */}
					<div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-800/30 dark:border-amber-600/30" />
					<div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-800/30 dark:border-amber-600/30" />
					<div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-800/30 dark:border-amber-600/30" />
					<div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-800/30 dark:border-amber-600/30" />

					<blockquote className="text-2xl md:text-3xl lg:text-4xl font-serif font-light italic text-amber-900 dark:text-amber-100 leading-relaxed text-center">
						Because knowledge should feel like{' '}
						<span className="font-semibold text-amber-700 dark:text-amber-300">
							wonder
						</span>
						<br />
						and bedtime is the perfect place to{' '}
						<span className="font-semibold text-amber-700 dark:text-amber-300">
							plant it
						</span>
						.
					</blockquote>
				</div>
			</div>
		</section>
	);
}
