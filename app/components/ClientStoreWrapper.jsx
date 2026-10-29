"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import CheckoutModal from "./CheckoutModal";
import QuickViewModal from "./QuickViewModal";
import SearchModal from "./SearchModal";
import ToastContainer from "./ToastContainer";

export default function ClientStoreWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
      <CartDrawer />
      <CheckoutModal />
      <QuickViewModal />
      <SearchModal />
      <ToastContainer />
    </>
  );
}
