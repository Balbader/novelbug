import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<Header />
			{children}
			<Footer />
		</div>
	);
}
