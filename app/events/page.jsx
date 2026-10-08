'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Sparkles,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Flame,
    History,
    CheckCircle2,
    Layers,
    Search,
} from 'lucide-react';
import EventModal from '@/components/EventModal';

/* =========================================================================
   CARTOON SNAKE MASCOT TUNABLE SETTINGS
   Tweak height, body length, segment count, swirl turns, duration, & colors.
   ========================================================================= */
const SNAKE_CONFIG = {
    // 1. TALLER SNAKE PROPORTIONS
    // Base visual height of the snake in pixels. Tweak this single value!
    SNAKE_HEIGHT: 140,          // Base visual height of resting coiled mascot in px
    NECK_HEIGHT_PX: 82,         // Height neck rises above the coil (~2x taller proportion)

    // 2. ONE-PATH BODY GEOMETRY (Fixed Length L sampled into N segments)
    BODY_LENGTH: 260,           // Total fixed length L of the snake in pixels
    SEGMENT_COUNT: 48,          // Number of sampled segments N (40 to 60)

    // 3. SLITHER DYNAMICS (Constant speed during travel + S-wave)
    SPEED: 6,                 // Travel speed in pixels per frame
    WAVE_AMP: 7,               // Sinusoidal S-wave lateral width (wiggle amplitude)
    WAVE_FREQ: 0.22,            // Temporal frequency of oscillation
    WAVE_SPATIAL_FREQ: 0.36,    // Spatial wave frequency along spine
    WAVE_FADE_DIST: 70,         // Distance over which S-wave fades to 0 before spiral entry

    // 4. SWIRL TRANSITION TUNABLES (Inward spiral winding into default coil)
    SWIRL_TURNS: 2.15,          // Spiral turns (ensures entire body, head to tail, flows into coil)
    SWIRL_DURATION_MS: 850,     // Target swirl duration in ms
    SPIRAL_START_RADIUS: 46,    // Outer radius r0 where spiral begins around coil root
    SPIRAL_END_RADIUS: 10,      // Inner core radius of the coil
    PHASE_OVERLAP: 0.20,        // 20% overlap between swirl ending & neck lift starting

    // 5. UPRIGHT HEAD LIFT TUNABLES
    NECK_LIFT_DURATION_MS: 420, // Duration of upright neck lift in ms (300 to 500ms)
    NECK_PERCENT: 0.28,         // First 28% of body from head lifts upward

    // 6. COLOR PALETTE (matching cartoon snake reference illustration)
    COLORS: {
        bodyBlue: '#3878AE',        // Main blue body
        bellyYellow: '#FFD84A',     // Underbelly stripe & eye iris
        navySpots: '#243A5A',       // Dark navy oval spots & shading
        forkedTongue: '#243A5A',    // Navy forked tongue
        pupil: '#243A5A',           // Eye pupil
    },
};

/* =========================================================================
   PATH SAMPLING HELPER (Arc-length Parameterization)
   Samples a continuous polyline/curve at exact distance d.
   Guarantees even segment spacing without stretching or bunching.
   ========================================================================= */
