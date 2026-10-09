"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

// 6 Core DSSA Domains matching master concept document
const DOMAINS = [
  // Left Side Domains on Desktop (0, 1, 2)
  {
    id: "ai-ml",
    faceIndex: 0, // +X: Right
    title: "AI / ML",
    subtitle: "Deep Learning & Neural Systems",
    tag: "Artificial Intelligence",
    targetRotation: { x: 0, y: -Math.PI / 2 },
    techStack: ["PyTorch", "TensorFlow", "Vision", "LLMs"],
    description: "Neural architectures, generative models, and computer vision systems.",
  },
  {
    id: "data-science",
    faceIndex: 1, // -X: Left
    title: "Data Science",
    subtitle: "Big Data & Predictive Models",
    tag: "Core Analytics",
    targetRotation: { x: 0, y: Math.PI / 2 },
    techStack: ["Python", "Pandas", "Scikit-Learn", "Statistics"],
    description: "End-to-end data pipelines, statistical modeling, and machine learning.",
  },
  {
    id: "analytics",
    faceIndex: 2, // +Y: Top
    title: "Analytics",
    subtitle: "Insights & Visual Intelligence",
    tag: "Data Intelligence",
    targetRotation: { x: Math.PI / 2, y: 0 },
    techStack: ["SQL", "Power BI", "Tableau", "Metrics"],
    description: "Extracting actionable insights from data to drive strategic decisions.",
  },
  // Right Side Domains on Desktop (3, 4, 5)
  {
    id: "development",
    faceIndex: 3, // -Y: Bottom
    title: "Development",
    subtitle: "Full-Stack, Cloud & Systems",
    tag: "Software Engineering",
    targetRotation: { x: -Math.PI / 2, y: 0 },
    techStack: ["Next.js", "FastAPI", "Docker", "PostgreSQL"],
    description: "Production-grade web apps, data visualization tools, and cloud backends.",
  },
  {
    id: "dssa-core",
    faceIndex: 4, // +Z: Front
    title: "DSSA Core",
    subtitle: "Data Science Student Association",
    tag: "VIT Pune Chapter",
    targetRotation: { x: 0, y: 0 },
    techStack: ["Community", "Workshops", "Hackathons", "Mentorship"],
    description: "The official technical student association empowering students with data.",
  },
  {
    id: "innovate",
    faceIndex: 5, // -Z: Back
    title: "Innovate",
    subtitle: "Research & Student Showcase",
    tag: "Student Impact",
    targetRotation: { x: 0, y: Math.PI },
    techStack: ["Research", "Open Source", "Competitions"],
    description: "Fostering academic excellence, innovation, and practical data applications.",
  },
];

