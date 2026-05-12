"use client";

import { useState } from "react";
import { CommandLineIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function TerminalOverlay() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="Access the web terminal"
      >
        <CommandLineIcon className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative w-full max-w-4xl h-[80vh] bg-black rounded-lg shadow-2xl overflow-hidden">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 z-10 bg-gray-800 text-white p-1 rounded hover:bg-gray-600 transition-colors"
              title="Close terminal"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            <iframe
              src="/terminal/index.html"
              className="w-full h-full border-0"
              title="Web Terminal"
            />
          </div>
        </div>
      )}
    </>
  );
}
