// app/layout.tsx
import { Cinzel, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata = {
  title: 'Dharma & Rashtra | Cultural Heritage & Nation Building',
  description: 'Reviving our heritage and strengthening national unity.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased bg-[#FFFDF9] text-slate-800">
        {children}
      </body>
    </html>
  );
}