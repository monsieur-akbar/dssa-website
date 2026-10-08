import Hero from '@/components/Hero';
import Stats from '@/components/Stats';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Hero />
      <Stats />
    </div>
  );
}
