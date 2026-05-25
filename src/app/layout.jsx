import './globals.css';
 
export const metadata = {
  title: 'CDC Schedule',
  description: 'Eglin AFB Child Development Center — Employee Schedule App',
};
 
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
 