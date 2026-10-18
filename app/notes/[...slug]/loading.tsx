import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
  return (
    <div className="flex w-full flex-1 flex-col gap-6 px-4 pt-8 md:pt-12 lg:px-8 xl:mx-auto max-w-[1120px] max-sm:pb-16 dark:[&_.react-loading-skeleton]:opacity-40">
      <h1 className="text-3xl font-bold">
        <Skeleton />
      </h1>
      <p className="mb-8 w-1/2 text-lg text-fd-muted-foreground">
        <Skeleton />
      </p>
      <h2 className="w-1/3 text-2xl">
        <Skeleton />
      </h2>
      <p className="w-1/2">
        <Skeleton height={100} />
      </p>
    </div>
  );
}
