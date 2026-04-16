import { LumaSpin } from "@/components/ui/luma-spin";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-background">
      {/* Luma spin animation */}
      <LumaSpin />

      {/* Wordmark */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-lg font-black tracking-tight text-foreground">
          IndexFast
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          Getting things ready…
        </span>
      </div>
    </div>
  );
}
