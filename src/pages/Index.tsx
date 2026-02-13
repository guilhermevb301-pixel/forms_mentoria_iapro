import React, { useState, useRef, useEffect, useMemo, type JSX } from "react";
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame 
} from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Bot, ArrowRight, BrainCircuit, Image as ImageIcon } from "lucide-react";

// --- Utility for Tailwind classes ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Component: Text Shimmer ---
interface TextShimmerProps {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  spread?: number;
}

function TextShimmer({
  children,
  as: Component = 'p',
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const MotionComponent = motion.create(Component as keyof JSX.IntrinsicElements);

  const dynamicSpread = useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  return (
    <MotionComponent
      className={cn(
        'relative inline-block bg-[length:250%_100%,auto] bg-clip-text',
        'text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#000]',
        '[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]',
        'dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff] dark:[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]',
        className
      )}
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
      style={
        {
          '--spread': `${dynamicSpread}px`,
          backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
        } as React.CSSProperties
      }
    >
      {children}
    </MotionComponent>
  );
}

// --- Subcomponent: 3D Rotating Globe ---
const WorldGlobe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;
    let rotation = 0;

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const GLOBE_RADIUS = 320; 
    const color = "rgba(255, 255, 255, 0.2)"; 
    const speed = 0.002; 

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      rotation += speed;
      
      const cx = width / 2;
      const cy = height / 2;

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      ctx.beginPath();

      for (let i = 0; i < 12; i++) {
        const lng = (Math.PI * 2 * i) / 12; 
        for (let j = 0; j <= 60; j++) {
            const lat = (Math.PI * j) / 60; 
            const x = GLOBE_RADIUS * Math.sin(lat) * Math.cos(lng + rotation);
            const z = GLOBE_RADIUS * Math.sin(lat) * Math.sin(lng + rotation);
            const y = GLOBE_RADIUS * Math.cos(lat);
            
            const perspective = 800;
            const scale = perspective / (perspective - z);
            
            const px = cx + x * scale;
            const py = cy + y * scale;
            
            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
      }
      
       for (let i = 1; i < 8; i++) {
        const lat = (Math.PI * i) / 8;
        for (let j = 0; j <= 60; j++) {
            const lng = (Math.PI * 2 * j) / 60; 
            const x = GLOBE_RADIUS * Math.sin(lat) * Math.cos(lng + rotation);
            const z = GLOBE_RADIUS * Math.sin(lat) * Math.sin(lng + rotation);
            const y = GLOBE_RADIUS * Math.cos(lat);

            const perspective = 800;
            const scale = perspective / (perspective - z);

            const px = cx + x * scale;
            const py = cy + y * scale;
            
             if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
      }
      
      ctx.stroke();
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animationFrameId);
    }
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full absolute inset-0 pointer-events-none opacity-[0.3]" />;
}

// --- Subcomponent: The Grid Pattern SVG ---
const GridPattern = ({ offsetX, offsetY }: { offsetX: any; offsetY: any }) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id="grid-pattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-white/10" 
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
};

// --- Main Component: Infinite Grid Hero ---
const InfiniteGridHero = () => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = 0.5; 
  const speedY = 0.5;

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % 40);
    gridOffsetY.set((currentY + speedY) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white selection:bg-[#00E3A5]/30"
      )}
    >
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <WorldGlobe />
      </div>

      <div className="absolute inset-0 z-0 opacity-[0.2]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>

      <motion.div 
        className="absolute inset-0 z-0 opacity-100"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00E3A5]/10 to-transparent backdrop-blur-[1px]" />
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute right-[-10%] top-[-20%] w-[600px] h-[600px] rounded-full bg-[#4F46E5]/20 blur-[120px]" />
        <div className="absolute left-[-10%] bottom-[-20%] w-[600px] h-[600px] rounded-full bg-[#EA4B71]/15 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto space-y-10 pointer-events-none">
        
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, delay: 0.1 }}
           className="relative w-full max-w-[600px] flex items-center justify-center select-none"
        >
          <img 
            src="https://baserow-backend-production20240528124524339000000001.s3.amazonaws.com/user_files/Y5iRKwRvsN8r6JPbfg9uYBKQubWLPGRE_68c04b12b8899acf17980aa95717ded2f6a8eabb863b26227daad00f8da7a097.svg" 
            alt="ia4business Logo"
            className="w-full h-auto object-contain drop-shadow-2xl"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('fallback-visible');
            }}
          />
          
          <div className="hidden fallback-visible:flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl p-12 bg-white/5 backdrop-blur-sm w-full">
            <ImageIcon className="w-16 h-16 text-white/40 mb-4" />
            <p className="text-white/60 font-mono text-sm">Logo não carregada</p>
          </div>
        </motion.div>

        <div className="mt-2 max-w-2xl mx-auto">
          <TextShimmer 
            className="text-lg md:text-2xl leading-relaxed [--base-color:#6b7280] [--base-gradient-color:#ffffff] dark:[--base-color:#6b7280] dark:[--base-gradient-color:#ffffff]" 
            duration={3}
          >
            seu negócio rodando 24 horas.
          </TextShimmer>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 pointer-events-auto mt-8"
        >
          <button 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative px-8 py-4 bg-[#4F46E5] text-white font-semibold rounded-full hover:bg-[#4338ca] transition-all shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.6)] active:scale-95 flex items-center justify-center gap-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <BrainCircuit className="w-5 h-5" />
            <span>Começar Agora</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            className="px-8 py-4 bg-transparent text-white font-semibold rounded-full border border-white/20 hover:bg-[#00E3A5]/10 hover:border-[#00E3A5]/50 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Bot className="w-5 h-5 text-[#00E3A5]" />
            <span>Agendar Demo</span>
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#EA4B71]/50 to-transparent" />
    </div>
  );
};

const Index = () => {
  return (
    <div className="font-sans antialiased bg-black min-h-screen">
      <InfiniteGridHero />
    </div>
  );
};

export default Index;
