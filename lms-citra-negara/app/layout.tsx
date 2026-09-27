import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LMS SMK Citra Negara",
  description: "Learning Management System SMK Citra Negara",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
