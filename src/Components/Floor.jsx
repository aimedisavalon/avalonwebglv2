import { usePlane } from "@react-three/cannon";
import React from "react";

function Floor() {
  const [groundPhysics] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
  }));
  return (
    <>
      <mesh ref={groundPhysics}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial attach="material" color="silver" />
      </mesh>
    </>
  );
}

export default Floor;
