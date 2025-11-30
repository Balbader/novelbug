import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Resend } from 'resend';
import { usersService } from '@/backend/services/user.service';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { type, message, email, name } = body;

		// Validate required fields
		if (!type || !message) {
			return NextResponse.json(
				{ error: 'Type and message are required' },
				{ status: 400 },
			);
		}

		// Validate feedback type
		const validTypes = ['bug', 'feature', 'general', 'other'];
		if (!validTypes.includes(type)) {
			return NextResponse.json(
				{ error: 'Invalid feedback type' },
				{ status: 400 },
			);
		}

		// Validate message length
		if (message.length < 10) {
			return NextResponse.json(
				{ error: 'Message must be at least 10 characters' },
				{ status: 400 },
			);
		}

		if (message.length > 2000) {
			return NextResponse.json(
				{ error: 'Message must be less than 2000 characters' },
				{ status: 400 },
			);
		}

		// Get user info if authenticated
		let userEmail = email;
		let userName = name;
		let userUsername = '';

		try {
			const { getUser, isAuthenticated } = await getKindeServerSession();
			const user = await getUser();
			const isUserAuthenticated = await isAuthenticated();

			if (isUserAuthenticated && user) {
				const dbUser = await usersService.getByKindeId(user.id);
				if (dbUser) {
					userEmail = userEmail || dbUser.email || user.email || '';
					userName =
						userName ||
						`${dbUser.first_name} ${dbUser.last_name}`.trim() ||
						user.given_name ||
						'';
					userUsername = dbUser.username || '';
				}
			}
		} catch (authError) {
			// If auth fails, continue with provided email/name
			console.log('Auth check failed, using provided info');
		}

		// Validate email if provided
		if (userEmail) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(userEmail)) {
				return NextResponse.json(
					{ error: 'Invalid email address' },
					{ status: 400 },
				);
			}
		}

		// Sanitize inputs to prevent injection
		const sanitize = (str: string) => str.replace(/[<>]/g, '');

		const sanitizedName = sanitize(userName || 'Anonymous User');
		const sanitizedEmail = sanitize(userEmail || 'no-email@novelbug.com');
		const sanitizedType = sanitize(type);
		const sanitizedMessage = sanitize(message);

		// Create email content
		const typeLabels: Record<string, string> = {
			bug: 'Bug Report',
			feature: 'Feature Request',
			general: 'General Feedback',
			other: 'Other Feedback',
		};

		const emailContent = `
New Feedback Submission

Type: ${typeLabels[sanitizedType] || sanitizedType}
From: ${sanitizedName}${userUsername ? ` (@${userUsername})` : ''}
Email: ${sanitizedEmail}

Message:
${sanitizedMessage}

---
This feedback was sent from the NovelBug feedback form.
		`.trim();

		// Send email using Resend
		if (process.env.RESEND_API_KEY) {
			try {
				await resend.emails.send({
					from: 'NovelBug Feedback <hello@novelbug.com>',
					to: 'hello@novelbug.com',
					replyTo: sanitizedEmail,
					subject: `Feedback: ${typeLabels[sanitizedType] || sanitizedType} - ${sanitizedName}`,
					text: emailContent,
					html: `
						<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
							<h2 style="color: #D97D55; margin-bottom: 20px;">New Feedback Submission</h2>
							<div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
								<p style="margin: 10px 0;"><strong>Type:</strong> <span style="background-color: #D97D55; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${typeLabels[sanitizedType] || sanitizedType}</span></p>
								<p style="margin: 10px 0;"><strong>From:</strong> ${sanitizedName}${userUsername ? ` <span style="color: #6b7280;">(@${userUsername})</span>` : ''}</p>
								<p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></p>
							</div>
							<div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #D97D55; margin-bottom: 20px;">
								<p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
								<p style="white-space: pre-wrap; line-height: 1.6;">${sanitizedMessage.replace(/\n/g, '<br>')}</p>
							</div>
							<p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
								This feedback was sent from the NovelBug feedback form.
							</p>
						</div>
					`,
				});
			} catch (emailError) {
				console.error('Error sending email via Resend:', emailError);
				console.log('Feedback submission (email failed):', {
					type: sanitizedType,
					name: sanitizedName,
					email: sanitizedEmail,
					username: userUsername,
					message: sanitizedMessage,
				});
			}
		} else {
			// Development mode: log the submission
			console.log('Feedback submission (RESEND_API_KEY not set):', {
				type: sanitizedType,
				name: sanitizedName,
				email: sanitizedEmail,
				username: userUsername,
				message: sanitizedMessage,
			});
		}

		return NextResponse.json(
			{
				success: true,
				message:
					'Thank you for your feedback! We appreciate you taking the time to help us improve.',
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error processing feedback form:', error);
		return NextResponse.json(
			{
				error: 'Failed to send feedback. Please try again later.',
			},
			{ status: 500 },
		);
	}
}
