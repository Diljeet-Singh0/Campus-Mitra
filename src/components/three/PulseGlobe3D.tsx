import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface PulseGlobe3DProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PulseGlobe3D: React.FC<PulseGlobe3DProps> = ({
  className = '',
  size = 'md'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 5.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 2. Main Wireframe Globe Sphere
    const radius = 1.8;
    const sphereGeo = new THREE.SphereGeometry(radius, 24, 24);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      roughness: 0.5
    });
    const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeMesh);

    // Inner Glowing Core
    const coreGeo = new THREE.SphereGeometry(radius * 0.75, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.25
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // 3. Department Nodes (Glowing points on sphere surface)
    const nodeCoords = [
      { lat: 28.6, lon: 77.2 }, // CSE
      { lat: 19.0, lon: 72.8 }, // ECE
      { lat: 12.9, lon: 77.5 }, // ME
      { lat: 22.5, lon: 88.3 }, // Civil
      { lat: 13.0, lon: 80.2 }, // Physics
      { lat: 26.9, lon: 75.7 }, // Biotech
      { lat: 23.0, lon: 72.5 }, // MBA
      { lat: 17.3, lon: 78.4 }  // Design
    ];

    const nodesGroup = new THREE.Group();
    globeGroup.add(nodesGroup);

    // Particle texture for nodes
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(52, 211, 153, 1)');
      grad.addColorStop(0.5, 'rgba(99, 102, 241, 0.8)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    const nodeTexture = new THREE.CanvasTexture(canvas);

    nodeCoords.forEach(c => {
      const phi = (90 - c.lat) * (Math.PI / 180);
      const theta = (c.lon + 180) * (Math.PI / 180);

      const x = -(radius * 1.02 * Math.sin(phi) * Math.cos(theta));
      const z = radius * 1.02 * Math.sin(phi) * Math.sin(theta);
      const y = radius * 1.02 * Math.cos(phi);

      const nodeGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(x, y, z);
      nodesGroup.add(nodeMesh);

      // Pulse ring for each node
      const ringGeo = new THREE.RingGeometry(0.09, 0.15, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(x, y, z);
      ringMesh.lookAt(x * 2, y * 2, z * 2);
      nodesGroup.add(ringMesh);
    });

    // 4. Orbiting Ring
    const orbitGeo = new THREE.TorusGeometry(2.3, 0.02, 16, 100);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.6
    });
    const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
    orbitMesh.rotation.x = Math.PI / 3;
    globeGroup.add(orbitMesh);

    // Mouse tilt interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX = (x / rect.width) * 0.5;
      mouseY = (y / rect.height) * 0.5;
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
      time += 0.01;

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      globeGroup.rotation.y = time * 0.25 + targetX;
      globeGroup.rotation.x = Math.sin(time * 0.15) * 0.15 + targetY;
      orbitMesh.rotation.z = time * 0.4;

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

      sphereGeo.dispose();
      sphereMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      orbitGeo.dispose();
      orbitMat.dispose();
      nodeTexture.dispose();
      renderer.dispose();
    };
  }, []);

  const heightClass = size === 'sm' ? 'h-32' : size === 'lg' ? 'h-72' : 'h-52';

  return (
    <div ref={containerRef} className={`w-full ${heightClass} relative flex items-center justify-center pointer-events-auto ${className}`} />
  );
};