export default function DataCube() {
  const containerRef = useRef(null);
  const [activeDomainIdx, setActiveDomainIdx] = useState(4); // Default: DSSA Core
  const [isClient, setIsClient] = useState(false);
  const snapTargetRef = useRef(null);
  const navScrollRef = useRef(null);
  const navBtnRefs = useRef([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-scroll the mobile navigation bar so the active domain pill is smoothly centered
  useEffect(() => {
    const scrollActiveIntoView = () => {
      const container = navScrollRef.current;
      const btn = navBtnRefs.current[activeDomainIdx];
      if (container && btn) {
        const containerRect = container.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        const currentScrollLeft = container.scrollLeft;
        const targetScrollLeft =
          currentScrollLeft +
          (btnRect.left - containerRect.left) -
          containerRect.width / 2 +
          btnRect.width / 2;

        container.scrollTo({
          left: Math.max(0, targetScrollLeft),
          behavior: "smooth",
        });
      }
    };

    scrollActiveIntoView();
    const timeoutId = setTimeout(scrollActiveIntoView, 80);
    return () => clearTimeout(timeoutId);
  }, [activeDomainIdx, isClient]);

  // Smoothly rotate cube to face when hovering or tapping a domain
  const handleDomainSelect = useCallback((idx) => {
    setActiveDomainIdx(idx);
    const domain = DOMAINS[idx];
    if (domain) {
      const q = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(domain.targetRotation.x, domain.targetRotation.y, 0, "YXZ")
      );
      snapTargetRef.current = q;
    }
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- Scene Setup: Pure Black Deep Space ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    // Adjusted for screen size
    const isMobile = width < 1024;
    camera.position.set(0, 0, isMobile ? 9.4 : 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 1);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const domElement = renderer.domElement;
    domElement.style.touchAction = "none";
    container.appendChild(domElement);

    // --- Clean Space Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(7, 8, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa1a1aa, 1.6);
    fillLight.position.set(-7, -6, -5);
    scene.add(fillLight);

    // --- Deep Black Space Starfield with Crisp White Stars ---
    const starCount = 1500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 50;
      starPositions[i + 1] = (Math.random() - 0.5) * 35;
      starPositions[i + 2] = (Math.random() - 0.5) * 35;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.038,
      transparent: true,
      opacity: 0.95,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // --- High-Resolution Crisp Monochrome Face Textures ---
    const texturesToDispose = [];

    function createFaceCanvasTexture(domain) {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const { title, subtitle, tag } = domain;

      // Pure deep space dark slate background
      ctx.fillStyle = "#050811";
      ctx.fillRect(0, 0, 512, 512);

      // Subtle technical grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= 512; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 512);
        ctx.stroke();
      }
      for (let y = 0; y <= 512; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
      }

      // Crisp clean white border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
      ctx.lineWidth = 3;
      ctx.strokeRect(32, 32, 448, 448);

      // Technical corner accents
      ctx.fillStyle = "#ffffff";
      const cSize = 26;
      const cThick = 5;
      // Top-Left
      ctx.fillRect(30, 30, cSize, cThick);
      ctx.fillRect(30, 30, cThick, cSize);
      // Top-Right
      ctx.fillRect(482 - cSize, 30, cSize, cThick);
      ctx.fillRect(482 - cThick, 30, cThick, cSize);
      // Bottom-Left
      ctx.fillRect(30, 482 - cThick, cSize, cThick);
      ctx.fillRect(30, 482 - cSize, cThick, cSize);
      // Bottom-Right
      ctx.fillRect(482 - cSize, 482 - cThick, cSize, cThick);
      ctx.fillRect(482 - cThick, 482 - cSize, cThick, cSize);

      // Top Tag Badge
      const badgeW = 240;
      const badgeH = 34;
      const bx = (512 - badgeW) / 2;
      const by = 66;
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(bx, by, badgeW, badgeH);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(tag.toUpperCase(), 256, by + badgeH / 2);

      // Main Domain Title
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 46px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(title, 256, 240);

      // Subtitle
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "500 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(subtitle, 256, 305);

      // Bottom Tech Sub-label
      ctx.fillStyle = "#94a3b8";
      ctx.font = "600 12px monospace";
      ctx.textAlign = "center";
      ctx.fillText("/// DSSA DOMAIN CORE", 256, 436);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texturesToDispose.push(texture);
      return texture;
    }

    // --- Build Large Central 3D Cube ---
    const materials = DOMAINS.map((domain) => {
      const tex = createFaceCanvasTexture(domain);
      return new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.25,
        metalness: 0.1,
      });
    });

    const boxSize = 2.85;
    const boxGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    const cubeMesh = new THREE.Mesh(boxGeo, materials);
    scene.add(cubeMesh);

    // Sharp white wireframe edges
    const edgesGeo = new THREE.EdgesGeometry(boxGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.45,
    });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    cubeMesh.add(edgesMesh);

    // Corner pinpoint nodes
    const vertexPositions = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1],
    ].map(([x, y, z]) => new THREE.Vector3((x * boxSize) / 2, (y * boxSize) / 2, (z * boxSize) / 2));

    const nodesGeo = new THREE.BufferGeometry().setFromPoints(vertexPositions);
    const nodesMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.09,
      transparent: true,
      opacity: 0.9,
    });
    const cornerNodes = new THREE.Points(nodesGeo, nodesMat);
    cubeMesh.add(cornerNodes);

    // Initial slight diagonal tilt
    const initialEuler = new THREE.Euler(0.2, 0.45, 0, "YXZ");
    cubeMesh.quaternion.setFromEuler(initialEuler);

    // --- Virtual Arcball Drag Physics (Zero Gimbal Lock) ---
    function getArcballVector(clientX, clientY) {
      const rect = domElement.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const size = Math.min(w, h);

      const x = (2 * (clientX - rect.left) - w) / size;
      const y = -(2 * (clientY - rect.top) - h) / size;

      const lenSq = x * x + y * y;
      let z = 0;
      if (lenSq <= 1.0) {
        z = Math.sqrt(1.0 - lenSq);
      } else {
        z = 0.5 / Math.sqrt(lenSq);
      }
      return new THREE.Vector3(x, y, z).normalize();
    }

    let isPointerDown = false;
    let activePointerId = null;
    let prevArcballVec = new THREE.Vector3(0, 0, 1);
    let angularAxis = new THREE.Vector3(0, 1, 0);
    let angularSpeed = 0;
    let lastInteractionTime = performance.now();

    const autoRotateAxis = new THREE.Vector3(0.2, 1, 0.12).normalize();

    const onPointerDown = (e) => {
      isPointerDown = true;
      snapTargetRef.current = null;
      activePointerId = e.pointerId;
      lastInteractionTime = performance.now();
      angularSpeed = 0;
      prevArcballVec = getArcballVector(e.clientX, e.clientY);

      try {
        domElement.setPointerCapture(e.pointerId);
      } catch (err) {}
    };

    const onPointerMove = (e) => {
      if (!isPointerDown) return;
      lastInteractionTime = performance.now();

      const currVec = getArcballVector(e.clientX, e.clientY);
      const axis = new THREE.Vector3().crossVectors(prevArcballVec, currVec);
      const axisLen = axis.length();

      if (axisLen > 0.0001) {
        axis.normalize();
        const dot = Math.max(-1, Math.min(1, prevArcballVec.dot(currVec)));
        const angle = Math.acos(dot) * 2.2;

        const deltaQ = new THREE.Quaternion().setFromAxisAngle(axis, angle);
        cubeMesh.quaternion.premultiply(deltaQ);

        angularAxis.copy(axis);
        angularSpeed = angle * 0.85;

        prevArcballVec.copy(currVec);
        detectActiveFace();
      }
    };

    const onPointerUp = (e) => {
      isPointerDown = false;
      lastInteractionTime = performance.now();
      if (activePointerId !== null) {
        try {
          domElement.releasePointerCapture(activePointerId);
        } catch (err) {}
        activePointerId = null;
      }
    };

    let currentFaceIdx = 4;

    function detectActiveFace() {
      const matrix = new THREE.Matrix4();
      matrix.extractRotation(cubeMesh.matrixWorld);

      const normals = [
        new THREE.Vector3(1, 0, 0),  // +X: AI/ML (0)
        new THREE.Vector3(-1, 0, 0), // -X: Data Science (1)
        new THREE.Vector3(0, 1, 0),  // +Y: Analytics (2)
        new THREE.Vector3(0, -1, 0), // -Y: Development (3)
        new THREE.Vector3(0, 0, 1),  // +Z: DSSA Core (4)
        new THREE.Vector3(0, 0, -1), // -Z: Innovate (5)
      ];

      let maxZ = -Infinity;
      let closestIdx = 4;

      normals.forEach((n, idx) => {
        const transformed = n.clone().applyMatrix4(matrix);
        if (transformed.z > maxZ) {
          maxZ = transformed.z;
          closestIdx = idx;
        }
      });

      if (closestIdx !== currentFaceIdx && DOMAINS[closestIdx]) {
        currentFaceIdx = closestIdx;
        setActiveDomainIdx(closestIdx);
      }
    }

    domElement.addEventListener("pointerdown", onPointerDown);
    domElement.addEventListener("pointermove", onPointerMove);
    domElement.addEventListener("pointerup", onPointerUp);
    domElement.addEventListener("pointercancel", onPointerUp);

    // --- Animation Loop ---
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const now = performance.now();
      const timeSinceInteraction = (now - lastInteractionTime) / 1000;

      // Subtle celestial floating (shifted higher on mobile to give generous spacing below for the card)
      const isMob = container.clientWidth < 1024;
      const baseY = isMob ? 0.55 : 0;
      cubeMesh.position.y = baseY + Math.sin(elapsedTime * 1.2) * 0.08;

      if (!prefersReducedMotion) {
        // Deep stars slow drift
        stars.rotation.y = elapsedTime * 0.01;
      }

      // --- Cube Rotation & Snap Logic ---
      if (snapTargetRef.current) {
        cubeMesh.quaternion.slerp(snapTargetRef.current, 0.08);
        if (cubeMesh.quaternion.angleTo(snapTargetRef.current) < 0.01) {
          cubeMesh.quaternion.copy(snapTargetRef.current);
          snapTargetRef.current = null;
          detectActiveFace();
        }
      } else if (!isPointerDown) {
        if (angularSpeed > 0.0004) {
          const inertiaQ = new THREE.Quaternion().setFromAxisAngle(angularAxis, angularSpeed);
          cubeMesh.quaternion.premultiply(inertiaQ);
          angularSpeed *= 0.94;
          detectActiveFace();
        } else if (!prefersReducedMotion && timeSinceInteraction > 2.5) {
          const blend = Math.min((timeSinceInteraction - 2.5) / 1.5, 1.0);
          const autoSpeed = 0.0045 * blend;
          const autoQ = new THREE.Quaternion().setFromAxisAngle(autoRotateAxis, autoSpeed);
          cubeMesh.quaternion.premultiply(autoQ);
          detectActiveFace();
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- Resize Observer ---
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      if (nw > 0 && nh > 0) {
        camera.aspect = nw / nh;
        const isMob = nw < 1024;
        camera.position.z = isMob ? 9.4 : 7.5;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      }
    });
    resizeObserver.observe(container);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      domElement.removeEventListener("pointerdown", onPointerDown);
      domElement.removeEventListener("pointermove", onPointerMove);
      domElement.removeEventListener("pointerup", onPointerUp);
      domElement.removeEventListener("pointercancel", onPointerUp);

      texturesToDispose.forEach((t) => t.dispose());
      materials.forEach((m) => m.dispose());
      boxGeo.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      nodesGeo.dispose();
      nodesMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();

      if (domElement.parentElement) {
        domElement.parentElement.removeChild(domElement);
      }
    };
  }, [isClient]);

  const leftDomains = DOMAINS.slice(0, 3);   // AI/ML, Data Science, Analytics
  const rightDomains = DOMAINS.slice(3, 6);  // Development, DSSA Core, Innovate
  const activeDomain = DOMAINS[activeDomainIdx] || DOMAINS[4];

  const renderDomainCard = (domain, originalIdx) => {
    const isActive = activeDomainIdx === originalIdx;
    return (
      <div
        key={domain.id}
        onMouseEnter={() => handleDomainSelect(originalIdx)}
        onClick={() => handleDomainSelect(originalIdx)}
        className={`px-4 py-3 rounded-xl border backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col gap-1.5 shadow-2xl ${
          isActive
            ? "bg-zinc-950/95 border-white text-white shadow-[0_0_25px_rgba(255,255,255,0.2)] scale-[1.03]"
            : "bg-zinc-950/80 hover:bg-zinc-900/90 border-zinc-800 hover:border-zinc-500 text-zinc-200"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isActive ? "bg-white shadow-[0_0_8px_#ffffff]" : "bg-zinc-500"
              }`}
            />
            <span className="text-sm font-bold tracking-tight text-white">
              {domain.title}
            </span>
          </div>

          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
            {domain.tag.split(" ")[0]}
          </span>
        </div>

        {/* Subtitle description */}
        <span className="text-[11px] text-zinc-400 font-medium leading-snug">
          {domain.subtitle}
        </span>

        {/* Expanded Tech Stack when Active */}
        {isActive && (
          <div className="pt-2 flex flex-col gap-1.5 border-t border-zinc-800 mt-1">
            <p className="text-[11px] text-zinc-300 leading-relaxed font-normal">
              {domain.description}
            </p>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {domain.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-900 text-zinc-200 border border-zinc-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full min-h-[860px] sm:min-h-[880px] lg:min-h-0 lg:h-full select-none bg-black flex flex-col justify-between overflow-x-hidden lg:overflow-hidden">
      {/* Full-Screen 3D Deep Space Canvas */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
      />

      {/* ─────────────────────────────────────────────────────────────
          1. DESKTOP VIEW: Balanced 6-Position Layout (3 Left, 3 Right)
          ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex absolute inset-0 pointer-events-none items-center justify-between px-6 xl:px-14 z-20">
        
        {/* Left Column (3 Domains) */}
        <div className="flex flex-col gap-5 sm:gap-6 w-60 xl:w-72 pointer-events-auto">
          {leftDomains.map((domain, idx) => renderDomainCard(domain, idx))}
        </div>

        {/* Right Column (3 Domains) */}
        <div className="flex flex-col gap-5 sm:gap-6 w-60 xl:w-72 pointer-events-auto">
          {rightDomains.map((domain, idx) => renderDomainCard(domain, idx + 3))}
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MOBILE VIEW: Top Nav, Centered 3D Cube, and Spaced Bottom Info
          ───────────────────────────────────────────────────────────── */}
      
      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden relative z-20 pt-4 px-3 flex justify-center pointer-events-auto">
        <div
          ref={navScrollRef}
          className="flex items-center gap-2 p-1.5 rounded-full bg-zinc-950/90 border border-zinc-800/90 backdrop-blur-lg overflow-x-auto max-w-full scrollbar-none shadow-2xl scroll-smooth"
        >
          {DOMAINS.map((domain, idx) => {
            const isActive = activeDomainIdx === idx;
            return (
              <button
                key={domain.id}
                ref={(el) => (navBtnRefs.current[idx] = el)}
                onClick={() => handleDomainSelect(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white text-black shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {domain.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Middle Spacer: Dedicated open space for 3D Cube interaction */}
      <div className="lg:hidden flex-1 min-h-[440px] pointer-events-none" />

      {/* Mobile Bottom Domain Info Drawer: Generous spacing below the 3D cube */}
      <div className="lg:hidden relative z-20 px-4 pt-8 pb-14 sm:pb-16 flex justify-center pointer-events-auto">
        <div className="w-full max-w-md p-4 sm:p-5 rounded-xl bg-zinc-950/95 border border-zinc-800/90 backdrop-blur-xl shadow-2xl flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#fff]" />
              <span className="text-sm font-bold text-white tracking-tight">{activeDomain.title}</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase font-semibold tracking-wider">
              {activeDomain.tag}
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed font-normal">{activeDomain.description}</p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {activeDomain.techStack.map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-900 text-zinc-200 border border-zinc-700/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
