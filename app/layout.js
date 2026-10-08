import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata = {
  title: 'DSSA | Data Science Student Association VIT Pune',
  description: 'Official web portal for DSSA VIT Pune',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 bg-slate-950">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
