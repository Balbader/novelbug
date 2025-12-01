'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqData = [
	{
		question: 'How does NovelBug work?',
		answer: 'NovelBug uses advanced AI to transform any topic, lesson, or concept into an engaging bedtime story. Simply choose what you want your child to learn, and our AI creates a personalized story with characters, adventures, and age-appropriate content that makes learning magical.',
	},
	{
		question: 'What topics can I turn into bedtime stories?',
		answer: 'Almost anything! From science concepts like the water cycle or photosynthesis, to historical events, emotional intelligence, values like kindness and empathy, math concepts, nature, space, animals, and more. If you want your child to learn about it, we can turn it into a story.',
	},
	{
		question: 'What age groups is NovelBug suitable for?',
		answer: "NovelBug is designed for children ages 3-12, with stories automatically adapted to be age-appropriate. Our AI considers vocabulary, complexity, and themes to ensure each story is perfect for your child's developmental stage.",
	},
	{
		question: 'How long are the stories?',
		answer: "Stories are typically 3-5 minutes when read aloud, making them perfect for bedtime. They're long enough to be engaging and educational, but short enough to keep your child's attention and ensure a peaceful bedtime routine.",
	},
	{
		question: 'Can I customize the stories?',
		answer: "Yes! You can specify the topic, add details about your child's interests, choose the tone (adventurous, gentle, funny), and even include characters your child loves. Our AI adapts to create the perfect story for your family.",
	},
	{
		question: 'Is the content safe and appropriate for children?',
		answer: 'Absolutely. All stories are carefully crafted to be age-appropriate, educational, and positive. We use content filters and safety guidelines to ensure every story promotes learning, creativity, and positive values. No scary or inappropriate content is ever included.',
	},
	{
		question: 'Can I save and revisit my stories?',
		answer: 'For the time being, you can download your stories in .pdf format by clicking the "Download Story" button on the story page. We are working on a feature to allow you to save and revisit your stories in your account.',
	},
	{
		question: 'Do I need any special equipment or apps?',
		answer: "No special equipment needed! NovelBug works on any device with a web browser, including your phone, tablet, or computer. Simply access our website, create your story, and read it to your child. It's that simple. We also offer a mobile app coming soon.",
	},
	{
		question: 'How much does NovelBug cost?',
		answer: 'NovelBug is currently in beta, and we genuinely believe in the positive impact it can have on families. That’s why the app is completely free to use during this phase, you can create unlimited bedtime stories and explore everything NovelBug has to offer.',
	},
	{
		question: 'What makes NovelBug different from other story apps?',
		answer: 'NovelBug is unique because it transforms YOUR chosen topics into stories. Instead of generic stories, you decide what your child learns about. Every story is personalized, educational, and designed to turn bedtime into a learning adventure that strengthens your bond with your child.',
	},
	{
		question: 'How quickly are stories generated?',
		answer: "Stories are typically ready in 1-3 minutes! Our AI works quickly to create your personalized bedtime story, so you can have it ready for tonight's bedtime routine.",
	},
];

export default function FAQ() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const accordionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (sectionRef.current && accordionRef.current) {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const items = Array.from(
								accordionRef.current?.children || [],
							) as HTMLElement[];

							gsap.fromTo(
								items,
								{
									opacity: 0,
									y: 20,
								},
								{
									opacity: 1,
									y: 0,
									duration: 0.6,
									stagger: 0.08,
									ease: 'power2.out',
								},
							);

							observer.unobserve(entry.target);
						}
					});
				},
				{ threshold: 0.1 },
			);

			observer.observe(sectionRef.current);

			return () => observer.disconnect();
		}
	}, []);

	return (
		<section
			ref={sectionRef}
			className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950"
		>
			<div className="container mx-auto max-w-4xl">
				{/* Header */}
				<div className="text-center mb-12 sm:mb-16 md:mb-20">
					<div className="flex justify-center mb-5 sm:mb-6">
						<div
							className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center border"
							style={{
								backgroundColor: '#F4E9D7',
								borderColor: 'rgba(217, 125, 85, 0.2)',
							}}
						>
							<HelpCircle
								className="size-8 sm:size-10"
								style={{ color: '#D97D55' }}
							/>
						</div>
					</div>
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light mb-4 sm:mb-5 text-slate-900 dark:text-slate-50 tracking-tight px-2 sm:px-0">
						Frequently Asked Questions
					</h2>
					<p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans font-light tracking-wide px-4 sm:px-0">
						Everything you need to know about turning knowledge into
						bedtime stories
					</p>
				</div>

				{/* FAQ Accordion */}
				<div ref={accordionRef} className="space-y-2 sm:space-y-3">
					<Accordion
						type="single"
						collapsible
						className="w-full space-y-2 sm:space-y-3"
					>
						{faqData.map((faq, index) => (
							<AccordionItem
								key={index}
								value={`item-${index}`}
								className="bg-gradient-to-br from-slate-50/80 to-white dark:from-slate-900/80 dark:to-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800/60 px-4 sm:px-6 transition-all duration-300 hover:border-slate-300/80 dark:hover:border-slate-700/80 hover:shadow-md"
							>
								<AccordionTrigger className="text-left font-serif font-normal text-base sm:text-lg text-slate-900 dark:text-slate-50 py-4 sm:py-5 hover:no-underline">
									{faq.question}
								</AccordionTrigger>
								<AccordionContent className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-light tracking-wide pb-4 sm:pb-5 pr-6 sm:pr-8 whitespace-pre-line">
									{faq.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>

				{/* Additional Help Text */}
				<div className="mt-12 sm:mt-16 text-center">
					<p className="text-sm sm:text-base text-slate-500 dark:text-slate-500 font-sans font-light tracking-wide">
						Still have questions?{' '}
						<a
							href="#contact"
							className="underline hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
							style={{ color: '#D97D55' }}
						>
							Contact us
						</a>
					</p>
				</div>
			</div>
		</section>
	);
}
