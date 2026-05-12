import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import { CommandLineIcon } from "@heroicons/react/24/solid";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

function TerminalButton() {
  return (
    <a
      href="/terminal/index.html"
      className="fixed top-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
      title="Access the web terminal"
    >
      <CommandLineIcon className="h-5 w-5" />
    </a>
  );
}

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
        <TerminalButton />
        {children}
      </body>
    </html>
  );
}
