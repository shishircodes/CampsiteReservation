export default function Stars() {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4 fill-current">
          <path d="M10 15.27l-5.18 3.05 1.64-5.64L1 8.63l5.9-.51L10 3l3.1 5.12 5.9.51-5.46 4.05 1.64 5.64z" />
        </svg>
      ))}
    </div>
  );
}