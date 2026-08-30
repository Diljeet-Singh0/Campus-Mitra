import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeBackgroundCanvasProps {
  theme?: 'dark' | 'light';
  className?: string;
}

export const ThreeBackgroundCanvas: React.FC<ThreeBackgroundCanvasProps> = ({
  theme = 'dark',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 28;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Sober & Elegant Floating Ambient Dust Particles
    const particleCount = 45;
    const positions = new Float32Array(particleCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 32;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;

      // Slow, calm movement
      velocities.push({
        x: (Math.random() - 0.5) * 0.005,
        y: (Math.random() - 0.5) * 0.005,
        z: (Math.random() - 0.5) * 0.003
      });
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Warm Emerald & Amber Dust Texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.35, theme === 'light' ? 'rgba(16, 185, 129, 0.7)' : 'rgba(52, 211, 153, 0.7)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);

    const particleColor = theme === 'light' ? 0x059669 : 0x34d399;
    const particleMaterial = new THREE.PointsMaterial({
      color: particleColor,
      size: 0.8,
      map: texture,
      transparent: true,
      opacity: theme === 'light' ? 0.55 : 0.75,
      blending: theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Very Soft Faint Ambient Lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: theme === 'light' ? 0x34d399 : 0x10b981,
      transparent: true,
      opacity: theme === 'light' ? 0.15 : 0.12
    });

    const linesGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * particleCount * 6);
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const linesMesh = new THREE.LineSegments(linesGeometry, lineMaterial);
    scene.add(linesMesh);

    // Subtle Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) * 0.0003;
      mouseY = (e.clientY - windowHalfY) * 0.0003;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Very subtle interpolation
      targetX += (mouseX - targetX) * 0.03;
      targetY += (mouseY - targetY) * 0.03;

      scene.rotation.y = targetX;
      scene.rotation.x = -targetY;

      // Move dust particles
      const posAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
      const currentPos = posAttr.array as Float32Array;

      let lineVertexIndex = 0;

      for (let i = 0; i < particleCount; i++) {
        currentPos[i * 3] += velocities[i].x;
        currentPos[i * 3 + 1] += velocities[i].y;
        currentPos[i * 3 + 2] += velocities[i].z;

        if (Math.abs(currentPos[i * 3]) > 25) velocities[i].x *= -1;
        if (Math.abs(currentPos[i * 3 + 1]) > 18) velocities[i].y *= -1;
        if (Math.abs(currentPos[i * 3 + 2]) > 12) velocities[i].z *= -1;

        // Faint delicate connections
        for (let j = i + 1; j < particleCount; j++) {
          const dx = currentPos[i * 3] - currentPos[j * 3];
          const dy = currentPos[i * 3 + 1] - currentPos[j * 3 + 1];
          const dz = currentPos[i * 3 + 2] - currentPos[j * 3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < 48) {
            linePositions[lineVertexIndex++] = currentPos[i * 3];
            linePositions[lineVertexIndex++] = currentPos[i * 3 + 1];
            linePositions[lineVertexIndex++] = currentPos[i * 3 + 2];

            linePositions[lineVertexIndex++] = currentPos[j * 3];
            linePositions[lineVertexIndex++] = currentPos[j * 3 + 1];
            linePositions[lineVertexIndex++] = currentPos[j * 3 + 2];
          }
        }
      }

      posAttr.needsUpdate = true;
      linesGeometry.setDrawRange(0, lineVertexIndex / 3);
      linesGeometry.attributes.position.needsUpdate = true;

      particleSystem.rotation.y += 0.0004;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      particleGeometry.dispose();
      particleMaterial.dispose();
      linesGeometry.dispose();
      lineMaterial.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return <div ref={containerRef} className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`} />;
};
