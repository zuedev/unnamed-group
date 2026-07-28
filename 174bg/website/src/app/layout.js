import "./layout.css";

export const metadata = {
  title: "174th Battle Group - Star Citizen Military Organization",
  description: `The "Red Right Hand" of the UEE`,
  icons: {
    icon: "/images/logo/logo_icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
