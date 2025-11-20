export function QuoteSection() {
	return (
		<section className="py-16 px-4 bg-gradient-to-r from-purple-100/50 via-pink-100/50 to-purple-100/50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-purple-950/30">
			<div className="container mx-auto max-w-4xl text-center">
				<blockquote className="text-2xl md:text-3xl lg:text-4xl font-light italic text-slate-700 dark:text-slate-200 leading-relaxed">
					Because knowledge should feel like{' '}
					<span className="font-semibold text-purple-600 dark:text-purple-400">
						wonder
					</span>
					<br />
					and bedtime is the perfect place to{' '}
					<span className="font-semibold text-pink-600 dark:text-pink-400">
						plant it
					</span>
					.
				</blockquote>
			</div>
		</section>
	);
}
