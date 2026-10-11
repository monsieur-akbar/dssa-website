import Hero from '@/components/Hero';
import Stats from '@/components/Stats';

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-[#000000]">
      <Hero />
      <Stats />
    </div>
  );
}
