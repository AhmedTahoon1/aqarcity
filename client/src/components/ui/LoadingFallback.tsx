import { Loader2 } from 'lucide-react';

export default function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <p className="text-sm text-gray-600">جاري التحميل...</p>
      </div>
    </div>
  );
}