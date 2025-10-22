// src/app/layout.tsx
import React from 'react';
import './globals.css'; // optional global styles

export const metadata = {
  title: 'Real-Time Dashboard',
  description: 'A real-time dashboard app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
