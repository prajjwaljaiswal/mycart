import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import StoreProvider from "@/app/StoreProvider";
import { ThemeProvider } from "../lib/context/ThemeProvider";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "MyCart. - Shop smarter",
    description: "MyCart. - Shop smarter",
};

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${outfit.className} antialiased`}>
                    <StoreProvider>
                        <ThemeProvider>
                            <Toaster />
                            {children}
                        </ThemeProvider>
                    </StoreProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}