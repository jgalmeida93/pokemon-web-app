import { Loader2 } from "lucide-react";

export default function Loading() {
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
    <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-card shadow-lg animate-in fade-in-50 duration-300">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <p className="text-xl font-semibold text-foreground">Loading...</p>
    </div>
  </div>;
}
