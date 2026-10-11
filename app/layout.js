import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata = {
  title: 'DSSA | Data Science Student Association VIT Pune',
  description: 'Where Data Meets Discovery - Official web portal for DSSA VIT Pune',
  icons: {
    icon: '/dssa-logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#000000] text-[#FFFFFF] min-h-screen flex flex-col antialiased selection:bg-[#FFFFFF] selection:text-[#000000]">
        <Navbar />
        <main className="flex-1 bg-[#000000]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
