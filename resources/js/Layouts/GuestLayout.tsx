import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#0f172a] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <style>{`
                @keyframes logo-glow {
                    0%, 100% { filter: drop-shadow(0 0 8px rgba(6,182,212,0.4)) drop-shadow(0 0 20px rgba(91,62,147,0.3)); }
                    50%       { filter: drop-shadow(0 0 18px rgba(6,182,212,0.8)) drop-shadow(0 0 40px rgba(91,62,147,0.6)); }
                }
                @keyframes float1 { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-10px)} }
                @keyframes float2 { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-16px)} }
                @keyframes float3 { 0%,100%{transform:translateY(-5px)}50%{transform:translateY(8px)}  }
                @keyframes float4 { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-12px)} }
                @keyframes float5 { 0%,100%{transform:translateY(-3px)}50%{transform:translateY(10px)} }
                .logo-pulse { animation: logo-glow 2.5s ease-in-out infinite; }

                /* Wave: animasi pada <g> di dalam SVG, bukan pada elemen luar */
                @keyframes wf1 { from{transform:translateX(0)} to{transform:translateX(-1440px)} }
                @keyframes wf2 { from{transform:translateX(0)} to{transform:translateX(1440px)}  }
                @keyframes wf3 { from{transform:translateX(0)} to{transform:translateX(-1440px)} }
                .wg1 { animation: wf1 25s linear infinite; }
                .wg2 { animation: wf2 20s linear infinite; }
                .wg3 { animation: wf3 15s linear infinite; }
            `}</style>

            {/* Ambient blobs */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-20 -right-10 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute top-1/3 -left-20 w-[500px] h-[500px] rounded-full bg-violet-700/10 blur-3xl" />
            </div>

            {/* Form card */}
            <div className="relative z-10 w-full max-w-md mb-36 sm:mb-44">
                {children}
            </div>

            {/* ── Wave layers — SVG full-width, animasi dalam <g> ── */}

            {/* Layer 1 — back (paling gelap), slowest */}
            <div className="absolute bottom-0 left-0 w-full pointer-events-none z-[1]" style={{ height: 150 }}>
                <svg width="100%" height="150" viewBox="0 0 1440 150" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
                    <g className="wg1">
                        {/* tile 0 */}
                        <path d="M0,75 C180,120 360,30 540,75 C720,120 900,30 1080,75 C1260,120 1440,30 1440,75 L1440,150 L0,150 Z" fill="#312e81"/>
                        {/* tile 1 — copy geser 1440px */}
                        <path d="M1440,75 C1620,120 1800,30 1980,75 C2160,120 2340,30 2520,75 C2700,120 2880,30 2880,75 L2880,150 L1440,150 Z" fill="#312e81"/>
                    </g>
                </svg>
            </div>

            {/* Layer 2 — mid (biru), medium speed, arah berlawanan */}
            <div className="absolute bottom-0 left-0 w-full pointer-events-none z-[2]" style={{ height: 115 }}>
                <svg width="100%" height="115" viewBox="0 0 1440 115" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
                    <g className="wg2">
                        <path d="M0,58 C200,95 400,22 600,58 C800,95 1000,22 1200,58 C1400,95 1440,45 1440,58 L1440,115 L0,115 Z" fill="#0e4d7a"/>
                        <path d="M-1440,58 C-1240,95 -1040,22 -840,58 C-640,95 -440,22 -240,58 C-40,95 0,45 0,58 L0,115 L-1440,115 Z" fill="#0e4d7a"/>
                    </g>
                </svg>
            </div>

            {/* Layer 3 — front (cyan tint), fastest */}
            <div className="absolute bottom-0 left-0 w-full pointer-events-none z-[3]" style={{ height: 85 }}>
                <svg width="100%" height="85" viewBox="0 0 1440 85" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
                    <g className="wg3">
                        <path d="M0,42 C240,72 480,12 720,42 C960,72 1200,12 1440,42 L1440,85 L0,85 Z" fill="#0e7490" fillOpacity="0.85"/>
                        <path d="M1440,42 C1680,72 1920,12 2160,42 C2400,72 2640,12 2880,42 L2880,85 L1440,85 Z" fill="#0e7490" fillOpacity="0.85"/>
                    </g>
                </svg>
            </div>

            {/* Floating dots — di atas wave */}
            <div className="absolute bottom-0 left-0 w-full pointer-events-none z-[4]" style={{ height: 160 }}>
                {([
                    { left:'8%',  bottom:'60px', size:5, anim:'float1', dur:'3.2s' },
                    { left:'18%', bottom:'90px', size:3, anim:'float2', dur:'4.1s' },
                    { left:'32%', bottom:'50px', size:4, anim:'float3', dur:'3.7s' },
                    { left:'50%', bottom:'100px',size:3, anim:'float4', dur:'5s'   },
                    { left:'65%', bottom:'70px', size:5, anim:'float5', dur:'3.5s' },
                    { left:'78%', bottom:'90px', size:3, anim:'float1', dur:'4.5s' },
                    { left:'90%', bottom:'55px', size:4, anim:'float2', dur:'3.9s' },
                ] as const).map((d, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        left: d.left,
                        bottom: d.bottom,
                        width: d.size,
                        height: d.size,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(6,182,212,0.5)',
                        animation: `${d.anim} ${d.dur} ease-in-out infinite`,
                    }} />
                ))}
            </div>
        </div>
    );
}
