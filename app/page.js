import Hero from '@/components/Hero';
import DataCube from '@/components/DataCube';
import Stats from '@/components/Stats';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <div className="w-full relative z-10 border-b border-slate-900">
        <DataCube />
      </div>
      <Hero />
      <Stats />
    </div>
  );
}
