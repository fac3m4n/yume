import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import type React from "react";
import { useMemo, useRef } from "react";
import BlurEffect from "react-progressive-blur";
import * as THREE from "three";

// import { Perf } from 'r3f-perf'

interface HelixRingsProps {
  levelsUp?: number;
  levelsDown?: number;
  stepY?: number;
  rotationStep?: number;
}

const HelixRings: React.FC<HelixRingsProps> = ({
  levelsUp = 10,
  levelsDown = 10,
  stepY = 0.85,
  rotationStep = Math.PI / 16,
}) => {
  const groupRef = useRef<THREE.Group>(new THREE.Group());

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  const ringGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const radius = 0.35;
    shape.absarc(0, 0, radius, 0, Math.PI * 2, false);

    const depth = 10;
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 4,
      curveSegments: 64,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.translate(0, 0, -depth / 2);

    return geometry;
  }, []);

  const elements = [];
  for (let i = -levelsDown; i <= levelsUp; i++) {
    elements.push({
      id: `helix-ring-${i}`,
      y: i * stepY,
      rotation: i * rotationStep,
    });
  }

  return (
    <group position={[5, 0, 0]} ref={groupRef} rotation={[0, 0, 0]} scale={1}>
      {elements.map((el) => (
        <mesh
          castShadow
          geometry={ringGeometry}
          key={el.id}
          position={[0, el.y, 0]}
          rotation={[0, Math.PI / 2 + el.rotation, 0]}
        >
          <meshPhysicalMaterial
            clearcoat={0}
            clearcoatRoughness={0.15}
            color="#45BFD3"
            iridescence={0.96}
            iridescenceIOR={1.5}
            iridescenceThicknessRange={[100, 400]}
            metalness={0.7}
            reflectivity={0}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};

export const Scene: React.FC = () => {
  return (
    <Canvas
      camera={{
        zoom: 70,
        position: [0, 0, 7],
        near: 0.1,
        far: 1000,
      }}
      className="h-full w-full"
      gl={{ antialias: true }}
      orthographic
      shadows
      style={{ background: "#ffffff" }}
    >
      <hemisphereLight
        color={"#cfe8ff"}
        groundColor={"#ffffff"}
        intensity={2}
      />

      <directionalLight
        castShadow
        color={"#ffeedd"}
        intensity={2}
        position={[10, 10, 5]}
        shadow-mapSize-height={2048}
        shadow-mapSize-width={2048}
      />

      <HelixRings />

      <EffectComposer multisampling={8}>
        <Bloom
          intensity={0.6}
          kernelSize={3}
          luminanceSmoothing={0.4}
          luminanceThreshold={0}
        />
        <Bloom
          intensity={0.5}
          kernelSize={KernelSize.HUGE}
          luminanceSmoothing={0}
          luminanceThreshold={0}
        />
      </EffectComposer>
      {/* <Perf position="top-left" /> */}
    </Canvas>
  );
};

interface HeroProps {
  title: string;
  description: string;
}

export const Hero: React.FC<HeroProps> = ({ title, description }) => {
  return (
    <section className="relative h-screen w-screen overflow-hidden bg-white font-sans text-gray-900 tracking-tight">
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      <div className="absolute bottom-4 left-4 z-20 max-w-md md:bottom-10 md:left-10">
        <h1 className="mb-3 font-light text-3xl tracking-tight">{title}</h1>
        <p className="font-light text-gray-700 text-sm leading-relaxed tracking-tight">
          {description}
        </p>
      </div>
      <BlurEffect
        className="absolute bottom-0 h-1/2 w-full bg-gradient-to-b from-transparent to-white/20 md:h-1/3"
        intensity={50}
        position="bottom"
      />
      <BlurEffect
        className="absolute top-0 h-1/2 w-full bg-gradient-to-b from-white/20 to-transparent md:h-1/3"
        intensity={50}
        position="top"
      />
    </section>
  );
};
