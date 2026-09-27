"use client";

import { Suspense, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CardMesh } from "@/components/hero-card-fan/card-mesh";
import { ParticleField } from "@/components/hero-card-fan/particle-field";
import { FanCard } from "@/components/hero-card-fan/fan-cards";
import { scrollToTarget } from "@/lib/scroll-to-target";

const ANGLE_STEP = 0.28;
const FAN_RADIUS = 4.2;
const FORWARD_BOOST = 0.22;
const DEAL_DROP = 2.6;
const DEAL_TILT = 0.7;
const DEAL_SHRINK = 0.3;

interface FanLayoutProps {
  cards: FanCard[];
  enableTilt: boolean;
  dealProgressRef?: RefObject<number>;
}

interface FanSceneProps extends FanLayoutProps {
  onContextLost?: () => void;
}

function FanLayout({ cards, enableTilt, dealProgressRef }: FanLayoutProps) {
  const groupRef = useRef<THREE.Group>(null);
  // Camera distance is tuned for the full 5-card spread; the 3-card mobile fan can sit larger.
  const baseScale = cards.length <= 3 ? 1.45 : 1;
  const { pointer } = useThree();
  const dustDensity = enableTilt ? 1 : 0.5;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const dealProgress = dealProgressRef?.current ?? 0;

    const tiltX = enableTilt ? THREE.MathUtils.clamp(-pointer.y, -1, 1) * 0.12 : 0;
    const tiltY = enableTilt ? THREE.MathUtils.clamp(pointer.x, -1, 1) * 0.18 : 0;

    const targetRotX = tiltX + dealProgress * DEAL_TILT;
    const targetRotY = tiltY;
    const targetPosY = -dealProgress * DEAL_DROP;
    const targetScale = baseScale * (1 - dealProgress * DEAL_SHRINK);

    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotX,
      5,
      delta,
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotY,
      5,
      delta,
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      targetPosY,
      5,
      delta,
    );
    const scale = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 5, delta);
    groupRef.current.scale.setScalar(scale);
  });

  const layout = useMemo(() => {
    const mid = (cards.length - 1) / 2;
    return cards.map((card, index) => {
      const t = index - mid;
      const angle = t * ANGLE_STEP;
      const forwardEmphasis = card.kind === "photo" ? FORWARD_BOOST * 1.6 : 0;
      // Cards sit on an arc around a pivot below the fan, like a hand of cards
      // held from underneath — this keeps adjacent cards from overlapping as
      // heavily as a flat horizontal layout would.
      const position: [number, number, number] = [
        FAN_RADIUS * Math.sin(angle),
        FAN_RADIUS * (Math.cos(angle) - 1),
        (mid - Math.abs(t)) * FORWARD_BOOST + forwardEmphasis,
      ];
      return {
        card,
        position,
        rotationZ: -angle,
        side: Math.sign(t),
        // Outermost cards dissolve first.
        order: mid - Math.abs(t),
      };
    });
  }, [cards]);

  return (
    <group ref={groupRef}>
      {layout.map(({ card, position, rotationZ, side, order }) => (
        <CardMesh
          key={card.key}
          position={position}
          rotationZ={rotationZ}
          label={card.label}
          kind={card.kind}
          index={card.index}
          destination={card.destination}
          side={side}
          dissolveOrder={order}
          dealProgressRef={dealProgressRef}
          dustDensity={dustDensity}
          onSelect={() => scrollToTarget(card.scrollTargetId)}
        />
      ))}
    </group>
  );
}

export function FanScene({ cards, enableTilt, onContextLost, dealProgressRef }: FanSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, -0.2, 9.2], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        const handleLost = (event: Event) => {
          event.preventDefault();
          onContextLost?.();
        };
        gl.domElement.addEventListener("webglcontextlost", handleLost);
      }}
    >
      <ambientLight intensity={0.7} color="#ffffff" />
      <directionalLight position={[2, 3, 4]} intensity={0.8} color="#57d9ff" />
      <directionalLight position={[-3, -1, 2]} intensity={0.3} color="#57d9ff" />
      <ParticleField density={enableTilt ? 1 : 0.5} />
      <Suspense fallback={null}>
        <FanLayout cards={cards} enableTilt={enableTilt} dealProgressRef={dealProgressRef} />
      </Suspense>
    </Canvas>
  );
}
