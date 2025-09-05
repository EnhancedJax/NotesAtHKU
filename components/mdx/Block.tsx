import { ChevronRight, Link } from "lucide-react";
import NextLink from "next/link";
import React from "react";

interface BlockProps {
  title: string;
  variant: string;
  children: React.ReactNode;
}

const ADMONITION_MAPPING = {
  tip: "primary",
  info: "secondary",
  note: "knowledge",
};

const STYLES = {
  primary: {
    body: "bg-green-50 dark:bg-green-800 border-r-green-200 border-b-green-200 border-l-green-600 dark:border-l-green-800",
    head: "bg-green-600 dark:bg-green-800",
  },
  secondary: {
    body: "bg-indigo-50 dark:bg-indigo-800 border-r-indigo-200 border-b-indigo-200 border-l-indigo-600 dark:border-indigo-800",
    head: "bg-indigo-600 dark:bg-indigo-800",
  },
  knowledge: {
    body: "bg-slate-50 dark:bg-slate-800 border-r-slate-200 border-b-slate-200 border-l-slate-600 dark:border-slate-800",
    head: "bg-slate-600 dark:bg-slate-800",
  },
  example: {
    body: "bg-gray-50 dark:bg-gray-800 border-r-gray-200 border-b-gray-200 border-l-gray-600 dark:border-gray-800",
    head: "bg-gray-600 dark:bg-gray-800",
  },
};

export default function Block({
  title = "",
  variant = "knowledge",
  children,
}: BlockProps) {
  if (variant === "eg") {
    // used as example inside block.
    return <CollapsibleExample title={title}>{children}</CollapsibleExample>;
  }

  const activeVariant: keyof typeof STYLES =
    variant in STYLES
      ? (variant as keyof typeof STYLES)
      : (variant as keyof typeof ADMONITION_MAPPING) in ADMONITION_MAPPING
      ? (ADMONITION_MAPPING[
          variant as keyof typeof ADMONITION_MAPPING
        ] as keyof typeof STYLES)
      : "knowledge";
  const href_id = title.replace(/\s+/g, "-").toLowerCase();

  return (
    <div
      className={`relative mt-8 mb-6 ${STYLES[activeVariant].body} border-b border-r dark:border-b-0 dark:border-r-0 border-l-4 dark:bg-opacity-50`}
    >
      <div
        className={`${STYLES[activeVariant].head} flex items-center w-fit max-w-full px-2 py-1 overflow-x-auto whitespace-nowrap`}
      >
        <h4
          className="w-full m-0 mr-2 text-base font-bold text-white "
          id={href_id}
        >
          {title}
        </h4>
        <NextLink href={`#${href_id}`}>
          <Link size={16} className="text-white opacity-50" />
        </NextLink>
      </div>
      <div className="px-3 pb-1 -mt-2">{children}</div>
    </div>
  );
}
function CollapsibleExample({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="my-2 group">
      <summary className="flex items-center cursor-pointer">
        <ChevronRight
          size={16}
          className="mr-2 transition-transform group-open:rotate-90"
        />
        <span className="mr-2">{title}</span>
        <div className="flex-grow border-t border-fd-foreground" />
      </summary>
      <div className="mt-2">{children}</div>
    </details>
  );
}
