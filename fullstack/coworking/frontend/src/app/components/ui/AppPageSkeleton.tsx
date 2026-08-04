type SkeletonVariant = "auth" | "cards" | "list" | "dashboard" | "profile";

type SkeletonProps = {
  className: string;
};

function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-xl bg-zinc-800/80 ${className}`} />
  );
}

function PageContainer({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 sm:px-6 lg:px-8">
      {children}
    </main>
  );
}

function HeaderSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <section className="rounded-4xl border border-zinc-800 bg-zinc-900/60 p-8">
      <Skeleton className="h-5 w-28" />
      <Skeleton className={`mt-5 h-10 ${compact ? "w-64" : "w-80"}`} />
      {!compact && <Skeleton className="mt-3 h-5 w-full max-w-2xl" />}
    </section>
  );
}

function CardSkeleton() {
  return (
    <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="space-y-4 p-5">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-10 w-full" />
      </div>
    </section>
  );
}

function ListRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-800 p-5">
      <div className="space-y-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-72 max-w-[55vw]" />
      </div>
      <Skeleton className="h-10 w-36" />
    </div>
  );
}

function CardsPageSkeleton() {
  return (
    <PageContainer>
      <div className="mx-auto max-w-7xl space-y-8">
        <HeaderSkeleton />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

function ListPageSkeleton() {
  return (
    <PageContainer>
      <div className="mx-auto max-w-7xl space-y-7">
        <HeaderSkeleton compact />
        <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60">
          {Array.from({ length: 5 }, (_, index) => (
            <ListRowSkeleton key={index} />
          ))}
        </section>
      </div>
    </PageContainer>
  );
}

function DashboardPageSkeleton() {
  return (
    <PageContainer>
      <div className="mx-auto max-w-7xl space-y-8">
        <HeaderSkeleton compact />
        <div className="grid gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <section
              key={index}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5"
            >
              <Skeleton className="h-6 w-6" />
              <Skeleton className="mt-6 h-9 w-20" />
              <Skeleton className="mt-3 h-4 w-24" />
            </section>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

function ProfilePageSkeleton() {
  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="flex items-center gap-5 rounded-4xl border border-zinc-800 bg-zinc-900/60 p-8">
          <Skeleton className="h-20 w-20 rounded-3xl" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-52" />
            <Skeleton className="h-4 w-40" />
          </div>
        </section>
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7">
          <Skeleton className="h-7 w-36" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}

function AuthPageSkeleton() {
  return (
    <PageContainer>
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center">
        <section className="w-full rounded-4xl border border-zinc-800 bg-zinc-900/60 p-7 sm:p-8">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="mt-3 h-4 w-full" />
          <div className="mt-8 space-y-5">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-11 w-full" />
              </div>
            ))}
          </div>
          <Skeleton className="mt-7 h-11 w-full" />
        </section>
      </div>
    </PageContainer>
  );
}

export default function AppPageSkeleton({
  variant = "cards",
}: {
  variant?: SkeletonVariant;
}) {
  if (variant === "auth") return <AuthPageSkeleton />;
  if (variant === "dashboard") return <DashboardPageSkeleton />;
  if (variant === "profile") return <ProfilePageSkeleton />;
  if (variant === "list") return <ListPageSkeleton />;

  return <CardsPageSkeleton />;
}
import type { ReactNode } from "react";
