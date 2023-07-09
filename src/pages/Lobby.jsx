import {
  OrbitControls,
  PerspectiveCamera
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Avatar from "../Components/Avatar";

function Lobby() {
  

  return (
    <div className="w-full h-screen">
      <Suspense fallback={null}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <spotLight
            position={[10, 10, 10]}
            intensity={1}
            penumbra={1}
            castShadow
          />
          <OrbitControls />
          <PerspectiveCamera makeDefault position={[0, 1, 3]} />
          
          <Avatar/>

        </Canvas>
      </Suspense>
    </div>
  );
}

export default Lobby;
