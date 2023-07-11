import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense } from "react";
import Floor from "../Components/Floor";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Physics, Debug } from "@react-three/cannon";
import LocalAvatar from "../Components/LocalAvatar";

function Lobby() {
  const gltf = useLoader(
    GLTFLoader,
    "https://models.readyplayer.me/647ee35f866a701f8313f55e.glb?quality=medium&meshLod=2&textureAtlas=512&pose=A&useDracoCompression=true"
  );

  return (
    <div className="w-full h-screen">
      <Suspense fallback={null}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <fog attach="fog" color="#ffffff" near={1} far={30} />
          <spotLight
            position={[10, 10, 10]}
            intensity={1}
            penumbra={1}
            castShadow
          />

          <Physics>
            {/* <Debug color={'black'} scale={1.4}> */}
              <LocalAvatar name={"GuestPlayer"} x={0} z={0} model={gltf} />
              <Floor />
            {/* </Debug> */}
          </Physics>
        </Canvas>
      </Suspense>
    </div>
  );
}

export default Lobby;
