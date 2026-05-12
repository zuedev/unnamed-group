import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import TerminalOverlay from "@/components/TerminalOverlay";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata = {
  title: "174th Battle Group",
  description: "Vengeance Within Reach",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${firaCode.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TerminalOverlay />
        {children}
      </body>
    </html>
  );
}
