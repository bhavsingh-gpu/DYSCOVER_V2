import { ShootingStars } from "./components/ShootingStars";

export default function App() {
  return (
    <div className="size-full flex items-center justify-center relative">
      <ShootingStars />
      <div className="relative z-10 text-center">
        <h1 className="text-white text-6xl font-bold mb-4">Welcome</h1>
        <p className="text-white/70 text-xl">Your landing page with shooting stars</p>
      </div>
    </div>
  );
}