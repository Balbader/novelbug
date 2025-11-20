import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, email, subject, message } = body;

		// Validate required fields
		if (!name || !email || !subject || !message) {
			return NextResponse.json(
				{ error: 'All fields are required' },
				{ status: 400 },
			);
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: 'Invalid email address' },
				{ status: 400 },
			);
		}

		// Sanitize inputs to prevent injection
		const sanitize = (str: string) => str.replace(/[<>]/g, '');

		const sanitizedName = sanitize(name);
		const sanitizedEmail = sanitize(email);
		const sanitizedSubject = sanitize(subject);
		const sanitizedMessage = sanitize(message);

		// Create email content
		const emailContent = `
New Contact Form Submission

From: ${sanitizedName}
Email: ${sanitizedEmail}
Subject: ${sanitizedSubject}

Message:
${sanitizedMessage}

---
This message was sent from the NovelBug contact form.
		`.trim();

		// Send email using Resend
		// If RESEND_API_KEY is not set, we'll log and return success for development
		if (process.env.RESEND_API_KEY) {
			try {
				await resend.emails.send({
					from: 'NovelBug Contact Form <hello@novelbug.com>', // You'll need to verify your domain with Resend
					to: 'hello@novelbug.com',
					replyTo: sanitizedEmail,
					subject: `Contact Form: ${sanitizedSubject}`,
					text: emailContent,
					html: `
						<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
							<h2 style="color: #D97D55; margin-bottom: 20px;">New Contact Form Submission</h2>
							<div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
								<p style="margin: 10px 0;"><strong>From:</strong> ${sanitizedName}</p>
								<p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></p>
								<p style="margin: 10px 0;"><strong>Subject:</strong> ${sanitizedSubject}</p>
							</div>
							<div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #D97D55; margin-bottom: 20px;">
								<p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
								<p style="white-space: pre-wrap; line-height: 1.6;">${sanitizedMessage.replace(/\n/g, '<br>')}</p>
							</div>
							<p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
								This message was sent from the NovelBug contact form.
							</p>
						</div>
					`,
				});
			} catch (emailError) {
				console.error('Error sending email via Resend:', emailError);
				// Log the submission for manual processing
				console.log('Contact form submission (email failed):', {
					name: sanitizedName,
					email: sanitizedEmail,
					subject: sanitizedSubject,
					message: sanitizedMessage,
				});
				// Still return success to user, but log the error
			}
		} else {
			// Development mode: log the submission
			console.log('Contact form submission (RESEND_API_KEY not set):', {
				name: sanitizedName,
				email: sanitizedEmail,
				subject: sanitizedSubject,
				message: sanitizedMessage,
			});
		}

		return NextResponse.json(
			{
				success: true,
				message:
					'Your message has been received. We will get back to you soon!',
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error processing contact form:', error);
		return NextResponse.json(
			{
				error: 'Failed to send message. Please try again later.',
			},
			{ status: 500 },
		);
	}
}
