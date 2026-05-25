interface Props {
  emoji: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export default function FoodCard({ emoji, label, selected, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      className={`
        flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-150 cursor-pointer
        ${selected
          ? 'border-pink-400 bg-pink-50 scale-105 shadow-md'
          : 'border-transparent bg-white/60 hover:border-pink-200 hover:scale-[1.03] hover:bg-white/80'}
      `}
    >
      <span className="text-5xl">{emoji}</span>
      <span className="text-sm font-semibold text-rose-700 capitalize">{label}</span>
    </button>
  );
}
