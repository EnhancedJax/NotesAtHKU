"use client";

import { useMode } from "@/app/layout.client";
import { useDocsSearch } from "fumadocs-core/search/client";
import { type ReactNode, useEffect, useState } from "react";
import {
  SearchDialog,
  type SharedProps,
  type TagItem,
  TagsList,
} from "./ui/search-dialog";

export interface CustomSearchDialogProps extends SharedProps {
  /**
   * @defaultValue 'fetch'
   */
  type?: "fetch" | "static";

  tags?: TagItem[];

  /**
   * Search API URL
   */
  api?: string;

  /**
   * The debounced delay for performing a search.
   */
  delayMs?: number;

  footer?: ReactNode;

  /**
   * Allow to clear tag filters
   *
   * @defaultValue false
   */
  allowClear?: boolean;
}

export default function CustomSearchDialog({
  tags,
  api,
  delayMs,
  type = "fetch",
  allowClear = false,
  ...props
}: CustomSearchDialogProps): ReactNode {
  const mode = useMode();
  const [tag, setTag] = useState<string | undefined>(mode || "");

  useEffect(() => {
    setTag(mode || "");
  }, [mode]);

  const { search, setSearch, query } = useDocsSearch(
    type === "fetch"
      ? {
          type: "fetch",
          api,
        }
      : {
          type: "static",
          from: api,
        },
    undefined,
    tag,
    delayMs
  );

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      results={query.data ?? []}
      {...props}
      footer={
        tags ? (
          <>
            <TagsList
              tag={tag}
              onTagChange={setTag}
              items={tags}
              allowClear={allowClear}
            />
            {props.footer}
          </>
        ) : (
          props.footer
        )
      }
    />
  );
}
