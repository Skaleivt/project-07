// app/layout.tsx
import './globals.css';
import { Header } from './components/Header/Header';

export const metadata = {
  title: 'Подорожники',
  description: 'Сайт подорожей — приклад з Figma',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>
        <Header isAuthenticated={false} />
        <main>{children}</main>
      </body>
    </html>
  );
}
