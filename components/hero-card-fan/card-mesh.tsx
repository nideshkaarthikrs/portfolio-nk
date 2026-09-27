"use client";

import { useRef, useState, type RefObject } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Text, Edges, useTexture } from "@react-three/drei";
import * as THREE from "three";
import {
  CardDust,
  DISSOLVE_START_MOBILE,
  dissolveTarget,
  solidOpacity,
} from "@/components/hero-card-fan/card-dust";

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

const DISPLAY_FONT = "/fonts/Fraunces-SemiBold.ttf";
// Neighbouring cards overlap the inner edge, so role words lean toward the exposed outer edge.
const ROLE_TEXT_SHIFT = 0.2;

interface CardMeshProps {
  position: [number, number, number];
  rotationZ: number;
  label: string;
  kind: "role" | "photo";
  index?: string;
  destination: string;
  side: number;
  dissolveOrder: number;
  dealProgressRef?: RefObject<number>;
  dustDensity: number;
  onSelect: () => void;
}

// Past this point the card is mostly dust, so it stops reacting to the pointer.
const INTERACTIVE_MAX_DISSOLVE = 0.05;

type FadeableText = THREE.Object3D & { fillOpacity: number };

/** Applies the dissolve crossfade to every solid part of the card. */
function setSolidOpacity(root: THREE.Object3D, opacity: number) {
  root.visible = opacity > 0.001;
  root.traverse((obj) => {
    if ("fillOpacity" in obj) {
      (obj as FadeableText).fillOpacity = opacity;
      return;
    }
    const material = (obj as THREE.Mesh).material as THREE.Material | undefined;
    if (!material || Array.isArray(material)) return;
    material.transparent = opacity < 0.999;
    material.opacity = opacity;
  });
}

export function CardMesh({
  position,
  rotationZ,
  label,
  kind,
  index,
  destination,
  side,
  dissolveOrder,
  dealProgressRef,
  dustDensity,
  onSelect,
}: CardMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const solidRef = useRef<THREE.Group>(null);
  const lastSolid = useRef(1);
  const dissolveRef = useRef(0);
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

    // Damped so a fast flick still plays the disintegration instead of snapping.
    const target = dissolveTarget(
      dealProgressRef?.current ?? 0,
      dissolveOrder,
      dustDensity < 1 ? DISSOLVE_START_MOBILE : undefined,
    );
    const next = THREE.MathUtils.damp(dissolveRef.current, target, 4, delta);
    dissolveRef.current = Math.abs(next - target) < 0.001 ? target : next;
    const dissolve = dissolveRef.current;
    const solid = solidOpacity(dissolve);
    if (solidRef.current && solid !== lastSolid.current) {
      setSolidOpacity(solidRef.current, solid);
      lastSolid.current = solid;
    }
    if (hovered && dissolve > INTERACTIVE_MAX_DISSOLVE) {
      setHovered(false);
      document.body.style.cursor = "auto";
    }

    labelOpacity.current = THREE.MathUtils.damp(
      labelOpacity.current,
      hovered ? 1 : 0,
      10,
      delta,
    );
    if (labelRef.current) {
      labelRef.current.fillOpacity = labelOpacity.current * solid;
      labelRef.current.outlineOpacity = labelOpacity.current * solid;
    }
  });

  const isDissolving = () => dissolveRef.current > INTERACTIVE_MAX_DISSOLVE;

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (isDissolving()) return;
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
    if (isDissolving()) return;
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
      <group ref={solidRef}>
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

        {kind === "role" && (
          <>
            <Text
              position={[
                side > 0 ? CARD_WIDTH / 2 - 0.14 : -CARD_WIDTH / 2 + 0.14,
                CARD_HEIGHT / 2 - 0.16,
                CARD_DEPTH / 2 + 0.01,
              ]}
              fontSize={0.07}
              color={SIGNAL}
              anchorX={side > 0 ? "right" : "left"}
              anchorY="middle"
              letterSpacing={0.15}
            >
              {`// ${index ?? ""}`}
            </Text>
            <Text
              font={DISPLAY_FONT}
              position={[side * ROLE_TEXT_SHIFT, 0.05, CARD_DEPTH / 2 + 0.01]}
              fontSize={0.2}
              color={BONE}
              anchorX="center"
              anchorY="middle"
              maxWidth={1.0}
              textAlign="center"
              lineHeight={1.05}
            >
              {label}
            </Text>
          </>
        )}
      </group>

      <CardDust
        kind={kind}
        label={label}
        index={index}
        side={side}
        density={dustDensity}
        dissolveRef={dissolveRef}
        z={CARD_DEPTH / 2 + 0.012}
      />

      <Text
        ref={labelRef}
        position={[kind === "role" ? side * ROLE_TEXT_SHIFT : 0, -0.78, CARD_DEPTH / 2 + 0.01]}
        fontSize={kind === "photo" ? 0.1 : 0.08}
        color={kind === "photo" ? BONE : SIGNAL}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.3}
        textAlign="center"
        fillOpacity={0}
        outlineWidth={kind === "photo" ? 0.008 : 0}
        outlineColor={MIDNIGHT}
        outlineOpacity={0}
      >
        {kind === "photo" ? label : `→ ${destination}`}
      </Text>
    </group>
  );
}
