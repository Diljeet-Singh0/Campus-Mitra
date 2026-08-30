import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Sparkles, ShieldCheck, HeartHandshake, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface CompanionVisualizerProps {
  isSpeaking?: boolean;
}

export const CompanionVisualizer: React.FC<CompanionVisualizerProps> = ({ isSpeaking = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x10b981, 2.5, 20);
    pointLight1.position.set(4, 4, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x14b8a6, 2.5, 20);
    pointLight2.position.set(-4, -4, 2);
    scene.add(pointLight2);

    // 3. Central 3D Energy Mesh (Wireframe Icosahedron + Core Sphere)
    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    // Outer Wireframe Orb
    const outerGeo = new THREE.IcosahedronGeometry(2.1, 3);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
      roughness: 0.2,
      metalness: 0.8
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    orbGroup.add(outerMesh);

    // Inner Glowing Core
    const innerGeo = new THREE.SphereGeometry(1.4, 32, 32);
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      transmission: 0.6,
      thickness: 1.2,
      transparent: true,
      opacity: 0.9
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    orbGroup.add(innerMesh);

    // Orbiting 3D Ring 1
    const ringGeo = new THREE.TorusGeometry(3.0, 0.04, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x2dd4bf,
      emissive: 0x0d9488,
      emissiveIntensity: 0.6,
      roughness: 0.3
    });
    const ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh1.rotation.x = Math.PI / 3;
    ringMesh1.rotation.y = Math.PI / 6;
    orbGroup.add(ringMesh1);

    // Orbiting 3D Ring 2
    const ringMesh2 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh2.rotation.x = -Math.PI / 4;
    ringMesh2.rotation.y = -Math.PI / 3;
    orbGroup.add(ringMesh2);

    // 4. Surrounding Particle Halo
    const particleCount = 80;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 3.2 + Math.random() * 1.5;

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.08,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    orbGroup.add(particles);

    // Original positions array for vertex displacement animation
    const posAttr = outerGeo.attributes.position as THREE.BufferAttribute;
    const originalPositions = posAttr.array.slice() as Float32Array;

    // Mouse tilt tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX = (x / rect.width) * 0.8;
      mouseY = (y / rect.height) * 0.8;
    };

    container.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += isSpeaking ? 0.04 : 0.015;

      // Mouse Parallax interpolation
      targetX += (mouseX - targetX) * 0.08;
      targetY += (mouseY - targetY) * 0.08;

      orbGroup.rotation.y = time * 0.3 + targetX;
      orbGroup.rotation.x = Math.sin(time * 0.2) * 0.2 + targetY;
      ringMesh1.rotation.z = time * 0.5;
      ringMesh2.rotation.z = -time * 0.4;
      particles.rotation.y = -time * 0.2;

      // Pulsing Scale & Deformation
      const pulseFactor = isSpeaking
        ? 1.0 + Math.sin(time * 4) * 0.08
        : 1.0 + Math.sin(time * 1.5) * 0.03;

      innerMesh.scale.set(pulseFactor, pulseFactor, pulseFactor);

      // Vertex Morphing Wave on Outer Mesh
      const positions = posAttr.array as Float32Array;
      const amp = isSpeaking ? 0.25 : 0.08;

      for (let i = 0; i < positions.length; i += 3) {
        const ox = originalPositions[i];
        const oy = originalPositions[i + 1];
        const oz = originalPositions[i + 2];

        const wave = Math.sin(ox * 3 + time * 3) * Math.cos(oy * 3 + time * 3) * amp;
        positions[i] = ox * (1 + wave);
        positions[i + 1] = oy * (1 + wave);
        positions[i + 2] = oz * (1 + wave);
      }

      posAttr.needsUpdate = true;

      // Light Intensity modulation when speaking
      pointLight1.intensity = isSpeaking ? 3.2 + Math.sin(time * 6) * 1.2 : 2.5;
      innerMat.emissiveIntensity = isSpeaking ? 1.3 + Math.sin(time * 5) * 0.4 : 0.8;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [isSpeaking]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="w-full h-full min-h-[440px] glass-panel rounded-3xl p-6 flex flex-col items-center justify-between relative overflow-hidden border border-emerald-500/20 shadow-2xl"
    >
      {/* Glow backgrounds */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 tracking-wide">MannMitra AI 3D Avatar</span>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Three.js Engine
        </span>
      </div>

      {/* THREE.JS 3D AVATAR CANVAS */}
      <div className="w-full h-64 relative flex items-center justify-center my-2 z-10 cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full flex items-center justify-center" />

        {/* Center overlay badge */}
        <div className="absolute bottom-1 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-950/80 border border-emerald-500/30 text-[10px] font-extrabold text-slate-900 dark:text-slate-200 tracking-wider uppercase backdrop-blur-md pointer-events-none flex items-center gap-1.5 shadow-md">
          <Eye className="w-3 h-3 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          {isSpeaking ? 'Empathetic Listening Active' : 'Calm Presence Ready'}
        </div>
      </div>

      {/* Audio Waveform Equalizer Bar */}
      <div className="flex items-center justify-center gap-1.5 z-10 py-1">
        {[40, 75, 35, 95, 55, 85, 45, 70, 30].map((h, i) => (
          <div
            key={i}
            style={{ height: `${isSpeaking ? (h * (0.8 + Math.random() * 0.4)) / 2.5 : 8}px` }}
            className="w-1 rounded-full bg-emerald-600 dark:bg-emerald-400 transition-all duration-200"
          />
        ))}
      </div>

      {/* Footer Info */}
      <div className="w-full z-10 space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> Interactive 3D Companion Active
          </span>
          <span className="flex items-center gap-1">
            <HeartHandshake className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Non-Diagnostic
          </span>
        </div>
      </div>
    </motion.div>
  );
};
