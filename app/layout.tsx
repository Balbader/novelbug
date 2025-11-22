import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'NovelBug - Turn Knowledge into Bedtime Stories',
	description:
		'Welcome to NovelBug, where learning curls up under the covers. Every lesson, concept, or curiosity becomes a magical bedtime adventure.',
	icons: {
		icon: '/novelbug_bounce.gif',
		shortcut: '/novelbug_bounce.gif',
		apple: '/novelbug_bounce.gif',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Header />
				{children}
				<Footer />
				<Toaster />
			</body>
		</html>
	);
}
