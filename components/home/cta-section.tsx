import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export function CTASection() {
	return (
		<section className="py-24 px-4 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600">
			<div className="container mx-auto max-w-4xl text-center">
				<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
					NovelBug: Turn Knowledge into Bedtime Stories.
				</h2>
				<p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
					Start creating magical learning experiences tonight
				</p>
				<Button
					size="lg"
					className="text-lg px-8 py-6 bg-white text-purple-600 hover:bg-purple-50 shadow-xl"
				>
					<BookOpen className="size-5 mr-2" />
					Begin Your Journey
				</Button>
			</div>
		</section>
	);
}
