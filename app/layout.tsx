import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
    title: "Ferbflix - Film Management",
    description: "Netflix-style film management application",
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
            { url: '/favicon.png', sizes: '512x512', type: 'image/png' },
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi">
            <body className={inter.className} suppressHydrationWarning>{children}</body>
        </html>
    );
}
