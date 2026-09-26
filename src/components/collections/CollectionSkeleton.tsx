// Shown instantly while a collection page streams in (see loading.tsx files).
export default function CollectionSkeleton() {
  return (
    <div className='container mx-auto px-4 py-6 md:py-10' aria-busy='true' aria-label='Loading products'>
      <div className='h-3 w-40 rounded bg-[#e6ded0]/70 animate-pulse' />
      <div className='mt-4 h-8 w-56 rounded bg-[#e6ded0]/70 animate-pulse' />
      <div className='mt-6 flex gap-2'>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className='h-8 w-24 rounded-full bg-[#e6ded0]/60 animate-pulse' />
        ))}
      </div>
      <div className='mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4'>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className='overflow-hidden rounded-sm border border-[#e0d8c9]/40 bg-white'>
            <div className='aspect-[2/3] w-full bg-[#f1ece3] animate-pulse' />
            <div className='space-y-2 p-3'>
              <div className='h-3 w-3/4 rounded bg-[#e6ded0]/70 animate-pulse' />
              <div className='h-7 w-full rounded-md bg-[#e6ded0]/50 animate-pulse' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
