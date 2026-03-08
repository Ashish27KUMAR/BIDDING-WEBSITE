import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Gavel } from 'lucide-react';

function Landing() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/home");
        }, 4500);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="fixed inset-0 z-[100] bg-gaming-900 overflow-hidden flex items-center justify-center">
            {/* 🚀 Dark Cyber/Gaming Background */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30 animate-pulse-slow mix-blend-screen"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
                }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gaming-900 via-transparent to-gaming-900"></div>

            {/* ⚡ Animation Container */}
            <div className="relative z-10 flex flex-col items-center">
                {/* The Gavel Strike Effect */}
                <div className="relative flex items-center justify-center h-48 w-48 mb-4 mt-8">
                    {/* Shockwave circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shockwave-animation rounded-full border border-cyan-400"></div>

                    {/* Gavel Icon */}
                    <div className="gavel-hit-animation text-cyan-400 drop-shadow-[0_0_30px_rgba(0,240,255,0.8)] z-10">
                        <Gavel size={120} strokeWidth={1.5} />
                    </div>
                </div>

                {/* 🏆 Text Reveal */}
                <div className="text-center mt-2 animate-fade-up">
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white drop-shadow-lg">
                        NEXUS<span className="text-cyan-400">BID</span>
                    </h1>
                    <div className="h-1 w-full bg-cyan-400 mt-2 animate-scale-x shadow-[0_0_15px_rgba(0,240,255,0.8)]"></div>
                    <p className="text-cyan-400/80 mt-4 tracking-[0.5em] font-light uppercase text-sm drop-shadow-md">
                        Initializing Arena...
                    </p>
                </div>
            </div>

            {/* 💡 Custom CSS for the "Hit" Effect */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
        @keyframes gavelHit {
          0% { 
            transform: rotate(-45deg) scale(1.5) translateY(-50px); 
            opacity: 0; 
          }
          30% { 
            opacity: 1; 
            transform: rotate(-60deg) scale(1.5) translateY(-60px); 
          }
          45% {
            transform: rotate(20deg) scale(1) translateY(5px);
            filter: drop-shadow(0 0 60px rgba(0,240,255,1));
          }
          50% { 
            transform: rotate(0deg) scale(1) translateY(0); 
            filter: drop-shadow(0 0 50px rgba(0,240,255,1));
          }
          65% { 
            transform: rotate(-10deg) scale(1) translateY(-5px); 
          }
          100% { 
            transform: rotate(0deg) scale(1) translateY(0); 
            filter: drop-shadow(0 0 30px rgba(0,240,255,0.8));
          }
        }

        .gavel-hit-animation {
          animation: gavelHit 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          transform-origin: bottom right;
          opacity: 0;
        }

        @keyframes shockwave {
          0% {
            width: 0px;
            height: 0px;
            opacity: 0;
            border-width: 10px;
          }
          44% {
            width: 0px;
            height: 0px;
            opacity: 0;
          }
          45% {
            width: 50px;
            height: 50px;
            opacity: 1;
            border-width: 20px;
            box-shadow: 0 0 50px rgba(0,240,255,1), inset 0 0 50px rgba(0,240,255,1);
          }
          100% {
            width: 800px;
            height: 800px;
            opacity: 0;
            border-width: 1px;
            box-shadow: 0 0 10px rgba(0,240,255,0), inset 0 0 10px rgba(0,240,255,0);
          }
        }

        .shockwave-animation {
          animation: shockwave 2.5s ease-out forwards;
        }

        .animate-fade-up {
          animation: fadeUp 1s ease-out forwards;
          animation-delay: 1.2s;
          opacity: 0;
        }

        @keyframes fadeUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .animate-scale-x {
          animation: scaleX 1s ease-in-out forwards;
          animation-delay: 1.6s;
          transform-origin: left;
          transform: scaleX(0);
        }

        @keyframes scaleX {
          to { transform: scaleX(1); }
        }

        .animate-pulse-slow {
          animation: pulse 6s infinite alternate;
        }

        @keyframes pulse {
          from { transform: scale(1); opacity: 0.1; }
          to { transform: scale(1.05); opacity: 0.3; }
        }
      `,
                }}
            />
        </div>
    );
}

export default Landing;
