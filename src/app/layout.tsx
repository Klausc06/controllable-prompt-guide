import "@/lib/prompt/init";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "可控提示词向导",
  description: "选择题式视频提示词生成框架"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
