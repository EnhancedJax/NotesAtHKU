"use client";
import Icon from "@/components/Icon";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import type { SortedResult } from "fumadocs-core/server";
import { useSidebar } from "fumadocs-ui/provider";
import { FileText, Hash, Loader2, SearchIcon, Text } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export type SearchLink = [name: string, href: string];

type ReactSortedResult = Omit<SortedResult, "content"> & {
  content: ReactNode;
};

export interface SharedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Custom links to be displayed if search is empty
   */
  links?: SearchLink[];
}
type SearchDialogProps = SharedProps &
  SearchValueProps &
  Omit<SearchResultProps, "items"> & {
    results: ReactSortedResult[] | "empty";
    footer?: ReactNode;
  };
interface SearchValueProps {
  search: string;
  onSearchChange: (v: string) => void;
  isLoading?: boolean;
}
interface SearchResultProps {
  items: SortedResult[];
  hideResults?: boolean;
}

export function SearchDialog({
  open,
  onOpenChange,
  footer,
  links = [],
  search,
  onSearchChange,
  isLoading,
  ...props
}: SearchDialogProps) {
  const defaultItems = useMemo<ReactSortedResult[]>(
    () =>
      links.map(([name, link]) => ({
        type: "page",
        id: name,
        content: name,
        url: link,
      })),
    [links]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=closed]:animate-fd-fade-out data-[state=open]:animate-fd-fade-in" />
      <DialogContent
        aria-describedby={undefined}
        className="fixed left-1/2 top-[10vh] z-50 w-[98vw] max-w-screen-sm -translate-x-1/2 rounded-lg border bg-fd-popover text-fd-popover-foreground shadow-lg data-[state=closed]:animate-fd-dialog-out data-[state=open]:animate-fd-dialog-in"
      >
        <DialogTitle className="hidden">Search</DialogTitle>
        <div className="flex flex-row items-center gap-2 px-3">
          <LoadingIndicator isLoading={isLoading ?? false} />
          <input
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
            }}
            placeholder="Search"
            className="flex-1 w-0 py-3 text-base bg-transparent placeholder:text-fd-muted-foreground focus-visible:outline-none"
          />
          <button
            type="button"
            aria-label="Close Search"
            onClick={() => onOpenChange(false)}
            className={cn(
              "border hover:bg-fd-accent hover:text-fd-accent-foreground text-sx p-1.5"
            )}
          >
            Esc
          </button>
        </div>
        {props.results !== "empty" || defaultItems.length > 0 ? (
          <SearchResults
            items={props.results === "empty" ? defaultItems : props.results}
            onSelect={() => onOpenChange(false)}
          />
        ) : null}
        {footer ? (
          <div className="flex flex-col p-3 mt-auto border-t">{footer}</div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

const icons = {
  text: <Text className="size-4 text-fd-muted-foreground" />,
  heading: <Hash className="size-4 text-fd-muted-foreground" />,
  page: <FileText className="size-4 text-fd-muted-foreground" />,
};

function SearchResults({
  items,
  onSelect,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  items: ReactSortedResult[];
  onSelect?: (value: string) => void;
}) {
  const [active, setActive] = useState<string>();
  const router = useRouter();
  const sidebar = useSidebar();

  if (
    items.length > 0 &&
    (!active || items.every((item) => item.id !== active))
  ) {
    setActive(items[0].id);
  }

  const onOpen = (url: string) => {
    router.push(url);
    onSelect?.(url);
    sidebar.setOpen(false);
  };

  function onKey(e: KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key == "ArrowUp") {
      setActive((cur) => {
        const idx = items.findIndex((item) => item.id === cur);
        if (idx === -1) return items.at(0)?.id;

        return items.at(
          (e.key === "ArrowDown" ? idx + 1 : idx - 1) % items.length
        )?.id;
      });

      e.preventDefault();
    }

    if (e.key === "Enter") {
      const selected = items.find((item) => item.id === active);

      if (selected) onOpen(selected.url);
      e.preventDefault();
    }
  }

  const listenerRef = useRef(onKey);
  listenerRef.current = onKey;

  useEffect(() => {
    const listener = (e: KeyboardEvent) => listenerRef.current?.(e);

    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <div
      {...props}
      className={cn(
        "flex max-h-[460px] flex-col overflow-y-auto border-t p-2",
        props.className
      )}
    >
      {items.length === 0 ? (
        <div className="py-12 text-sm text-center">No results found</div>
      ) : null}

      {items.map((item) => (
        <CommandItem
          key={item.id}
          value={item.id}
          active={active}
          onActiveChange={setActive}
          onClick={() => {
            onOpen(item.url);
          }}
        >
          {item.type !== "page" ? (
            <div
              role="none"
              className="w-px h-full ms-2 min-h-10 bg-fd-border"
            />
          ) : null}
          {icons[item.type]}
          <p className="flex-1 w-0 truncate">{item.content}</p>
        </CommandItem>
      ))}
    </div>
  );
}

function LoadingIndicator({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="relative size-4">
      <Loader2
        className={cn(
          "absolute size-full animate-spin text-fd-primary transition-opacity",
          !isLoading && "opacity-0"
        )}
      />
      <SearchIcon
        className={cn(
          "absolute size-full text-fd-muted-foreground transition-opacity",
          isLoading && "opacity-0"
        )}
      />
    </div>
  );
}

function CommandItem({
  active,
  onActiveChange,
  value,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
  active?: string;
  onActiveChange: (value: string) => void;
}) {
  return (
    <button
      ref={useCallback(
        (element: HTMLButtonElement | null) => {
          if (active === value && element) {
            element.scrollIntoView({
              block: "nearest",
            });
          }
        },
        [active, value]
      )}
      type="button"
      aria-selected={active === value}
      onPointerMove={() => onActiveChange(value)}
      {...props}
      className={cn(
        "flex min-h-10 select-none flex-row items-center gap-2.5 rounded-lg px-2 text-start text-sm",
        active === value && "bg-fd-accent text-fd-accent-foreground",
        props.className
      )}
    >
      {props.children}
    </button>
  );
}

export interface TagItem {
  name: string;
  value: string | undefined;
  icon?: string;

  props?: HTMLAttributes<HTMLButtonElement>;
}

export interface TagsListProps extends HTMLAttributes<HTMLDivElement> {
  tag?: string;
  onTagChange: (tag: string | undefined) => void;
  allowClear?: boolean;

  items: TagItem[];
}

const itemVariants = cva(
  "flex items-center gap-1.5 flex-col rounded-md border px-2 pt-2 pb-1 text-xs font-medium text-fd-muted-foreground transition-colors",
  {
    variants: {
      active: {
        true: "bg-fd-accent text-fd-accent-foreground",
      },
    },
  }
);

export function TagsList({
  tag,
  onTagChange,
  items,
  allowClear,
  ...props
}: TagsListProps) {
  return (
    <div
      {...props}
      className={cn(
        "grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2",
        props.className
      )}
    >
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          data-active={tag === item.value}
          className={cn(
            itemVariants({ active: tag === item.value }),
            item.props?.className
          )}
          onClick={() => {
            if (tag === item.value && allowClear) {
              onTagChange(undefined);
            } else {
              onTagChange(item.value);
            }
          }}
          tabIndex={-1}
          {...item.props}
        >
          {item.icon && <Icon name={item.icon} size={18} strokeWidth={1.25} />}
          {item.name}
        </button>
      ))}
      {props.children}
    </div>
  );
}
