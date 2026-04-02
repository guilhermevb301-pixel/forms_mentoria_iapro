import React, { useState, useRef, useEffect, useMemo, type JSX } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
  AnimatePresence,
  type MotionValue,
  type Variants,
  type HTMLMotionProps
} from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Image as ImageIcon } from "lucide-react";
import { OnboardingForm } from "../components/OnboardingForm";

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
  cursorAnimationVariants?: Variants;
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
          timeout = setTimeout(() => { }, waitTime);
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
interface HoverButtonProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

const HoverButton = React.forwardRef<HTMLDivElement, HoverButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative isolate px-10 py-4 rounded-full",
          "text-white font-medium text-lg leading-6 tracking-wide",
          "backdrop-blur-xl bg-white/5 border border-white/10",
          "overflow-hidden transition-all duration-300",
          "cursor-pointer select-none shadow-lg hover:bg-white/10 hover:shadow-xl",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
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
    const ctx = canvas.getContext("2d", { alpha: true }); // optimize
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;
    let rotation = 0;

    let GLOBE_RADIUS = 320;

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      // Responsive radius
      if (width < 768) {
        GLOBE_RADIUS = 200;
      } else {
        GLOBE_RADIUS = 320;
      }
    };
    window.addEventListener("resize", resize);
    resize();

    const speed = 0.002;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      rotation += speed;

      const cx = width / 2;
      const cy = height / 2;

      // Draw subtle rim for the globe
      ctx.beginPath();
      ctx.arc(cx, cy, GLOBE_RADIUS, 0, 2 * Math.PI);

      // Transparent fill to see background
      ctx.fillStyle = "transparent";
      ctx.fill();

      // Light stroke for the rim with a glow
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;

      // Specific shadow for the rim
      ctx.shadowColor = "rgba(220, 220, 220, 0.35)";
      ctx.shadowBlur = 80;
      ctx.stroke();

      // Reset shadow for inner lines
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();

      // Reduced number of lines for performance
      for (let i = 0; i < 12; i++) {
        const lng = (Math.PI * 2 * i) / 12;
        // Reduced segments per line (was 60, now 40)
        for (let j = 0; j <= 40; j++) {
          const lat = (Math.PI * j) / 40;
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
        for (let j = 0; j <= 40; j++) {
          const lng = (Math.PI * 2 * j) / 40;
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
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full absolute inset-0 pointer-events-none opacity-[0.8]"
    // Removed drop-shadow filter for performance
    />
  );
}

// --- Subcomponent: The Grid Pattern SVG ---
const GridPattern = ({ offsetX, offsetY }: { offsetX: MotionValue<number>; offsetY: MotionValue<number> }) => {
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

// --- Main Component: InfiniteGridHero ---
const InfiniteGridHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // State for onboarding flow: 'idle' | 'animating' | 'completed'
  const [onboardingState, setOnboardingState] = useState<'idle' | 'animating' | 'completed'>('idle');

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

  const maskImage = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, black, transparent), radial-gradient(450px circle at 50% 50%, black, transparent)`;

  const startOnboarding = () => {
    setOnboardingState('animating');
    setTimeout(() => {
      setOnboardingState('completed');
    }, 800);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white selection:bg-[#00E3A5]/30"
      )}
    >
      {/* Globe Container */}
      <motion.div
        className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none"
        // Force GPU layer and hint transformation changes
        style={{ transform: "translateZ(0)", willChange: "transform" }}
        animate={onboardingState === 'animating' ? {
          scale: 25,
          rotate: 180,
          opacity: 0
        } : (onboardingState === 'completed' ? { opacity: 0 } : { scale: 1, rotate: 0, opacity: 1 })}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <WorldGlobe />
      </motion.div>

      {/* Grid Background Layers */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 z-0 opacity-[0.4]">
          <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
        </div>

        <motion.div
          className="absolute inset-0 z-0 opacity-100"
          style={{ maskImage, WebkitMaskImage: maskImage }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#00E3A5]/10 to-transparent backdrop-blur-[1px]" />
          <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
        </motion.div>

        {/* Colored Lights - Fade out when not idle */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
          animate={{ opacity: onboardingState === 'idle' ? 1 : 0 }}
          transition={{ duration: 1.0 }}
        >
          <div className="absolute right-[-20%] top-[-10%] md:right-[-10%] md:top-[-20%] w-[400px] h-[400px] md:w-[700px] md:h-[700px] rounded-full bg-[#7C3AED]/20 blur-[80px] md:blur-[140px]" />
          <div className="absolute left-[-20%] bottom-[-10%] md:left-[-10%] md:bottom-[-20%] w-[400px] h-[400px] md:w-[700px] md:h-[700px] rounded-full bg-[#EA4B71]/15 blur-[80px] md:blur-[140px]" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {onboardingState === 'idle' && (
          <motion.div
            className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto pointer-events-auto"
            exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
          >

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative w-full max-w-[600px] flex items-center justify-center select-none mb-2 md:mb-4"
            >
              <div className="flex flex-col items-center gap-3">
                <img
                  src="/logo-genios.png"
                  alt="Next Era Logo"
                  className="w-48 h-48 object-contain"
                  style={{ mixBlendMode: 'screen' }}
                />
                <span className="text-3xl md:text-4xl font-bold tracking-widest text-white uppercase" style={{ letterSpacing: '0.25em' }}>
                  Next Era
                </span>
              </div>
            </motion.div>

            <div className="mt-2 max-w-[600px] mx-auto mb-10 md:mb-20">
              <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-mono font-normal tracking-tight text-white whitespace-nowrap flex items-center justify-center gap-2 md:gap-3">
                <Typewriter
                  text={[
                    "Suas vendas",
                    "Sua operação",
                    "Seu suporte",
                    "Seu negócio"
                  ]}
                  speed={100}
                  className="text-[#7C3AED]"
                  waitTime={2000}
                  deleteSpeed={50}
                  cursorChar={"_"}
                />
                <span className="text-white">
                  com IA.
                </span>
              </h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <HoverButton onClick={startOnboarding}>
                Começar onboarding
              </HoverButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding Form - Shows after animation */}
      <AnimatePresence>
        {onboardingState === 'completed' && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full h-full md:h-auto md:max-h-[85vh] flex flex-col items-center justify-center md:p-4">
              <OnboardingForm />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
