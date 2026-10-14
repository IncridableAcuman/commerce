export const ProductSkeleton = () => {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden animate-pulse flex flex-col h-full">
      <div className="w-full aspect-4/3 bg-slate-800/70 relative">
        <div className="absolute top-3 left-3 w-16 h-6 bg-slate-700/60 rounded-full" />
        <div className="absolute top-3 right-3 w-8 h-8 bg-slate-700/60 rounded-full" />
      </div>
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="w-24 h-4 bg-slate-800 rounded-md" />
          <div className="w-full h-5 bg-slate-800 rounded-md" />
          <div className="w-3/4 h-5 bg-slate-800 rounded-md" />
        </div>
        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
          <div className="w-20 h-6 bg-slate-800 rounded-md" />
          <div className="w-28 h-9 bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const ProductSkeletonGrid = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
};
