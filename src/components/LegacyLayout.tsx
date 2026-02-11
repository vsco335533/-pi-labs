import { Header } from './Layout/Header';
import { Footer } from './Layout/Footer';
import { BackButton } from './Common/BackButton';

export function LegacyLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <BackButton />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