function samplePathAtDistance(path, targetDist) {
    const { points, distances, totalLength } = path;
    if (!points || points.length === 0) {
        return { x: 0, y: 0, angle: 0, normalX: 0, normalY: 1 };
    }

    const d = Math.max(0, Math.min(totalLength, targetDist));

    // Binary search for segment containing distance d
    let low = 0;
    let high = distances.length - 1;
    while (low <= high) {
        const mid = (low + high) >> 1;
        if (distances[mid] <= d) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    const idx = Math.max(0, Math.min(distances.length - 2, high));
    const d0 = distances[idx];
    const d1 = distances[idx + 1];
    const segLen = d1 - d0;
    const t = segLen > 0.0001 ? (d - d0) / segLen : 0;

    const p0 = points[idx];
    const p1 = points[idx + 1];

    const x = p0.x + (p1.x - p0.x) * t;
    const y = p0.y + (p1.y - p0.y) * t;

    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const angle = Math.atan2(dy, dx);
    const len = Math.hypot(dx, dy) || 1;
    const normalX = -dy / len;
    const normalY = dx / len;

    return { x, y, angle, normalX, normalY };
}

/* =========================================================================
   GUIDE PATH GENERATOR: [Travel Curve] + [Inward Spiral Coil]
   Continuous C1-smooth guide path joining the approach curve directly to
   an inward spiral ending at the coil's root. Prepends start segment history
   so every segment of the body rides the same track.
   ========================================================================= */
function buildGuidePath(startHead, startHeading, startSpine, targetCenter) {
    const points = [];

    // 1. Prepend current body segments from tail to head as negative-distance history
    // So at progress p = historyLength, segment i sits exactly at its current starting position!
    if (startSpine && startSpine.length > 0) {
        for (let i = startSpine.length - 1; i >= 0; i--) {
            points.push({ x: startSpine[i].x, y: startSpine[i].y });
        }
    } else {
        points.push({ x: startHead.x, y: startHead.y });
    }

    const headPointIdx = points.length - 1;

    // 2. Inward Spiral Parameters around targetCenter (Coil Root)
    const turns = SNAKE_CONFIG.SWIRL_TURNS;
    const totalAngle = turns * 2 * Math.PI;
    const rStart = SNAKE_CONFIG.SPIRAL_START_RADIUS;
    const rEnd = SNAKE_CONFIG.SPIRAL_END_RADIUS;
    const aspectY = 0.68; // perspective depth ratio for natural coil

    // Angle from targetCenter to startHead
    const dxToStart = startHead.x - targetCenter.x;
    const dyToStart = startHead.y - targetCenter.y;
    const phi = Math.atan2(dyToStart, dxToStart);

    // Direction: test dot product to pick smoother rotation (CCW vs CW)
    const entryTangentAngleCCW = phi + Math.PI / 2;
    const dotCCW =
        Math.cos(startHeading) * Math.cos(entryTangentAngleCCW) +
        Math.sin(startHeading) * Math.sin(entryTangentAngleCCW);
    const dir = dotCCW >= 0 ? 1 : -1;

    // Entry angle on outer circle of radius rStart
    const entryAngle = phi + (dir * Math.PI) / 2;

    // Outer entry point coordinates
    const spiralStartX = targetCenter.x + Math.cos(entryAngle) * rStart;
    const spiralStartY = targetCenter.y + Math.sin(entryAngle) * rStart * aspectY;

    // Exact derivative tangent vector at entry point of spiral
    const tanX = -Math.sin(entryAngle) * dir * totalAngle * rStart;
    const tanY = Math.cos(entryAngle) * dir * totalAngle * rStart * aspectY;
    const tanLen = Math.hypot(tanX, tanY) || 1;
    const unitTanX = tanX / tanLen;
    const unitTanY = tanY / tanLen;

    // 3. Smooth Cubic Bézier Travel Curve: from startHead to (spiralStartX, spiralStartY)
    const travelDist = Math.hypot(spiralStartX - startHead.x, spiralStartY - startHead.y);
    const handleDist = Math.max(25, travelDist / 2.6);

    const b0 = { x: startHead.x, y: startHead.y };
    const b1 = {
        x: startHead.x + Math.cos(startHeading) * handleDist,
        y: startHead.y + Math.sin(startHeading) * handleDist,
    };
    const b2 = {
        x: spiralStartX - unitTanX * handleDist,
        y: spiralStartY - unitTanY * handleDist,
    };
    const b3 = { x: spiralStartX, y: spiralStartY };

    const travelSteps = Math.max(20, Math.floor(travelDist / 10));
    for (let s = 1; s <= travelSteps; s++) {
        const t = s / travelSteps;
        const inv = 1 - t;
        const x =
            inv * inv * inv * b0.x +
            3 * inv * inv * t * b1.x +
            3 * inv * t * t * b2.x +
            t * t * t * b3.x;
        const y =
            inv * inv * inv * b0.y +
            3 * inv * inv * t * b1.y +
            3 * inv * t * t * b2.y +
            t * t * t * b3.y;
        points.push({ x, y });
    }

    const travelEndIdx = points.length - 1;

    // 4. Inward Spiral Samples (dense sampling for silky arc-length parameterization)
    const spiralSteps = 85;
    for (let s = 1; s <= spiralSteps; s++) {
        const t = s / spiralSteps;
        const angle = entryAngle + dir * totalAngle * t;
        const radius = rStart * (1 - t) + rEnd * t;
        const x = targetCenter.x + Math.cos(angle) * radius;
        const y = targetCenter.y + Math.sin(angle) * radius * aspectY;
        points.push({ x, y });
    }

    // 5. Precompute cumulative arc-length distances
    const distances = [0];
    let acc = 0;
    for (let i = 1; i < points.length; i++) {
        const d = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
        acc += d;
        distances.push(acc);
    }

    const historyLength = distances[headPointIdx];
    const travelLength = distances[travelEndIdx] - historyLength;
    const spiralLength = distances[distances.length - 1] - distances[travelEndIdx];

    return {
        points,
        distances,
        totalLength: acc,
        historyLength,
        travelLength,
        spiralLength,
        startDist: historyLength,
        travelEndDist: distances[travelEndIdx],
        spiralEndDist: acc,
        targetCenter,
        dir,
    };
}

/* =========================================================================
   1. COILED SNAKE SVG (Resting State - TALL PROPORTIONS)
   Exact vector match to the cartoon snake reference artwork with ~2x taller
   upright neck, proportional girth, dark navy spots, yellow belly stripe,
   yellow eye with dark pupil, and forked navy tongue.
   ========================================================================= */
function CoiledSnakeSVG({ isFlicking = false, className = '' }) {
    const { bodyBlue, bellyYellow, navySpots, forkedTongue, pupil } = SNAKE_CONFIG.COLORS;

    return (
        <svg
            viewBox="0 0 180 260"
            style={{
                height: `${SNAKE_CONFIG.SNAKE_HEIGHT}px`,
                width: 'auto',
            }}
            className={`drop-shadow-[0_10px_20px_rgba(36,58,90,0.55)] ${className}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Tail Tip on Left */}
            <path
                d="M 32 208 C 20 188 10 155 14 135 C 18 158 30 182 42 200 Z"
                fill={bodyBlue}
            />
            {/* Dark Navy Band on Tail Tip */}
            <path
                d="M 16 178 C 13 166 14 154 15 145 C 20 156 28 168 34 178 Z"
                fill={navySpots}
            />

            {/* Base Coil: Main Blue Body */}
            <path
                d="M 22 200 C 22 235 56 250 102 250 C 148 250 182 235 182 200 C 182 178 148 170 102 170 C 56 170 22 178 22 200 Z"
                fill={bodyBlue}
            />
            {/* Base Coil: Yellow Underbelly Lower Rim */}
            <path
                d="M 22 200 C 22 235 56 250 102 250 C 148 250 182 235 182 200 C 182 216 148 234 102 234 C 56 234 22 216 22 200 Z"
                fill={bellyYellow}
            />
            {/* Base Coil: Oval Dark Navy Spots */}
            <ellipse cx="38" cy="200" rx="4.5" ry="7" transform="rotate(-15 38 200)" fill={navySpots} />
            <ellipse cx="56" cy="208" rx="5" ry="7.5" transform="rotate(-10 56 208)" fill={navySpots} />
            <ellipse cx="78" cy="212" rx="5.5" ry="7.5" fill={navySpots} />
            <ellipse cx="104" cy="213" rx="5.5" ry="7.5" fill={navySpots} />
            <ellipse cx="128" cy="210" rx="5" ry="7.5" transform="rotate(10 128 210)" fill={navySpots} />
            <ellipse cx="152" cy="204" rx="4.5" ry="7" transform="rotate(20 152 204)" fill={navySpots} />
            <ellipse cx="170" cy="194" rx="4" ry="6.5" transform="rotate(25 170 194)" fill={navySpots} />

            {/* Middle Coil: Blue Body */}
            <path
                d="M 38 168 C 38 192 65 204 102 204 C 139 204 166 192 166 168 C 166 152 139 145 102 145 C 65 145 38 152 38 168 Z"
                fill={bodyBlue}
            />
            {/* Middle Coil: Yellow Belly Rim */}
            <path
                d="M 38 168 C 38 184 65 194 102 194 C 139 194 166 184 166 168 C 166 176 139 187 102 187 C 65 187 38 176 38 168 Z"
                fill={bellyYellow}
            />
            {/* Middle Coil: Oval Spots */}
            <ellipse cx="52" cy="168" rx="4.5" ry="6.5" transform="rotate(-12 52 168)" fill={navySpots} />
            <ellipse cx="72" cy="174" rx="5" ry="6.5" fill={navySpots} />
            <ellipse cx="94" cy="176" rx="5" ry="6.5" fill={navySpots} />
            <ellipse cx="118" cy="174" rx="5" ry="6.5" fill={navySpots} />
            <ellipse cx="140" cy="168" rx="4.5" ry="6.5" transform="rotate(15 140 168)" fill={navySpots} />

            {/* Tall Upright Neck */}
            <path
                d="M 72 170 C 64 130 65 85 70 45 C 85 40 106 40 120 50 C 116 92 108 135 110 170 Z"
                fill={bodyBlue}
            />
            {/* Front Throat/Chest: Yellow Belly Stripe */}
            <path
                d="M 85 45 C 102 50 116 52 132 50 C 130 58 118 60 108 58 C 98 78 96 120 108 170 C 100 170 92 162 86 138 C 80 114 78 78 85 45 Z"
                fill={bellyYellow}
            />

            {/* Oval Spots along the Tall Neck */}
            <ellipse cx="76" cy="25" rx="3.5" ry="5.5" fill={navySpots} />
            <ellipse cx="85" cy="16" rx="3.5" ry="5" fill={navySpots} />
            <ellipse cx="74" cy="46" rx="4" ry="6.5" fill={navySpots} />
            <ellipse cx="75" cy="70" rx="4.5" ry="7" fill={navySpots} />
            <ellipse cx="74" cy="95" rx="4.5" ry="7" fill={navySpots} />
            <ellipse cx="76" cy="120" rx="4.5" ry="7" fill={navySpots} />
            <ellipse cx="78" cy="145" rx="4.5" ry="7" fill={navySpots} />

            {/* Head Dome */}
            <path
                d="M 68 46 C 62 22 82 6 106 6 C 132 6 146 22 146 42 C 146 54 130 60 114 58 C 90 56 74 54 68 46 Z"
                fill={bodyBlue}
            />

            {/* Eye with Pupil and Highlight */}
            <ellipse cx="108" cy="22" rx="3.6" ry="5.6" fill={bellyYellow} />
            <ellipse cx="108" cy="23" rx="2" ry="3.8" fill={pupil} />
            <circle cx="108.5" cy="20.5" r="0.9" fill="#FFFFFF" />

            {/* Forked Navy Tongue */}
            <g
                className={`transition-transform duration-200 origin-[140px_46px] ${isFlicking ? 'scale-x-125 scale-y-110 -rotate-3' : 'scale-x-100 rotate-0'
                    }`}
            >
                <path
                    d="M 140 46 Q 154 48 164 52 Q 172 54 180 48 M 164 52 Q 171 56 176 64"
                    stroke={forkedTongue}
                    strokeWidth="3.0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            </g>
        </svg>
    );
}

/* =========================================================================
   2. ARTICULATED SEGMENTED SNAKE SVG (One Path, Whole Body)
   Renders all N segments traveling along the guide path.
   Yellow belly stripe automatically oriented toward inner coil side.
   ========================================================================= */
function ArticulatedSnakeSVG({ spine, isFlicking = false }) {
    if (!spine || spine.length < 2) return null;

    const { bodyBlue, bellyYellow, navySpots, forkedTongue, pupil } = SNAKE_CONFIG.COLORS;
    const head = spine[0];
    const headAngleDeg = ((head.angle || 0) * 180) / Math.PI;

    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            <defs>
                <filter id="snake-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#1e293b" floodOpacity="0.45" />
                </filter>
            </defs>

            <g filter="url(#snake-shadow)">
                {/* Blue Dorsal Body Discs */}
                {spine.map((seg, i) => {
                    if (i === 0) return null;
                    // Tapering radius: neck 13px -> midbody 15px -> tail 4.5px
                    const radius = Math.max(4.5, 15 - (i / spine.length) * 11);
                    return (
                        <circle
                            key={`body-${i}`}
                            cx={seg.x}
                            cy={seg.y}
                            r={radius}
                            fill={bodyBlue}
                        />
                    );
                })}

                {/* Yellow Ventral Belly Stripe (Oriented inward along normal) */}
                {spine.map((seg, i) => {
                    if (i === 0 || i > spine.length - 2) return null;
                    const radius = Math.max(2.2, 6.8 - (i / spine.length) * 4.6);
                    const bellyX = seg.x + (seg.normalX || 0) * (radius * 0.45);
                    const bellyY = seg.y + (seg.normalY || 0) * (radius * 0.45);
                    return (
                        <circle
                            key={`belly-${i}`}
                            cx={bellyX}
                            cy={bellyY}
                            r={radius}
                            fill={bellyYellow}
                        />
                    );
                })}

                {/* Dark Navy Spots along the back (on alternating segments) */}
                {spine.map((seg, i) => {
                    if (i % 2 !== 0 || i === 0 || i > spine.length - 3) return null;
                    const spotAngle = ((seg.angle || 0) * 180) / Math.PI;
                    return (
                        <ellipse
                            key={`spot-${i}`}
                            cx={seg.x}
                            cy={seg.y - 1.5}
                            rx={3.2}
                            ry={4.8}
                            transform={`rotate(${spotAngle} ${seg.x} ${seg.y - 1.5})`}
                            fill={navySpots}
                        />
                    );
                })}

                {/* Tapered Tail Tip */}
                {spine.length > 2 && (
                    <g>
                        <circle
                            cx={spine[spine.length - 1].x}
                            cy={spine[spine.length - 1].y}
                            r={4}
                            fill={navySpots}
                        />
                        <circle
                            cx={spine[spine.length - 2].x}
                            cy={spine[spine.length - 2].y}
                            r={5.5}
                            fill={bodyBlue}
                        />
                    </g>
                )}

                {/* Directional Head Segment */}
                <g transform={`translate(${head.x}, ${head.y}) rotate(${headAngleDeg})`}>
                    {/* Head Base Silhouette */}
                    <path
                        d="M -12 -13 C 0 -17 18 -13 24 0 C 18 13 0 17 -12 13 C -16 6 -16 -6 -12 -13 Z"
                        fill={bodyBlue}
                    />
                    {/* Yellow Jaw / Snout Accent */}
                    <path
                        d="M 8 -8 C 16 -6 20 0 18 6 C 14 8 8 6 6 3 Z"
                        fill={bellyYellow}
                    />

                    {/* Yellow Eye with Dark Navy Pupil */}
                    <ellipse cx="8" cy="-6" rx="3.3" ry="4.8" fill={bellyYellow} />
                    <ellipse cx="8" cy="-6" rx="1.7" ry="3.2" fill={pupil} />
                    <circle cx="8.5" cy="-7.5" r="0.75" fill="#FFFFFF" />

                    {/* Forked Tongue Flicking Outward */}
                    <g
                        className={`transition-transform duration-150 origin-[20px_0px] ${isFlicking ? 'scale-x-140 rotate-6' : 'scale-x-100 rotate-0'
                            }`}
                    >
                        <path
                            d="M 20 0 Q 28 1 34 3 Q 39 4 43 1 M 34 3 Q 39 6 42 11"
                            stroke={forkedTongue}
                            strokeWidth="2.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />
                    </g>
                </g>
            </g>
        </svg>
    );
}

/* =========================================================================
   3. CARTOON SNAKE MASCOT ENGINE: ONE PATH, WHOLE BODY
   State Machine: REST -> SLITHER -> SWIRL -> LIFT_HEAD -> REST
   - A single continuous guide path parameterized by arc-length.
   - Entire body flows through the spiral into the default coil shape.
   - Smooth re-routing on new card hover mid-swirl without jumping.
   ========================================================================= */
function CartoonSnakeMascot({ targetCardId, sectionRef, cardRefs }) {
    // 'REST' | 'SLITHER' | 'SWIRL' | 'LIFT_HEAD'
    const [mascotState, setMascotState] = useState('REST');
    const [isTongueFlicking, setIsTongueFlicking] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);

    // Position of coiled mascot
    const [coiledPos, setCoiledPos] = useState({ x: 0, y: 0 });

    // Kinematic state refs for 60fps rendering without React state latency
    const animFrameRef = useRef(null);
    const spineRef = useRef([]);
    const guidePathRef = useRef(null);
    const progressRef = useRef(0);
    const currentCardPosRef = useRef({ x: 0, y: 0 });
    const isAnimatingRef = useRef(false);

    // Head lift phase refs
    const liftStartTimeRef = useRef(0);
    const wavePhaseRef = useRef(0);

    const [, setRenderTrigger] = useState(0);

    // Check prefers-reduced-motion
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            setReducedMotion(mediaQuery.matches);

            const handleChange = (e) => setReducedMotion(e.matches);
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, []);

    // Periodic idle tongue flick in REST state
    useEffect(() => {
        const interval = setInterval(() => {
            setIsTongueFlicking(true);
            setTimeout(() => setIsTongueFlicking(false), 240);
        }, 3200);
        return () => clearInterval(interval);
    }, []);

    // Calculate target position near top-right perch of card
    const getCardTargetPosition = useCallback(
        (cardId) => {
            if (!sectionRef.current || !cardRefs.current[cardId]) return null;
            const secRect = sectionRef.current.getBoundingClientRect();
            const cardEl = cardRefs.current[cardId];
            const cardRect = cardEl.getBoundingClientRect();

            // Perch comfortably above the card with the tall neck rising proudly
            const targetX = cardRect.right - secRect.left - 54;
            const targetY = cardRect.top - secRect.top - 20;

            return { x: targetX, y: targetY };
        },
        [sectionRef, cardRefs]
    );

    // Initialize spine at target
    const initSpineAt = (pos) => {
        const N = SNAKE_CONFIG.SEGMENT_COUNT;
        const L = SNAKE_CONFIG.BODY_LENGTH;
        const segDist = L / (N - 1);
        const segments = [];
        for (let i = 0; i < N; i++) {
            segments.push({
                x: pos.x - i * segDist,
                y: pos.y + i * 1.5,
                angle: 0,
                normalX: 0,
                normalY: 1,
            });
        }
        spineRef.current = segments;
        currentCardPosRef.current = { ...pos };
    };

    // Main 60fps Kinematics Loop: One Path, Whole Body
    const runPhysicsLoop = useCallback(() => {
        if (!isAnimatingRef.current) return;

        const path = guidePathRef.current;
        if (!path) return;

        const N = SNAKE_CONFIG.SEGMENT_COUNT;
        const L = SNAKE_CONFIG.BODY_LENGTH;
        const segStep = L / (N - 1);
        const spine = spineRef.current;

        // 1. Advance Progress along the Guide Path
        const curP = progressRef.current;
        let stepSpeed = SNAKE_CONFIG.SPEED;

        // Inward spiral deceleration: ease-out speed through the spiral
        const isPastTravel = curP >= path.travelEndDist;
        const swirlProgress = isPastTravel
            ? Math.min(1, Math.max(0, (curP - path.travelEndDist) / path.spiralLength))
            : 0;

        if (isPastTravel) {
            setMascotState('SWIRL');
            // Quadratic ease-out deceleration into the coil
            stepSpeed = SNAKE_CONFIG.SPEED * Math.max(0.30, 1 - 0.70 * swirlProgress * swirlProgress);
        } else {
            setMascotState('SLITHER');
        }

        const nextP = Math.min(path.spiralEndDist, curP + stepSpeed);
        progressRef.current = nextP;

        // Advance sinusoidal wave phase
        wavePhaseRef.current += SNAKE_CONFIG.WAVE_FREQ;

        // 2. Overlapping Head Lift: triggers during last 20% of swirl (Phase Overlap)
        if (swirlProgress >= 1 - SNAKE_CONFIG.PHASE_OVERLAP && liftStartTimeRef.current === 0) {
            liftStartTimeRef.current = performance.now();
        }

        let easeLift = 0;
        if (liftStartTimeRef.current > 0) {
            const elapsed = performance.now() - liftStartTimeRef.current;
            const k = Math.min(1, elapsed / SNAKE_CONFIG.NECK_LIFT_DURATION_MS);
            // Smoothstep easing for neck lift
            easeLift = k * k * (3 - 2 * k);

            if (k >= 1 && nextP >= path.spiralEndDist) {
                // Swirl and neck lift both complete -> Seamlessly transition to REST!
                liftStartTimeRef.current = 0;
                isAnimatingRef.current = false;
                setMascotState('REST');
                setCoiledPos({ ...currentCardPosRef.current });

                // Tongue flick on arrival
                setIsTongueFlicking(true);
                setTimeout(() => setIsTongueFlicking(false), 320);
                return;
            }
        }

        // 3. Sample Every Segment: each segment i sits at distance (nextP - s_i)
        // Because every segment rides the same path, the entire body winds in order!
        const neckSegCount = Math.floor(N * SNAKE_CONFIG.NECK_PERCENT);

        for (let i = 0; i < N; i++) {
            const segDist = i * segStep;
            const d_i = nextP - segDist;
            const sample = samplePathAtDistance(path, d_i);

            // Normal vector orientation: Yellow belly stripe oriented toward inner coil side
            let normX = sample.normalX;
            let normY = sample.normalY;

            if (d_i >= path.travelEndDist && path.targetCenter) {
                const toCenterX = path.targetCenter.x - sample.x;
                const toCenterY = path.targetCenter.y - sample.y;
                const dot = normX * toCenterX + normY * toCenterY;
                if (dot < 0) {
                    normX = -normX;
                    normY = -normY;
                }
            }

            // S-Wave Lateral Offset with smoothstep fade-out before spiral entry
            let lateralOffset = 0;
            if (d_i < path.travelEndDist) {
                const distToSpiral = path.travelEndDist - d_i;
                let fade = 1;
                if (distToSpiral < SNAKE_CONFIG.WAVE_FADE_DIST) {
                    const t = Math.max(0, distToSpiral / SNAKE_CONFIG.WAVE_FADE_DIST);
                    fade = t * t * (3 - 2 * t); // Smoothstep fade to 0
                }
                lateralOffset =
                    Math.sin(wavePhaseRef.current - i * SNAKE_CONFIG.WAVE_SPATIAL_FREQ) *
                    (SNAKE_CONFIG.WAVE_AMP * fade);
            }

            let segX = sample.x + normX * lateralOffset;
            let segY = sample.y + normY * lateralOffset;
            let segAngle = sample.angle;

            // Neck Lift blending: first 28% lifts upward while coil below stays rooted
            if (i < neckSegCount && easeLift > 0) {
                const weight = 1 - i / neckSegCount;
                segY -= easeLift * weight * SNAKE_CONFIG.NECK_HEIGHT_PX;
                segX += Math.sin(weight * Math.PI) * (3.5 * easeLift * (path.dir || 1));
                // Rotate head and neck smoothly toward upright angle (-72 deg)
                segAngle = sample.angle * (1 - easeLift * weight) + (-1.25) * (easeLift * weight);
            }

            spine[i] = {
                x: segX,
                y: segY,
                angle: segAngle,
                normalX: normX,
                normalY: normY,
            };
        }

        setRenderTrigger((prev) => (prev + 1) % 1000);
        animFrameRef.current = requestAnimationFrame(runPhysicsLoop);
    }, []);

    // Handle Card Hover with Seamless Mid-Travel / Mid-Swirl Re-routing
    useEffect(() => {
        if (!targetCardId) return;

        const newTarget = getCardTargetPosition(targetCardId);
        if (!newTarget) return;

        // First initialization
        if (spineRef.current.length === 0) {
            initSpineAt(newTarget);
            setCoiledPos(newTarget);
            setMascotState('REST');
            return;
        }

        // Reduced motion fallback
        if (reducedMotion) {
            currentCardPosRef.current = { ...newTarget };
            setCoiledPos(newTarget);
            setMascotState('REST');
            return;
        }

        // Current head position & heading
        const currentSpine = spineRef.current;
        const currentHead = currentSpine[0] || { x: currentCardPosRef.current.x, y: currentCardPosRef.current.y };
        const currentHeading = currentSpine[0]?.angle || 0;

        const distToNewTarget = Math.hypot(
            newTarget.x - currentHead.x,
            newTarget.y - currentHead.y
        );

        if (distToNewTarget > 15) {
            // Build one continuous guide path from current state to new target
            const newGuidePath = buildGuidePath(
                currentHead,
                currentHeading,
                currentSpine,
                newTarget
            );

            guidePathRef.current = newGuidePath;
            progressRef.current = newGuidePath.startDist; // Start at head of prepended history
            currentCardPosRef.current = { ...newTarget };
            liftStartTimeRef.current = 0;
            isAnimatingRef.current = true;
            setMascotState('SLITHER');

            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
            animFrameRef.current = requestAnimationFrame(runPhysicsLoop);
        }
    }, [targetCardId, getCardTargetPosition, reducedMotion, runPhysicsLoop]);

    // Clean up animation on unmount
    useEffect(() => {
        return () => {
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-visible">
            {/* 1. REST STATE: Taller Coiled Mascot (Exact center alignment with targetCenter) */}
            {mascotState === 'REST' && (
                <div
                    style={{
                        transform: `translate3d(${coiledPos.x - 53}px, ${coiledPos.y - 106}px, 0)`,
                        transition: reducedMotion ? 'transform 0.4s ease-out' : 'none',
                    }}
                    className="absolute top-0 left-0 transition-opacity duration-200"
                >
                    {/* Subtle idle breathing animation */}
                    <div className="relative animate-[bounce_4.5s_ease-in-out_infinite]">
                        <CoiledSnakeSVG isFlicking={isTongueFlicking} />
                    </div>
                </div>
            )}

            {/* 2. DYNAMIC STATES: Articulated 60fps Body (SLITHER, SWIRL, LIFT_HEAD) */}
            {(mascotState === 'SLITHER' || mascotState === 'SWIRL' || mascotState === 'LIFT_HEAD') && (
                <ArticulatedSnakeSVG
                    spine={spineRef.current}
                    isFlicking={isTongueFlicking}
                />
            )}
        </div>
    );
}

// Sample Data Structure
const FLAGSHIP_BOOTCAMP = {
    id: 'bootcamp-2026',
    title: 'DSSA Unplugged',
    tag: 'Flagship Multi-Day Event',
    date: 'October 26 - 27, 2026',
    time: '4:00 PM - 7:00 PM IST',
    venue: 'D-Building , Class D201',
    capacity: '150 Seats',
    registeredCount: 118,
    isUpcoming: true,
    category: 'Event',
    description: `Get ready for the ultimate annual fest of the Data Science Student Association (DSSA)! This isn’t just another event — it’s a full-blown celebration of data, design, and innovation crafted exclusively for you. 
  
`,
    days: [
        {
            day: 'Day 1',
            date: 'Nov 15',
            title: 'Python Fundamentals & Data Wrangling',
            desc: 'Master list comprehensions, NumPy vectorization, data cleaning pipelines, and robust data preprocessing techniques.',
            topics: ['NumPy Matrices', 'Pandas Series & DataFrames', 'Handling Nulls & Outliers'],
            badge: 'Beginner to Intermediate',
        },
        {
            day: 'Day 2',
            date: 'Nov 16',
            title: 'Exploratory Data Analysis (EDA) & Visualization',
            desc: 'Uncover deep insights using Seaborn, Matplotlib, and Plotly interactive charts with real-world case study datasets.',
            topics: ['Statistical Distributions', 'Correlation Heatmaps', 'Interactive Storytelling'],
            badge: 'Analytical Mastery',
        },
        {
            day: 'Day 3',
            date: 'Nov 17',
            title: 'Applied Machine Learning & Scikit-Learn',
            desc: 'Build, tune, and evaluate regression and classification algorithms with feature engineering and cross-validation.',
            topics: ['Random Forests', 'Hyperparameter Tuning', 'Model Evaluation Metrics'],
            badge: 'Core ML Foundations',
        },
        {
            day: 'Day 4',
            date: 'Nov 18',
            title: 'Live ML Hackathon & Capstone Project',
            desc: 'Compete in teams to solve a live Kaggle-style challenge, deploy lightweight models, and win prizes & certificates.',
            topics: ['Model Deployment', 'Speed Kaggle Challenge', 'Prize Ceremony'],
            badge: 'Competition & Awards',
        },
    ],
};

const UPCOMING_EVENTS = [
    {
        id: 'up-1',
        title: 'Neural Networks & Deep Learning Deep-Dive',
        date: 'December 05, 2026',
        time: '2:30 PM - 5:30 PM',
        venue: 'Computer Lab 3 & Discord',
        capacity: '80 Seats',
        category: 'Hands-on Workshop',
        isUpcoming: true,
        description: `A hands-on introduction to building neural network architectures from scratch using PyTorch and TensorFlow. Learn forward propagation, loss optimization, and CNNs for image classification.`,
        speaker: 'Dr. Vivek Sharma (AI Research Lead)',
        level: 'Intermediate',
    },
    {
        id: 'up-2',
        title: 'DataStorm 2026: 24-Hour Datathon',
        date: 'December 20 - 21, 2026',
        time: '10:00 AM Onwards',
        venue: 'Campus Innovation Center',
        capacity: '300 Participants (Teams of 3-4)',
        category: 'Hackathon',
        isUpcoming: true,
        description: `Our premier annual datathon where students solve pressing industry problems across Healthcare, Fintech, and Climate Analytics. Mentorship from top data leaders and ₹50,000+ prize pool.`,
        speaker: 'Industry Judges & DSSA Alumni',
        level: 'All Skill Levels',
    },
    {
        id: 'up-3',
        title: 'Industry Connect: Career Pathways in Big Data & GenAI',
        date: 'January 10, 2027',
        time: '5:00 PM - 6:30 PM',
        venue: 'Auditorium 1',
        capacity: '200 Seats',
        category: 'Guest Lecture',
        isUpcoming: true,
        description: `Get real-world advice on breaking into Data Science roles, acing technical interviews, portfolio building, and trends in Generative AI from industry veterans.`,
        speaker: 'Panel of Senior Data Engineers & ML Scientists',
        level: 'Open for All',
    },
];

const PAST_EVENTS = [
    {
        id: 'past-1',
        title: 'Intro to Pandas & Data Science Starter Pack',
        date: 'September 12, 2026',
        category: 'Workshop',
        isUpcoming: false,
        imagePlaceholder: 'Image Placeholder / Workshop Banner',
        description:
            'A kickstarter session for beginners introducing the fundamentals of Python for scientific computing, tabular data manipulation, and exploratory workflows.',
        stats: '140+ Attendees • 98% Positive Feedback',
        venue: 'Lab 201',
    },
    {
        id: 'past-2',
        title: 'NLP & Large Language Models Hands-On Lab',
        date: 'August 24, 2026',
        category: 'Technical Session',
        isUpcoming: false,
        imagePlaceholder: 'Image Placeholder / LLM Lab Session',
        description:
            'Demystified transformer architectures, tokenization, HuggingFace pipeline integrations, and prompt engineering strategies with live coding notebooks.',
        stats: '110+ Attendees • 4 Live Demos',
        venue: 'Seminar Hall B',
    },
    {
        id: 'past-3',
        title: 'DataViz Challenge: Storytelling with PowerBI & Tableau',
        date: 'July 18, 2026',
        category: 'Competition',
        isUpcoming: false,
        imagePlaceholder: 'Image Placeholder / Dashboard Exhibition',
        description:
            'Students presented interactive business intelligence dashboards analyzing urban mobility and sustainable energy datasets in front of a jury panel.',
        stats: '45 Teams • ₹20k Prize Distributed',
        venue: 'Virtual Showcase',
    },
    {
        id: 'past-4',
        title: 'Alumni AMA: Cracking FAANG & Data Internships',
        date: 'June 05, 2026',
        category: 'Webinar',
        isUpcoming: false,
        imagePlaceholder: 'Image Placeholder / Alumni Panel',
        description:
            'Interactive fireside chat featuring DSSA alumni sharing their interview experiences, resume building tips, and open-source contribution practices.',
        stats: '220+ Live Viewers • 5 Alumni Speakers',
        venue: 'Zoom & YouTube Live',
    },
];

export default function EventsPage() {
    // Navigation / Modal states
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTab, setModalTab] = useState('overview');

    // Multi-day timeline active states
    const [activeDayIndex, setActiveDayIndex] = useState(0);
    const timelineScrollRef = useRef(null);

    // Mascot tracking targets across Upcoming Events
    const [activeMascotCardId, setActiveMascotCardId] = useState('day-0');
    const upcomingSectionRef = useRef(null);
    const cardRefs = useRef({});

    // Filter for Past Events
    const [pastFilter, setPastFilter] = useState('All');
    const [pastSearch, setPastSearch] = useState('');

    const openModal = (event, tab = 'overview') => {
        setSelectedEvent(event);
        setModalTab(tab);
        setIsModalOpen(true);
    };

    const scrollTimeline = (direction) => {
        if (timelineScrollRef.current) {
            const scrollAmount = direction === 'left' ? -280 : 280;
            timelineScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // When hovering any card, snake smoothly slithers to it
    const handleCardHover = (cardId) => {
        setActiveMascotCardId(cardId);
    };

    // When cursor leaves the entire upcoming section, snake returns home
    const handleSectionMouseLeave = () => {
        setActiveMascotCardId(`day-${activeDayIndex}`);
    };

    // Filtered past events
    const filteredPastEvents = PAST_EVENTS.filter((evt) => {
        const matchesFilter = pastFilter === 'All' || evt.category === pastFilter;
        const matchesSearch =
            evt.title.toLowerCase().includes(pastSearch.toLowerCase()) ||
            evt.description.toLowerCase().includes(pastSearch.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="relative min-h-screen bg-slate-950 text-slate-100 pb-24 overflow-hidden">
            {/* Background Decorative Lighting Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Hero Header Section */}
            <section className="pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative z-10">


                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                    Events & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">Workshops</span>
                </h1>
                <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                    Explore upcoming hands-on bootcamps, hackathons, and speaker sessions, or delve into our archive of past tech events.
                </p>

                {/* Quick In-Page Jump Links */}
                <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                    <a
                        href="#upcoming-section"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition shadow-lg shadow-blue-600/20"
                    >
                        <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
                        Upcoming Events (High Priority)
                    </a>
                    <a
                        href="#past-section"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs sm:text-sm font-medium transition"
                    >
                        <History className="w-4 h-4 text-slate-400" />
                        Past Events Archive
                    </a>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* SECTION 1: UPCOMING EVENTS (High Visibility, First) */}
            {/* ========================================================================= */}
            <section
                id="upcoming-section"
                ref={upcomingSectionRef}
                onMouseLeave={handleSectionMouseLeave}
                className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative z-10"
            >
                {/* Dynamic Cartoon Snake Mascot Tracker (Travels between hovered cards) */}
                <CartoonSnakeMascot
                    targetCardId={activeMascotCardId}
                    sectionRef={upcomingSectionRef}
                    cardRefs={cardRefs}
                />

                <div className="flex items-center justify-between gap-4 mb-6 border-b border-slate-800/80 pb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Live & Open For Registrations</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                            Upcoming Events
                        </h2>
                    </div>
                    <span className="hidden sm:block text-xs text-slate-400">
                        Hover cards to watch the snake slither & swirl into a coil!
                    </span>
                </div>

                {/* 1.1 FLAGSHIP BOOTCAMP CARD */}
                <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-blue-500/30 p-6 sm:p-8 shadow-2xl shadow-blue-950/40 mb-12 overflow-hidden">
                    {/* Top highlight gradient */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-amber-400 to-indigo-500" />

                    {/* Badge & Meta */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                {FLAGSHIP_BOOTCAMP.tag}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                                4-Day Series
                            </span>
                        </div>

                        {/* Live Registration Progress */}
                        <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
                            <span className="font-semibold text-emerald-400">
                                {FLAGSHIP_BOOTCAMP.registeredCount} / {FLAGSHIP_BOOTCAMP.capacity}
                            </span>
                            <span>filled</span>
                            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
                                    style={{ width: `${(FLAGSHIP_BOOTCAMP.registeredCount / 150) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Title & Description */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        <div className="lg:col-span-2 space-y-3">
                            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                                {FLAGSHIP_BOOTCAMP.title}
                            </h3>
                            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                                {FLAGSHIP_BOOTCAMP.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-blue-400" />
                                    {FLAGSHIP_BOOTCAMP.date}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-blue-400" />
                                    {FLAGSHIP_BOOTCAMP.time}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-blue-400" />
                                    {FLAGSHIP_BOOTCAMP.venue}
                                </span>
                            </div>
                        </div>

                        {/* Quick Action Box */}
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-end items-stretch lg:items-end">
                            <button
                                onClick={() =>
                                    openModal(
                                        {
                                            ...FLAGSHIP_BOOTCAMP,
                                            schedule: FLAGSHIP_BOOTCAMP.days,
                                        },
                                        'register'
                                    )
                                }
                                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group"
                            >
                                <span>Register for Bootcamp</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() =>
                                    openModal(
                                        {
                                            ...FLAGSHIP_BOOTCAMP,
                                            schedule: FLAGSHIP_BOOTCAMP.days,
                                        },
                                        'overview'
                                    )
                                }
                                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium transition text-center"
                            >
                                View Full Syllabus & Requirements
                            </button>
                        </div>
                    </div>

                    {/* 1.2 INTERACTIVE MULTI-DAY TIMELINE */}
                    <div className="mt-8 pt-6 border-t border-slate-800/80">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">
                                    Interactive Syllabus Navigator
                                </span>
                                <h4 className="text-base font-bold text-white flex items-center gap-2">
                                    <span>Explore Day-by-Day Modules</span>
                                    <span className="text-xs font-normal text-slate-400">(Hover cards to summon the mascot!)</span>
                                </h4>
                            </div>

                            {/* Scroll controls */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => scrollTimeline('left')}
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                                    aria-label="Scroll left"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => scrollTimeline('right')}
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                                    aria-label="Scroll right"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Horizontal Scrollable Days Track */}
                        <div
                            ref={timelineScrollRef}
                            className="flex gap-4 overflow-x-auto pb-4 pt-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent snap-x"
                        >
                            {FLAGSHIP_BOOTCAMP.days.map((item, idx) => {
                                const isActive = activeDayIndex === idx;
                                const cardKey = `day-${idx}`;

                                return (
                                    <div
                                        key={item.day}
                                        ref={(el) => (cardRefs.current[cardKey] = el)}
                                        onClick={() => {
                                            setActiveDayIndex(idx);
                                            handleCardHover(cardKey);
                                        }}
                                        onMouseEnter={() => handleCardHover(cardKey)}
                                        className={`min-w-[260px] sm:min-w-[280px] flex-1 snap-start p-5 rounded-2xl cursor-pointer transition-all duration-300 border relative ${isActive
                                            ? 'bg-slate-900 border-blue-500 shadow-xl shadow-blue-950/60 scale-[1.02]'
                                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                                            }`}
                                    >
                                        {/* Active Indicator Bar */}
                                        {isActive && (
                                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-amber-300 rounded-t-2xl" />
                                        )}

                                        <div className="flex items-center justify-between mb-2">
                                            <span
                                                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${isActive
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-slate-800 text-blue-400'
                                                    }`}
                                            >
                                                {item.day}
                                            </span>
                                            <span className="text-xs font-medium text-slate-400">{item.date}</span>
                                        </div>

                                        <h5 className="text-sm font-bold text-white mb-2 line-clamp-2">
                                            {item.title}
                                        </h5>

                                        <p className="text-xs text-slate-400 line-clamp-3 mb-3 leading-relaxed">
                                            {item.desc}
                                        </p>

                                        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                                            {item.topics.map((t, i) => (
                                                <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                                                    <CheckCircle2 className="w-3 h-3 text-blue-400 flex-shrink-0" />
                                                    <span className="truncate">{t}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-slate-400">
                                            <span className="italic text-amber-300/90">{item.badge}</span>
                                            <span className="text-blue-400 font-semibold flex items-center gap-0.5">
                                                View details &rarr;
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 1.3 MORE UPCOMING EVENTS GRID */}
                <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span>More Upcoming Events & Hackathons</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {UPCOMING_EVENTS.map((event) => {
                            const cardKey = `event-${event.id}`;

                            return (
                                <div
                                    key={event.id}
                                    ref={(el) => (cardRefs.current[cardKey] = el)}
                                    onMouseEnter={() => handleCardHover(cardKey)}
                                    className="group flex flex-col justify-between rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-950/30 hover:-translate-y-1"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                {event.category}
                                            </span>
                                            <span className="text-xs text-slate-400">{event.level}</span>
                                        </div>

                                        <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                                            {event.title}
                                        </h4>

                                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                                            {event.description}
                                        </p>

                                        <div className="space-y-2 text-xs text-slate-400 py-2 border-t border-slate-800/80">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                                <span>{event.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5 text-blue-400" />
                                                <span>{event.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                                                <span className="truncate">{event.venue}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="w-3.5 h-3.5 text-blue-400" />
                                                <span>{event.capacity}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                                        <button
                                            onClick={() => openModal(event, 'overview')}
                                            className="text-xs text-slate-400 hover:text-white transition font-medium"
                                        >
                                            Event Details
                                        </button>
                                        <button
                                            onClick={() => openModal(event, 'register')}
                                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                                        >
                                            <span>Register</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* SECTION 2: PAST EVENTS (Comes Later, Clean Archive Grid) */}
            {/* ========================================================================= */}
            <section id="past-section" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-800/80 pb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <History className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Archive & History</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                            Past Events
                        </h2>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={pastSearch}
                                onChange={(e) => setPastSearch(e.target.value)}
                                placeholder="Search past events..."
                                className="pl-8 pr-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-40 sm:w-56"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-full border border-slate-800">
                            {['All', 'Workshop', 'Technical Session', 'Competition', 'Webinar'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setPastFilter(cat)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${pastFilter === cat
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-400 hover:text-slate-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Past Events Grid */}
                {filteredPastEvents.length === 0 ? (
                    <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800">
                        <Layers className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                        <p className="text-slate-400 text-sm">No past events match the selected criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredPastEvents.map((event) => (
                            <div
                                key={event.id}
                                className="flex flex-col rounded-2xl bg-slate-900/50 border border-slate-800/90 overflow-hidden hover:border-slate-700 transition duration-300 group"
                            >
                                {/* Image Placeholder Box */}
                                <div className="relative w-full h-44 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950 flex flex-col items-center justify-center p-4 text-center overflow-hidden border-b border-slate-800">
                                    <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors" />

                                    {/* Category Pill on top of image */}
                                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-950/80 backdrop-blur-sm text-blue-400 border border-slate-700">
                                        {event.category}
                                    </span>

                                    <div className="relative z-10 flex flex-col items-center gap-1 text-slate-400 group-hover:text-slate-200 transition-colors">
                                        <Layers className="w-8 h-8 text-blue-400/80" />
                                        <span className="text-xs font-medium tracking-wide">
                                            {event.imagePlaceholder}
                                        </span>
                                        <span className="text-[10px] text-slate-500">[Click to upload image]</span>
                                    </div>
                                </div>

                                {/* Date Positioned Closely Just Below Image */}
                                <div className="px-5 pt-3 pb-1 flex items-center justify-between text-xs text-blue-400 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{event.date}</span>
                                    </div>
                                    <span className="text-slate-400 text-[11px]">{event.venue}</span>
                                </div>

                                {/* Content: Title & Description */}
                                <div className="p-5 pt-2 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors mb-2">
                                            {event.title}
                                        </h3>
                                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                                            {event.description}
                                        </p>
                                    </div>

                                    {/* Highlights / Stats & Action */}
                                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                                        <span className="text-[11px] font-medium text-slate-400">
                                            {event.stats}
                                        </span>
                                        <button
                                            onClick={() => openModal(event, 'overview')}
                                            className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition"
                                        >
                                            <span>Recap</span>
                                            <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Global Event Modal for Registration & Full Overview */}
            <EventModal
                isOpen={isModalOpen}
                event={selectedEvent}
                initialTab={modalTab}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
