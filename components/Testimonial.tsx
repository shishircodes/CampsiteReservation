import Stars from "./StarsReview";

export default function Testimonial({
  name,
  avatar,
  quote,
}: {
  name: string;
  avatar: string;
  quote: string;
}){
return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <img src={avatar} alt={name} className="h-10 w-10 rounded-full object-cover" />
        <div>
          <p className="text-sm font-semibold text-slate-900">{name}</p>
          <Stars />
        </div>
      </div>
      <p className="text-sm text-slate-600">{quote}</p>
    </div>
  );
}