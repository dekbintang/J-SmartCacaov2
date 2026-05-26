export default function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glassmorphism rounded-3xl border border-white/10 ${className}`}>
      {children}
    </div>
  );
}