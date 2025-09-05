import CustomSearchDialog from "@/components/Search";
import getSortedFiles from "@/lib/getSortedFiles";
import { baseUrl, createMetadata } from "@/lib/metadata";
import { RootProvider } from "fumadocs-ui/provider";
import { GeistSans } from "geist/font/sans";
import "katex/dist/katex.css";
import type { ReactNode } from "react";
import "./global.css";

const font = GeistSans;

export const metadata = createMetadata({
  title: {
    template: "%s Notes@HKU",
    default: "NotesAtHKU",
  },
  description:
    "Notes at HKU is the home to hand-typed notes by students, for students.",
  metadataBase: baseUrl,
});

export default function Layout({ children }: { children: ReactNode }) {
  const sortedFiles = getSortedFiles();
  const tags = sortedFiles.map((file) => ({
    name: file.title,
    value: file.title,
    icon: file.icon,
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NotesAtHKU by Jax",
    alternateName: [
      "Notes@HKU",
      "NotesATHKU",
      "Notes at HKU by Jax",
      "Notes@HKU by Jax",
    ],
    url: "https://notes.jaxtam.dev",
  };

  return (
    <html lang="en" className={font.className} suppressHydrationWarning>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <body className="flex flex-col min-h-screen">
        <RootProvider
          search={{
            SearchDialog: CustomSearchDialog,
            options: {
              tags,
            },
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
