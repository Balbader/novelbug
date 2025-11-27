'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
	FileText,
	Scale,
	AlertCircle,
	Shield,
	Mail,
	Calendar,
	XCircle,
	CheckCircle,
} from 'lucide-react';

export function Terms() {
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
							<Scale
								className="size-8 sm:size-10"
								style={{ color: '#D97D55' }}
							/>
						</div>
					</div>
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 sm:mb-5 text-black dark:text-white tracking-tight px-2 sm:px-0">
						Terms of Service
					</h1>
					<p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans font-light tracking-wide px-4 sm:px-0">
						Please read these terms carefully before using NovelBug.
						By using our service, you agree to be bound by these
						terms.
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
								Welcome to NovelBug. These Terms of Service
								("Terms") govern your access to and use of
								NovelBug's website, services, and applications
								(collectively, the "Service") operated by
								NoirDoor, Inc. ("we," "us," or "our").
							</p>
							<p>
								By accessing or using our Service, you agree to
								be bound by these Terms. If you disagree with
								any part of these Terms, then you may not access
								the Service.
							</p>
							<p>
								These Terms apply to all visitors, users, and
								others who access or use the Service. Your use
								of the Service is also subject to our Privacy
								Policy, which is incorporated into these Terms
								by reference.
							</p>
						</div>
					</section>

					{/* Acceptance of Terms */}
					<section className="space-y-4 sm:space-y-5">
						<div className="flex items-center gap-3 mb-4 sm:mb-5">
							<CheckCircle
								className="size-6 sm:size-7"
								style={{ color: '#D97D55' }}
							/>
							<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50">
								Acceptance of Terms
							</h2>
						</div>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								By creating an account, accessing, or using
								NovelBug, you acknowledge that you have read,
								understood, and agree to be bound by these Terms
								and our Privacy Policy. If you do not agree to
								these Terms, you must not use the Service.
							</p>
							<p>
								You must be at least 18 years old or have the
								consent of a parent or guardian to use our
								Service. If you are using NovelBug on behalf of
								a minor, you represent and warrant that you are
								the parent or legal guardian of such minor and
								have the authority to agree to these Terms on
								their behalf.
							</p>
						</div>
					</section>

					{/* Description of Service */}
					<section className="space-y-4 sm:space-y-5">
						<div className="flex items-center gap-3 mb-4 sm:mb-5">
							<FileText
								className="size-6 sm:size-7"
								style={{ color: '#D97D55' }}
							/>
							<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50">
								Description of Service
							</h2>
						</div>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								NovelBug is an AI-powered platform that
								transforms educational topics, concepts, and
								lessons into personalized bedtime stories for
								children. Our Service allows users to:
							</p>
							<ul className="list-disc list-inside space-y-3 ml-4">
								<li>
									Generate customized bedtime stories based on
									educational topics
								</li>
								<li>
									Save and access previously generated stories
								</li>
								<li>
									Customize story parameters such as age,
									tone, and length
								</li>
								<li>Download stories in various formats</li>
								<li>
									Access community features and shared stories
								</li>
							</ul>
							<p>
								We reserve the right to modify, suspend, or
								discontinue any part of the Service at any time,
								with or without notice, for any reason.
							</p>
						</div>
					</section>

					{/* User Accounts */}
					<section className="space-y-4 sm:space-y-5">
						<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-4 sm:mb-5">
							User Accounts
						</h2>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p className="font-normal text-slate-900 dark:text-slate-50">
								To access certain features of the Service, you
								must create an account. When creating an
								account, you agree to:
							</p>
							<ul className="list-disc list-inside space-y-3 ml-4">
								<li>
									Provide accurate, current, and complete
									information about yourself
								</li>
								<li>
									Maintain and promptly update your account
									information to keep it accurate, current,
									and complete
								</li>
								<li>
									Maintain the security of your password and
									identification
								</li>
								<li>
									Accept all responsibility for all activities
									that occur under your account
								</li>
								<li>
									Notify us immediately of any unauthorized
									use of your account or any other breach of
									security
								</li>
							</ul>
							<p>
								You are responsible for safeguarding the
								password and for all activities that occur under
								your account. We are not liable for any loss or
								damage arising from your failure to comply with
								this section.
							</p>
						</div>
					</section>

					{/* Acceptable Use */}
					<section className="space-y-4 sm:space-y-5">
						<div className="flex items-center gap-3 mb-4 sm:mb-5">
							<Shield
								className="size-6 sm:size-7"
								style={{ color: '#D97D55' }}
							/>
							<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50">
								Acceptable Use
							</h2>
						</div>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>You agree not to use the Service to:</p>
							<ul className="list-disc list-inside space-y-3 ml-4">
								<li>
									Violate any applicable local, state,
									national, or international law or regulation
								</li>
								<li>
									Transmit any material that is abusive,
									harassing, defamatory, vulgar, obscene, or
									otherwise objectionable
								</li>
								<li>
									Generate content that promotes violence,
									discrimination, or illegal activities
								</li>
								<li>
									Impersonate any person or entity or falsely
									state or otherwise misrepresent your
									affiliation with a person or entity
								</li>
								<li>
									Interfere with or disrupt the Service or
									servers or networks connected to the Service
								</li>
								<li>
									Attempt to gain unauthorized access to the
									Service, other accounts, computer systems,
									or networks connected to the Service
								</li>
								<li>
									Use any robot, spider, or other automatic
									device to access the Service for any purpose
									without our express written permission
								</li>
								<li>
									Reproduce, duplicate, copy, sell, resell, or
									exploit any portion of the Service without
									our express written permission
								</li>
							</ul>
							<p>
								We reserve the right to terminate or suspend
								your account and access to the Service
								immediately, without prior notice, for any
								violation of these Terms.
							</p>
						</div>
					</section>

					{/* Intellectual Property */}
					<section className="space-y-4 sm:space-y-5">
						<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-4 sm:mb-5">
							Intellectual Property Rights
						</h2>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p className="font-normal text-slate-900 dark:text-slate-50">
								Service Content:
							</p>
							<p>
								The Service and its original content, features,
								and functionality are owned by NoirDoor, Inc.
								and are protected by international copyright,
								trademark, patent, trade secret, and other
								intellectual property laws.
							</p>
							<p className="font-normal text-slate-900 dark:text-slate-50 pt-2">
								User-Generated Content:
							</p>
							<p>
								You retain ownership of any content you create
								using the Service, including stories you
								generate. By using the Service, you grant us a
								worldwide, non-exclusive, royalty-free license
								to use, store, and display your content solely
								for the purpose of providing and improving the
								Service.
							</p>
							<p>
								You represent and warrant that you own or have
								the necessary rights to all content you submit
								to the Service and that such content does not
								violate any third-party rights.
							</p>
						</div>
					</section>

					{/* Subscription and Payment */}
					<section className="space-y-4 sm:space-y-5">
						<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-4 sm:mb-5">
							Subscription and Payment
						</h2>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								NovelBug is currently in beta and is available
								free of charge. We may introduce paid
								subscription plans in the future. If we do:
							</p>
							<ul className="list-disc list-inside space-y-3 ml-4">
								<li>
									Subscription fees will be clearly displayed
									before you commit to a subscription
								</li>
								<li>
									Subscriptions will automatically renew
									unless cancelled before the renewal date
								</li>
								<li>
									You may cancel your subscription at any time
									through your account settings
								</li>
								<li>
									Refunds will be handled in accordance with
									our refund policy, which will be provided at
									the time of purchase
								</li>
								<li>
									We reserve the right to change our pricing
									with reasonable notice to existing
									subscribers
								</li>
							</ul>
							<p>
								All payments are processed through secure
								third-party payment processors. You agree to
								provide accurate payment information and
								authorize us to charge your payment method for
								all fees.
							</p>
						</div>
					</section>

					{/* Disclaimers */}
					<section className="space-y-4 sm:space-y-5">
						<div className="flex items-center gap-3 mb-4 sm:mb-5">
							<AlertCircle
								className="size-6 sm:size-7"
								style={{ color: '#D97D55' }}
							/>
							<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50">
								Disclaimers
							</h2>
						</div>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								THE SERVICE IS PROVIDED "AS IS" AND "AS
								AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
								EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT
								LIMITED TO, IMPLIED WARRANTIES OF
								MERCHANTABILITY, FITNESS FOR A PARTICULAR
								PURPOSE, OR NON-INFRINGEMENT.
							</p>
							<p>
								We do not warrant that the Service will be
								uninterrupted, secure, or error-free, or that
								defects will be corrected. We do not warrant or
								make any representations regarding the use or
								the results of the use of the Service in terms
								of correctness, accuracy, reliability, or
								otherwise.
							</p>
							<p>
								The stories generated by our Service are created
								using AI technology and may contain inaccuracies
								or errors. We do not guarantee the accuracy,
								completeness, or suitability of any generated
								content. You are responsible for reviewing and
								verifying any content before use.
							</p>
						</div>
					</section>

					{/* Limitation of Liability */}
					<section className="space-y-4 sm:space-y-5">
						<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-4 sm:mb-5">
							Limitation of Liability
						</h2>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE
								LAW, IN NO EVENT SHALL NOIRDOOR, INC., ITS
								AFFILIATES, AGENTS, DIRECTORS, EMPLOYEES,
								SUPPLIERS, OR LICENSORS BE LIABLE FOR ANY
								INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL,
								CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING
								WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS,
								GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES,
								ARISING OUT OF OR RELATING TO THE USE OF, OR
								INABILITY TO USE, THE SERVICE.
							</p>
							<p>
								TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE
								LAW, NOIRDOOR, INC. ASSUMES NO LIABILITY OR
								RESPONSIBILITY FOR ANY ERRORS, MISTAKES, OR
								INACCURACIES OF CONTENT; PERSONAL INJURY OR
								PROPERTY DAMAGE RESULTING FROM YOUR ACCESS TO OR
								USE OF THE SERVICE; ANY UNAUTHORIZED ACCESS TO
								OR USE OF OUR SERVERS AND/OR ANY PERSONAL
								INFORMATION STORED THEREIN.
							</p>
							<p>
								IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR
								ALL DAMAGES EXCEED THE AMOUNT YOU PAID US IN THE
								TWELVE (12) MONTHS PRIOR TO THE ACTION GIVING
								RISE TO THE LIABILITY, OR ONE HUNDRED DOLLARS
								($100), WHICHEVER IS GREATER.
							</p>
						</div>
					</section>

					{/* Indemnification */}
					<section className="space-y-4 sm:space-y-5">
						<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-4 sm:mb-5">
							Indemnification
						</h2>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								You agree to defend, indemnify, and hold
								harmless NoirDoor, Inc. and its affiliates,
								officers, directors, employees, and agents from
								and against any claims, liabilities, damages,
								losses, and expenses, including without
								limitation reasonable legal and accounting fees,
								arising out of or in any way connected with your
								access to or use of the Service, your violation
								of these Terms, or your violation of any rights
								of another.
							</p>
						</div>
					</section>

					{/* Termination */}
					<section className="space-y-4 sm:space-y-5">
						<div className="flex items-center gap-3 mb-4 sm:mb-5">
							<XCircle
								className="size-6 sm:size-7"
								style={{ color: '#D97D55' }}
							/>
							<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50">
								Termination
							</h2>
						</div>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								We may terminate or suspend your account and
								access to the Service immediately, without prior
								notice or liability, for any reason whatsoever,
								including without limitation if you breach the
								Terms.
							</p>
							<p>
								Upon termination, your right to use the Service
								will immediately cease. If you wish to terminate
								your account, you may simply discontinue using
								the Service or contact us to delete your
								account.
							</p>
							<p>
								All provisions of the Terms which by their
								nature should survive termination shall survive
								termination, including, without limitation,
								ownership provisions, warranty disclaimers,
								indemnity, and limitations of liability.
							</p>
						</div>
					</section>

					{/* Governing Law */}
					<section className="space-y-4 sm:space-y-5">
						<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-4 sm:mb-5">
							Governing Law
						</h2>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								These Terms shall be interpreted and governed by
								the laws of the United States and the state in
								which NoirDoor, Inc. is incorporated, without
								regard to its conflict of law provisions.
							</p>
							<p>
								Our failure to enforce any right or provision of
								these Terms will not be considered a waiver of
								those rights. If any provision of these Terms is
								held to be invalid or unenforceable by a court,
								the remaining provisions of these Terms will
								remain in effect.
							</p>
						</div>
					</section>

					{/* Changes to Terms */}
					<section className="space-y-4 sm:space-y-5">
						<h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-4 sm:mb-5">
							Changes to Terms
						</h2>
						<div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-light tracking-wide">
							<p>
								We reserve the right, at our sole discretion, to
								modify or replace these Terms at any time. If a
								revision is material, we will try to provide at
								least 30 days notice prior to any new terms
								taking effect.
							</p>
							<p>
								What constitutes a material change will be
								determined at our sole discretion. By continuing
								to access or use our Service after any revisions
								become effective, you agree to be bound by the
								revised terms. If you do not agree to the new
								terms, you are no longer authorized to use the
								Service.
							</p>
						</div>
					</section>

					{/* Contact Information */}
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
								If you have any questions about these Terms of
								Service, please contact us:
							</p>
							<div className="space-y-2 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
								<p>
									<strong className="font-normal text-slate-900 dark:text-slate-50">
										Email:
									</strong>{' '}
									<a
										href="mailto:legal@novelbug.com"
										className="text-[#D97D55] hover:text-[#C86A45] transition-colors underline underline-offset-2"
									>
										legal@novelbug.com
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
