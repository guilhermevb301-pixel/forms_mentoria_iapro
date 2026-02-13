import React, { useState, useRef, useEffect, useMemo, type JSX } from "react";
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame 
} from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Image as ImageIcon } from "lucide-react";

// --- Utility for Tailwind classes ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Component: Typewriter ---
interface TypewriterProps {
  text: string | string[];
  speed?: number;
  initialDelay?: number;
  waitTime?: number;
  deleteSpeed?: number;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
  hideCursorOnType?: boolean;
  cursorChar?: string | React.ReactNode;
  cursorAnimationVariants?: {
    initial: any;
    animate: any;
  };
  cursorClassName?: string;
}

const Typewriter = ({
  text,
  speed = 80,
  initialDelay = 0,
  waitTime = 2000,
  deleteSpeed = 50,
  loop = true,
  className,
  showCursor = true,
  hideCursorOnType = false,
  cursorChar = "|",
  cursorClassName = "ml-1",
  cursorAnimationVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.01,
        repeat: Infinity,
        repeatDelay: 0.4,
        repeatType: "reverse" as const,
      },
    },
  },
}: TypewriterProps) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const texts = Array.isArray(text) ? text : [text];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentText = texts[currentTextIndex];
    const nextTextIndex = (currentTextIndex + 1) % texts.length;
    const nextText = texts[nextTextIndex];

    let commonPrefixLength = 0;
    if (loop || currentTextIndex < texts.length - 1) {
      let i = 0;
      while (i < currentText.length && i < nextText.length && currentText[i] === nextText[i]) {
        i++;
      }
      commonPrefixLength = i;
    }

    const startTyping = () => {
      if (isDeleting) {
        if (displayText.length <= commonPrefixLength && displayText === currentText.substring(0, displayText.length)) {
          setIsDeleting(false);
          if (currentTextIndex === texts.length - 1 && !loop) return;
          setCurrentTextIndex(nextTextIndex);
          setCurrentIndex(commonPrefixLength);
          timeout = setTimeout(() => {}, waitTime);
        } else {
          timeout = setTimeout(() => {
            setDisplayText((prev) => prev.slice(0, -1));
          }, deleteSpeed);
        }
      } else {
        if (currentIndex < currentText.length) {
          timeout = setTimeout(() => {
            setDisplayText((prev) => prev + currentText[currentIndex]);
            setCurrentIndex((prev) => prev + 1);
          }, speed);
        } else if (texts.length > 1) {
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, waitTime);
        }
      }
    };

    if (currentIndex === 0 && !isDeleting && displayText === "" && initialDelay > 0) {
      timeout = setTimeout(startTyping, initialDelay);
    } else {
      startTyping();
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, displayText, isDeleting, speed, deleteSpeed, waitTime, texts, currentTextIndex, loop]);

  return (
    <div className={`inline whitespace-pre-wrap tracking-tight ${className}`}>
      <span>{displayText}</span>
      {showCursor && (
        <motion.span
          variants={cursorAnimationVariants}
          className={cn(
            cursorClassName,
            hideCursorOnType && (currentIndex < texts[currentTextIndex].length || isDeleting) ? "hidden" : ""
          )}
          initial="initial"
          animate="animate"
        >
          {cursorChar}
        </motion.span>
      )}
    </div>
  );
};

// --- Component: HoverButton ---
interface HoverButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const HoverButton = React.forwardRef<HTMLDivElement, HoverButtonProps>(
  ({ className, children, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isListening, setIsListening] = useState(false);
    const [circles, setCircles] = useState<Array<{
      id: number;
      x: number;
      y: number;
      color: string;
      fadeState: "in" | "out" | null;
    }>>([]);
    const lastAddedRef = useRef(0);

    const createCircle = React.useCallback((x: number, y: number) => {
      const buttonWidth = containerRef.current?.offsetWidth || 0;
      const xPos = x / buttonWidth;
      const color = `linear-gradient(to right, var(--circle-start) ${xPos * 100}%, var(--circle-end) ${xPos * 100}%)`;
      setCircles((prev) => [
        ...prev,
        { id: Date.now(), x, y, color, fadeState: null },
      ]);
    }, []);

    const handlePointerMove = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        if (!isListening) return;
        const currentTime = Date.now();
        if (currentTime - lastAddedRef.current > 50) {
          lastAddedRef.current = currentTime;
          const rect = event.currentTarget.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          createCircle(x, y);
        }
      },
      [isListening, createCircle]
    );

    const handlePointerEnter = React.useCallback(() => {
      setIsListening(true);
    }, []);

    const handlePointerLeave = React.useCallback(() => {
      setIsListening(false);
    }, []);

    useEffect(() => {
      circles.forEach((circle) => {
        if (!circle.fadeState) {
          setTimeout(() => {
            setCircles((prev) =>
              prev.map((c) =>
                c.id === circle.id ? { ...c, fadeState: "in" } : c
              )
            );
          }, 0);
          setTimeout(() => {
            setCircles((prev) =>
              prev.map((c) =>
                c.id === circle.id ? { ...c, fadeState: "out" } : c
              )
            );
          }, 1000);
          setTimeout(() => {
            setCircles((prev) => prev.filter((c) => c.id !== circle.id));
          }, 2200);
        }
      });
    }, [circles]);

    return (
      <div
        ref={containerRef}
        className={cn(
          "relative isolate px-10 py-4 rounded-full",
          "text-white font-medium text-lg leading-6 tracking-wide",
          "backdrop-blur-xl bg-[rgba(43,55,80,0.2)]",
          "overflow-hidden transition-all duration-300",
          "cursor-default select-none",
          "before:content-[''] before:absolute before:inset-0",
          "before:rounded-[inherit] before:pointer-events-none",
          "before:z-[1]",
          "before:shadow-[inset_0_0_0_1px_rgba(170,202,255,0.2),inset_0_0_16px_0_rgba(170,202,255,0.1),inset_0_-3px_12px_0_rgba(170,202,255,0.15),0_1px_3px_0_rgba(0,0,0,0.50),0_4px_12px_0_rgba(0,0,0,0.45)]",
          "before:mix-blend-multiply before:transition-transform before:duration-300",
          className
        )}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        {...props}
        style={{
          "--circle-start": "#a0d9f8",
          "--circle-end": "#3a5bbf",
        } as React.CSSProperties}
      >
        <span className="absolute inset-0 z-[-1] overflow-hidden rounded-[inherit] pointer-events-none">
          {circles.map(({ id, x, y, color, fadeState }) => (
            <div
              key={id}
              className={cn(
                "absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full",
                "blur-md transition-opacity duration-300",
                fadeState === "in" && "opacity-75",
                fadeState === "out" && "opacity-0 duration-[1.2s]",
                !fadeState && "opacity-0"
              )}
              style={{
                left: x,
                top: y,
                background: color,
              }}
            />
          ))}
        </span>
        {children}
      </div>
    );
  }
);
HoverButton.displayName = "HoverButton";

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

        <div className="mt-2 max-w-[600px] mx-auto">
          <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-normal tracking-tight text-white whitespace-nowrap flex items-center justify-center gap-2 md:gap-3">
            <Typewriter
              text={[
                "Suas vendas",
                "Sua operação",
                "Seu suporte",
                "Seu negócio"
              ]}
              speed={100}
              className="text-[#4F46E5]"
              waitTime={2000}
              deleteSpeed={50}
              cursorChar={"_"}
            />
            <span className="text-white">
              rodando 24 horas.
            </span>
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pointer-events-auto"
        >
          <HoverButton>
            Lançamento em breve
          </HoverButton>
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
