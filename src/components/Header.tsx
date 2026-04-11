export default function Header() {
  return (
    <header className="px-6 pt-10 pb-8 max-w-7xl mx-auto">
      <div className="flex items-start gap-3">
        <div className="w-1 h-10 rounded-full bg-ef-green mt-0.5 shrink-0" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ef-fg">
            World Cup Roster Visualizer
          </h1>
          <p className="text-ef-dim text-sm mt-1">
            Compare national team squads across 1994, 1998 &amp; 2002
          </p>
        </div>
      </div>
    </header>
  );
}
