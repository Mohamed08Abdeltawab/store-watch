import "./globals.css";
import { CartProvider } from "./context/CartContext";
import ClientStoreWrapper from "./components/ClientStoreWrapper";

export const metadata = {
  title: "Ben10 | متجر الساعات الفاخرة والعصرية بضمان الوكيل المعتمد",
  description: "متجر Ben10 المتخصص حصرياً في بيع الساعات الرجالية والحريمية والرياضية والذكية. منتجات أصلية 100%، معاينة وفحص قبل الدفع، شحن سريع لجميع المحافظات.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23A3E635'><circle cx='12' cy='12' r='9' stroke='%23101211' stroke-width='2'/><polyline points='12 7 12 12 15 14' stroke='%23101211' stroke-width='2'/></svg>"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-[#f8faf8] text-[#131715] font-sans antialiased selection:bg-lime-400 selection:text-black overflow-x-hidden">
        <CartProvider>
          <ClientStoreWrapper>
            {children}
          </ClientStoreWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
