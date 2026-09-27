"use client";

import { useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Text, Edges, useTexture } from "@react-three/drei";
import * as THREE from "three";

const DEEP = "#0a0a0a";
const PHOTO_FILL = "#0a0a0a";
const BONE = "#ffffff";
const BRASS = "#57d9ff";
const SIGNAL = "#57d9ff";
const MIDNIGHT = "#000000";

const CARD_WIDTH = 1.5;
const CARD_HEIGHT = 2.1;
const CARD_DEPTH = 0.04;

const PHOTO_MARGIN_SCALE = 0.94;

function PhotoFace() {
  const texture = useTexture("/images/hero-portrait.jpg");
  return (
    <mesh position={[0, 0, CARD_DEPTH / 2 + 0.002]}>
      <planeGeometry args={[CARD_WIDTH * PHOTO_MARGIN_SCALE, CARD_HEIGHT * PHOTO_MARGIN_SCALE]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

interface CardMeshProps {
  position: [number, number, number];
  rotationZ: number;
  label: string;
  kind: "project" | "photo";
  onSelect: () => void;
}

export function CardMesh({ position, rotationZ, label, kind, onSelect }: CardMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const labelRef = useRef<{ fillOpacity: number; outlineOpacity: number }>(null);
  const [hovered, setHovered] = useState(false);
  const labelOpacity = useRef(0);

  useFrame((_, delta) => {
    if (groupRef.current) {
      const targetY = position[1] + (hovered ? 0.28 : 0);
      const targetZ = position[2] + (hovered ? 0.35 : 0);
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        targetY,
        8,
        delta,
      );
      groupRef.current.position.z = THREE.MathUtils.damp(
        groupRef.current.position.z,
        targetZ,
        8,
        delta,
      );
    }

    labelOpacity.current = THREE.MathUtils.damp(
      labelOpacity.current,
      hovered ? 1 : 0,
      10,
      delta,
    );
    if (labelRef.current) {
      labelRef.current.fillOpacity = labelOpacity.current;
      labelRef.current.outlineOpacity = labelOpacity.current;
    }
  });

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(false);
    document.body.style.cursor = "auto";
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect();
  };

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, 0, rotationZ]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <mesh>
        <boxGeometry args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]} />
        <meshStandardMaterial
          color={kind === "photo" ? PHOTO_FILL : DEEP}
          roughness={0.35}
          metalness={0.25}
          emissive={hovered ? SIGNAL : "#000000"}
          emissiveIntensity={hovered ? 0.08 : 0}
        />
        <Edges color={BRASS} linewidth={1.2} />
      </mesh>

      {kind === "photo" && <PhotoFace />}

      <Text
        ref={labelRef}
        position={[0, -0.78, CARD_DEPTH / 2 + 0.01]}
        fontSize={0.1}
        color={BONE}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.3}
        textAlign="center"
        fillOpacity={0}
        outlineWidth={kind === "photo" ? 0.008 : 0}
        outlineColor={MIDNIGHT}
        outlineOpacity={0}
      >
        {label}
      </Text>
    </group>
  );
}
