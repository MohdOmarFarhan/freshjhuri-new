"use client";

import { Header } from "./Header";
import { OffCanvasCart } from "../cart/OffCanvasCart";
import { Footer } from "./Footer";
import { AuthModal } from "../auth/AuthModal";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="pt-32 md:pt-40 min-h-[80vh]">{/* Spacer for double-tier fixed header */}
        {children}
      </div>
      <Footer />
      <OffCanvasCart />
      <AuthModal />
    </>
  );
}
