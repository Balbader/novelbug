'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Heart, Coffee, Sparkles, BookOpen, Users } from 'lucide-react';

export default function About() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const sectionsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (sectionsRef.current) {
			const sections = Array.from(
				sectionsRef.current.children,
			) as HTMLElement[];

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							gsap.fromTo(
								entry.target,
								{
									opacity: 0,
									y: 30,
								},
								{
									opacity: 1,
									y: 0,
									duration: 0.8,
									ease: 'power2.out',
								},
							);
							observer.unobserve(entry.target);
						}
					});
				},
				{ threshold: 0.1 },
			);

			sections.forEach((section) => observer.observe(section));

			return () => observer.disconnect();
		}
	}, []);

	return (
		<section
			ref={sectionRef}
			className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 min-h-screen"
		>
			<div className="container mx-auto max-w-4xl">
				{/* Header */}
				<div className="text-center mb-16 sm:mb-20 md:mb-24">
					<div className="flex justify-center mb-6 sm:mb-8">
						<div
							className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center border"
							style={{
								backgroundColor: '#F4E9D7',
								borderColor: 'rgba(217, 125, 85, 0.2)',
							}}
						>
							<BookOpen
								className="size-8 sm:size-10"
								style={{ color: '#D97D55' }}
							/>
						</div>
					</div>
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 sm:mb-5 text-black dark:text-black tracking-tight px-2 sm:px-0">
						About NovelBug
					</h1>
					<p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans font-light tracking-wide px-4 sm:px-0">
						The story behind turning knowledge into bedtime magic
					</p>
				</div>

				{/* Content Sections */}
				<div
					ref={sectionsRef}
					className="space-y-16 sm:space-y-20 md:space-y-24"
				>
					{/* The Origin Story */}
					<section className="space-y-4 sm:space-y-5">
						<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-4 sm:mb-5">
							The Origin Story
						</h2>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								NovelBug was born from a simple, beautiful
								moment: a parent trying to explain gravity to
								their curious child at bedtime. The textbook
								definition felt too cold, too distant. But when
								that same concept became a story about a little
								astronaut floating through space, something
								magical happened, the child's eyes lit up with
								wonder.
							</p>
							<p>
								That spark of curiosity, that moment when
								learning transforms into wonder, became our
								mission. We realized that bedtime wasn't just
								about sleep, it was the perfect time to plant
								seeds of knowledge. When children are relaxed,
								when their minds are open and their hearts are
								ready, that's when the most meaningful learning
								happens.
							</p>
							<p>
								So we set out to build something that would help
								every parent experience that magic. NovelBug is
								our answer: a way to turn any lesson, any
								concept, any curiosity into a story that doesn't
								just teach, it enchants.
							</p>
						</div>
					</section>

					{/* Our Mission */}
					<section className="space-y-4 sm:space-y-5">
						<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-4 sm:mb-5">
							Our Mission
						</h2>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								We believe that learning should feel like
								wonder. Not like work, not like a chore, but
								like discovering a secret about the world. Every
								child deserves to experience that spark of
								curiosity, that moment when a concept clicks and
								suddenly everything makes sense.
							</p>
							<p>
								Our mission is simple but profound: to make
								bedtime the perfect moment for planting
								curiosity. We envision a world where parents
								feel empowered to teach their children anything,
								from gravity to gratitude, from photosynthesis
								to friendship, through the power of
								storytelling.
							</p>
							<p>
								Long-term, we see NovelBug becoming a trusted
								companion for families everywhere. A place where
								learning and bedtime stories become one, where
								knowledge and magic dance together, and where
								every child goes to sleep a little wiser, a
								little more curious, and a little more connected
								to the world around them.
							</p>
						</div>
					</section>

					{/* The Problem We Solve */}
					<section className="space-y-4 sm:space-y-5">
						<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-4 sm:mb-5">
							The Problem We Solve
						</h2>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								Every parent knows the challenge: you want to
								teach your child something important, but how do
								you make it stick? How do you explain complex
								concepts in ways that spark curiosity instead of
								boredom? How do you turn "I have to learn this"
								into "I want to know more"?
							</p>
							<p>
								Traditional learning often feels disconnected
								from the magic of childhood. Textbooks are dry.
								Lectures are forgettable. But stories? Stories
								are how humans have passed down knowledge for
								thousands of years. Stories create emotional
								connections. Stories make abstract concepts
								tangible. Stories make learning feel like an
								adventure.
							</p>
							<p>
								NovelBug solves this by giving parents a tool
								that transforms any topic into a bedtime story.
								No more struggling to explain the water cycle or
								gratitude or the solar system in ways that
								resonate. With NovelBug, every lesson becomes a
								story, every concept becomes a character, and
								every bedtime becomes an opportunity for wonder.
							</p>
						</div>
					</section>

					{/* Why Stories Work */}
					<section className="space-y-4 sm:space-y-5">
						<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-4 sm:mb-5">
							Why Stories Are So Powerful
						</h2>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								Stories have a unique power: they bypass the
								analytical mind and speak directly to the heart.
								When a child hears about a brave little seed
								learning to grow, they're not just learning
								about photosynthesis, they're feeling the
								journey. They're rooting for the seed. They're
								invested.
							</p>
							<p>
								This emotional connection is what makes learning
								stick. When knowledge is wrapped in narrative,
								it becomes memorable. When concepts have
								characters and adventures, they become
								relatable. When lessons feel like stories, they
								become part of who the child is, not just what
								they know.
							</p>
							<p>
								Bedtime is the perfect moment for this magic.
								Children are relaxed, their defenses are down,
								and their imaginations are wide open. It's when
								they're most receptive to new ideas, most ready
								to wonder, most willing to learn. By combining
								the power of storytelling with this perfect
								moment, we create something extraordinary:
								learning that feels like love.
							</p>
						</div>
					</section>

					{/* A Small Team with Big Dreams */}
					<section className="space-y-4 sm:space-y-5">
						<div className="flex items-center gap-3 mb-4 sm:mb-5">
							<Users
								className="size-6 sm:size-7"
								style={{ color: '#D97D55' }}
							/>
							<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50">
								A Small Team with Big Dreams
							</h2>
						</div>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								NovelBug is built by a small, passionate team
								who genuinely believe in the positive impact of
								turning knowledge into bedtime stories. We're
								parents, educators, storytellers, and dreamers
								who have seen firsthand how stories can
								transform learning.
							</p>
							<p>
								We're not a big corporation. We don't have
								unlimited resources. What we have is something
								more valuable: genuine care for every family who
								uses NovelBug. Every story generated, every
								moment of wonder created, every bedtime made
								more meaningful, that's what drives us.
							</p>
							<p>
								Being a small startup means we move fast, listen
								closely, and care deeply. It means every feature
								we build, every improvement we make, comes from
								real families using NovelBug and sharing their
								experiences. We're building this together, one
								bedtime story at a time.
							</p>
						</div>
					</section>

					{/* Support Us */}
					<section className="space-y-4 sm:space-y-5 bg-gradient-to-br from-slate-50/80 to-white dark:from-slate-900/80 dark:to-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-8 sm:p-10 md:p-12">
						<div className="flex items-center gap-3 mb-4 sm:mb-5">
							<Heart
								className="size-6 sm:size-7"
								style={{ color: '#D97D55' }}
							/>
							<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50">
								Support Our Journey
							</h2>
						</div>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								NovelBug is currently in beta, and we're
								thrilled to offer it completely free during this
								phase. We genuinely believe in the positive
								impact it can have on families, and we want as
								many people as possible to experience the magic
								of turning knowledge into bedtime stories.
							</p>
							<p>
								As a small startup, every bit of support means
								the world to us. If NovelBug has brought wonder
								to your bedtime routine, if it's helped you
								teach your child something new, if it's made
								those quiet moments before sleep a little more
								magical, we'd be honored if you'd consider
								supporting our journey.
							</p>
							<p className="font-normal text-slate-900 dark:text-slate-50">
								You can support us in two ways:
							</p>
							<div className="flex flex-col sm:flex-row gap-4 pt-2">
								<Button
									size="lg"
									className="flex-1 font-sans font-light tracking-wide rounded-xl border-0"
									style={{
										backgroundColor: '#D97D55',
										color: 'white',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.backgroundColor =
											'#C86A45';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.backgroundColor =
											'#D97D55';
									}}
									asChild
								>
									<a
										href="https://buymeacoffee.com/novelbug"
										target="_blank"
										rel="noopener noreferrer"
									>
										<Coffee className="size-4 mr-2" />
										Buy Us a Coffee
									</a>
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="flex-1 font-sans font-light tracking-wide rounded-xl border-slate-300/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
									asChild
								>
									<a
										href="#membership"
										className="flex items-center justify-center"
									>
										<Sparkles className="size-4 mr-2" />
										$5/month Membership
									</a>
								</Button>
							</div>
							<p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 pt-2">
								Your support helps us keep improving the magic
								and bringing NovelBug to more families. Thank
								you for being part of our story. 🐛💛
							</p>
						</div>
					</section>

					{/* Looking Ahead */}
					<section className="space-y-4 sm:space-y-5">
						<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-4 sm:mb-5">
							Looking Ahead
						</h2>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								We're just getting started. NovelBug is in beta,
								which means we're learning, growing, and
								improving every single day. But we have big
								dreams for where this journey will take us.
							</p>
							<p>
								We envision a future where NovelBug becomes an
								essential part of bedtime routines around the
								world. Where parents feel empowered to teach
								their children anything through the power of
								story. Where every bedtime becomes an
								opportunity for wonder, connection, and
								learning.
							</p>
							<p>
								We're working on new features, better stories,
								and more ways to make learning magical. We're
								listening to your feedback, learning from your
								experiences, and building something that truly
								serves families. The future of NovelBug is
								bright, and we're so excited to share it with
								you.
							</p>
						</div>
					</section>

					{/* Thank You */}
					<section className="text-center space-y-4 sm:space-y-5 pt-8 sm:pt-12 border-t border-slate-200/60 dark:border-slate-800/60">
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide max-w-2xl mx-auto">
							<p className="text-xl sm:text-2xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-2">
								Thank You
							</p>
							<p>
								Thank you for being part of the NovelBug story.
								Thank you for trusting us with your bedtime
								moments. Thank you for believing that learning
								can be magical, that bedtime can be meaningful,
								and that stories can change everything.
							</p>
							<p>
								Whether you're here for the first time or you've
								been with us since the beginning, we're grateful
								you're here. Together, we're creating something
								beautiful: a world where knowledge and wonder
								dance together, where bedtime becomes a time of
								connection, and where every child goes to sleep
								a little wiser and a little more curious.
							</p>
							<p className="text-lg sm:text-xl font-serif font-normal text-slate-900 dark:text-slate-50 pt-2">
								Sweet dreams, and happy learning. 🐛✨
							</p>
						</div>
					</section>
				</div>
			</div>
		</section>
	);
}
