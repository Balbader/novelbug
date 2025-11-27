'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Shield, Lock, Eye, FileText, Mail, Calendar } from 'lucide-react';

export function Privacy() {
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
							<Shield
								className="size-8 sm:size-10"
								style={{ color: '#D97D55' }}
							/>
						</div>
					</div>
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 sm:mb-5 text-black dark:text-white tracking-tight px-2 sm:px-0">
						Privacy Policy
					</h1>
					<p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans font-light tracking-wide px-4 sm:px-0">
						Your privacy is important to us. This policy explains
						how we collect, use, and protect your information.
					</p>
					<div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 text-sm sm:text-base text-slate-500 dark:text-slate-500">
						<Calendar className="size-4" />
						<span className="font-sans font-light">
							Last updated:{' '}
							{new Date().toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</span>
					</div>
				</div>

				{/* Content Sections */}
				<div
					ref={sectionsRef}
					className="space-y-16 sm:space-y-20 md:space-y-24"
				>
					{/* Introduction */}
					<section className="space-y-4 sm:space-y-5">
						<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-4 sm:mb-5">
							Introduction
						</h2>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								Welcome to NovelBug. We are committed to
								protecting your privacy and ensuring the
								security of your personal information. This
								Privacy Policy explains how we collect, use,
								disclose, and safeguard your information when
								you use our service.
							</p>
							<p>
								By using NovelBug, you agree to the collection
								and use of information in accordance with this
								policy. If you do not agree with our policies
								and practices, please do not use our service.
							</p>
						</div>
					</section>

					{/* Information We Collect */}
					<section className="space-y-4 sm:space-y-5">
						<div className="flex items-center gap-3 mb-4 sm:mb-5">
							<FileText
								className="size-6 sm:size-7"
								style={{ color: '#D97D55' }}
							/>
							<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50">
								Information We Collect
							</h2>
						</div>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p className="font-normal text-slate-900 dark:text-slate-50">
								We collect several types of information to
								provide and improve our service:
							</p>
							<ul className="list-disc list-inside space-y-3 ml-4">
								<li>
									<strong className="font-normal text-slate-900 dark:text-slate-50">
										Account Information:
									</strong>{' '}
									When you create an account, we collect your
									name, email address, and any other
									information you choose to provide.
								</li>
								<li>
									<strong className="font-normal text-slate-900 dark:text-slate-50">
										Story Content:
									</strong>{' '}
									We collect the stories you generate,
									including topics, preferences, and any
									customizations you make.
								</li>
								<li>
									<strong className="font-normal text-slate-900 dark:text-slate-50">
										Usage Data:
									</strong>{' '}
									We automatically collect information about
									how you interact with our service, including
									pages visited, features used, and time spent
									on the platform.
								</li>
								<li>
									<strong className="font-normal text-slate-900 dark:text-slate-50">
										Device Information:
									</strong>{' '}
									We may collect information about your
									device, including IP address, browser type,
									operating system, and device identifiers.
								</li>
								<li>
									<strong className="font-normal text-slate-900 dark:text-slate-50">
										Cookies and Tracking:
									</strong>{' '}
									We use cookies and similar tracking
									technologies to track activity on our
									service and hold certain information.
								</li>
							</ul>
						</div>
					</section>

					{/* How We Use Your Information */}
					<section className="space-y-4 sm:space-y-5">
						<div className="flex items-center gap-3 mb-4 sm:mb-5">
							<Eye
								className="size-6 sm:size-7"
								style={{ color: '#D97D55' }}
							/>
							<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50">
								How We Use Your Information
							</h2>
						</div>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								We use the information we collect for the
								following purposes:
							</p>
							<ul className="list-disc list-inside space-y-3 ml-4">
								<li>
									To provide, maintain, and improve our
									service
								</li>
								<li>
									To personalize your experience and deliver
									relevant content
								</li>
								<li>
									To process your requests and generate
									stories
								</li>
								<li>
									To communicate with you about your account
									and our service
								</li>
								<li>
									To send you updates, newsletters, and
									promotional materials (you can opt out at
									any time)
								</li>
								<li>
									To detect, prevent, and address technical
									issues
								</li>
								<li>
									To analyze usage patterns and improve our
									service
								</li>
								<li>
									To comply with legal obligations and protect
									our rights
								</li>
							</ul>
						</div>
					</section>

					{/* Data Sharing and Disclosure */}
					<section className="space-y-4 sm:space-y-5">
						<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-4 sm:mb-5">
							Data Sharing and Disclosure
						</h2>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								We do not sell your personal information. We may
								share your information only in the following
								circumstances:
							</p>
							<ul className="list-disc list-inside space-y-3 ml-4">
								<li>
									<strong className="font-normal text-slate-900 dark:text-slate-50">
										Service Providers:
									</strong>{' '}
									We may share information with third-party
									service providers who perform services on
									our behalf, such as hosting, analytics, and
									customer support.
								</li>
								<li>
									<strong className="font-normal text-slate-900 dark:text-slate-50">
										Legal Requirements:
									</strong>{' '}
									We may disclose information if required by
									law or in response to valid legal requests.
								</li>
								<li>
									<strong className="font-normal text-slate-900 dark:text-slate-50">
										Business Transfers:
									</strong>{' '}
									In the event of a merger, acquisition, or
									sale of assets, your information may be
									transferred as part of that transaction.
								</li>
								<li>
									<strong className="font-normal text-slate-900 dark:text-slate-50">
										With Your Consent:
									</strong>{' '}
									We may share your information with your
									explicit consent or at your direction.
								</li>
							</ul>
						</div>
					</section>

					{/* Data Security */}
					<section className="space-y-4 sm:space-y-5">
						<div className="flex items-center gap-3 mb-4 sm:mb-5">
							<Lock
								className="size-6 sm:size-7"
								style={{ color: '#D97D55' }}
							/>
							<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50">
								Data Security
							</h2>
						</div>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								We implement appropriate technical and
								organizational measures to protect your personal
								information against unauthorized access,
								alteration, disclosure, or destruction. However,
								no method of transmission over the Internet or
								electronic storage is 100% secure, and we cannot
								guarantee absolute security.
							</p>
							<p>
								We use industry-standard security practices,
								including encryption, secure authentication, and
								regular security assessments. Your account
								information is protected by a password, and we
								encourage you to use a strong, unique password.
							</p>
						</div>
					</section>

					{/* Your Rights and Choices */}
					<section className="space-y-4 sm:space-y-5">
						<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-4 sm:mb-5">
							Your Rights and Choices
						</h2>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								You have the following rights regarding your
								personal information:
							</p>
							<ul className="list-disc list-inside space-y-3 ml-4">
								<li>
									<strong className="font-normal text-slate-900 dark:text-slate-50">
										Access:
									</strong>{' '}
									You can request access to the personal
									information we hold about you.
								</li>
								<li>
									<strong className="font-normal text-slate-900 dark:text-slate-50">
										Correction:
									</strong>{' '}
									You can update or correct your personal
									information through your account settings.
								</li>
								<li>
									<strong className="font-normal text-slate-900 dark:text-slate-50">
										Deletion:
									</strong>{' '}
									You can request deletion of your account and
									associated data.
								</li>
								<li>
									<strong className="font-normal text-slate-900 dark:text-slate-50">
										Opt-Out:
									</strong>{' '}
									You can opt out of marketing communications
									at any time by clicking the unsubscribe link
									in our emails or adjusting your account
									preferences.
								</li>
								<li>
									<strong className="font-normal text-slate-900 dark:text-slate-50">
										Data Portability:
									</strong>{' '}
									You can request a copy of your data in a
									portable format.
								</li>
							</ul>
							<p>
								To exercise these rights, please contact us
								using the information provided in the Contact
								section below.
							</p>
						</div>
					</section>

					{/* Cookies and Tracking Technologies */}
					<section className="space-y-4 sm:space-y-5">
						<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-4 sm:mb-5">
							Cookies and Tracking Technologies
						</h2>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								We use cookies and similar tracking technologies
								to track activity on our service and store
								certain information. Cookies are small data
								files stored on your device that help us improve
								your experience.
							</p>
							<p>We use cookies for the following purposes:</p>
							<ul className="list-disc list-inside space-y-3 ml-4">
								<li>
									To remember your preferences and settings
								</li>
								<li>To analyze how you use our service</li>
								<li>
									To provide personalized content and features
								</li>
								<li>
									To maintain your session and authentication
									state
								</li>
							</ul>
							<p>
								You can instruct your browser to refuse all
								cookies or to indicate when a cookie is being
								sent. However, if you do not accept cookies, you
								may not be able to use some portions of our
								service.
							</p>
						</div>
					</section>

					{/* Children's Privacy */}
					<section className="space-y-4 sm:space-y-5">
						<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-4 sm:mb-5">
							Children's Privacy
						</h2>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								NovelBug is designed for use by parents and
								guardians to create stories for children. We do
								not knowingly collect personal information
								directly from children under the age of 13
								without parental consent.
							</p>
							<p>
								If you are a parent or guardian and believe your
								child has provided us with personal information,
								please contact us immediately. We will take
								steps to delete such information from our
								records.
							</p>
							<p>
								We comply with the Children's Online Privacy
								Protection Act (COPPA) and other applicable laws
								regarding children's privacy.
							</p>
						</div>
					</section>

					{/* Third-Party Services */}
					<section className="space-y-4 sm:space-y-5">
						<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-4 sm:mb-5">
							Third-Party Services
						</h2>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								Our service may contain links to third-party
								websites or services that are not owned or
								controlled by NovelBug. We have no control over,
								and assume no responsibility for, the privacy
								policies or practices of any third-party sites
								or services.
							</p>
							<p>
								We encourage you to review the privacy policy of
								every site you visit. This Privacy Policy
								applies only to information collected by
								NovelBug.
							</p>
						</div>
					</section>

					{/* International Data Transfers */}
					<section className="space-y-4 sm:space-y-5">
						<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-4 sm:mb-5">
							International Data Transfers
						</h2>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								Your information may be transferred to and
								maintained on computers located outside of your
								state, province, country, or other governmental
								jurisdiction where data protection laws may
								differ from those in your jurisdiction.
							</p>
							<p>
								If you are located outside the United States and
								choose to provide information to us, please note
								that we transfer the data to the United States
								and process it there. By using our service, you
								consent to the transfer of your information to
								the United States.
							</p>
						</div>
					</section>

					{/* Changes to This Privacy Policy */}
					<section className="space-y-4 sm:space-y-5">
						<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-4 sm:mb-5">
							Changes to This Privacy Policy
						</h2>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								We may update our Privacy Policy from time to
								time. We will notify you of any changes by
								posting the new Privacy Policy on this page and
								updating the "Last updated" date at the top of
								this policy.
							</p>
							<p>
								You are advised to review this Privacy Policy
								periodically for any changes. Changes to this
								Privacy Policy are effective when they are
								posted on this page.
							</p>
						</div>
					</section>

					{/* Contact Us */}
					<section className="space-y-4 sm:space-y-5 bg-gradient-to-br from-slate-50/80 to-white dark:from-slate-900/80 dark:to-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-8 sm:p-10 md:p-12">
						<div className="flex items-center gap-3 mb-4 sm:mb-5">
							<Mail
								className="size-6 sm:size-7"
								style={{ color: '#D97D55' }}
							/>
							<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50">
								Contact Us
							</h2>
						</div>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								If you have any questions about this Privacy
								Policy or our privacy practices, please contact
								us:
							</p>
							<div className="space-y-2 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
								<p>
									<strong className="font-normal text-slate-900 dark:text-slate-50">
										Email:
									</strong>{' '}
									<a
										href="mailto:privacy@novelbug.com"
										className="text-[#D97D55] hover:text-[#C86A45] transition-colors underline underline-offset-2"
									>
										privacy@novelbug.com
									</a>
								</p>
								<p>
									<strong className="font-normal text-slate-900 dark:text-slate-50">
										General Inquiries:
									</strong>{' '}
									<a
										href="mailto:hello@novelbug.com"
										className="text-[#D97D55] hover:text-[#C86A45] transition-colors underline underline-offset-2"
									>
										hello@novelbug.com
									</a>
								</p>
							</div>
							<p className="pt-2">
								We will respond to your inquiry as soon as
								possible, typically within 48 hours.
							</p>
						</div>
					</section>
				</div>
			</div>
		</section>
	);
}
