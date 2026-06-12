"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLinkStatus } from "next/link";

// Global top progress bar. Rendered INSIDE a <Link>, it reads that link's
// navigation status via useLinkStatus and, while the navigation is pending,
// portals a thin animated bar to the very top of the viewport. Only the clicked
// link is ever pending, so at most one bar shows. It gives instant "the page is
// loading" feedback for dynamic (server-rendered) routes where the click would
// otherwise look like nothing happened.
export function NavProgressBar() {
  const { pending } = useLinkStatus();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !pending) return null;

  return createPortal(<ProgressBar />, document.body);
}

function ProgressBar() {
  // Grow from a small head to ~90% while pending; the page rendering (which
  // unmounts this bar) is the visual "complete".
  const [width, setWidth] = useState(8);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setWidth(90));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 bg-gold/15">
      <div
        className="h-full bg-gold shadow-[0_0_8px_#d6a83d] transition-[width] duration-700 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
