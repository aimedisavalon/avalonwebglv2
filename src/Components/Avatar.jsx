import { useAnimations, useFBX } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";

function Avatar() {
  const model = useRef();
  const gltf = useLoader(
    GLTFLoader,
    "https://models.readyplayer.me/647ee35f866a701f8313f55e.glb?quality=medium&meshLod=2&textureAtlas=512&pose=A&useDracoCompression=true"
  );

  const { animations: Walk } = useFBX("Animations/Walking.fbx");
  const { animations: Wave } = useFBX("Animations/Waving Gesture.fbx");
  const { animations: Idle } = useFBX("Animations/Idle.fbx");
  const { animations: Run } = useFBX("Animations/Run.fbx");
  const { animations: Jump } = useFBX("Animations/Jump.fbx");
  const { animations: Sitting } = useFBX("Animations/Sitting Idle.fbx");
  Walk[0].name = "Walk";
  Wave[0].name = "Wave";
  Idle[0].name = "Idle";
  Run[0].name = "Run";
  Jump[0].name = "Jump";
  Sitting[0].name = "Sitting";

  const { actions } = useAnimations(Wave, model);
  
  useEffect(()=>{
    actions['Wave']?.play()
  },[Walk])
  return (
    <>
      <primitive object={gltf.scene} ref={model} position={[0, -1, 0]} />
    </>
  );
}

export default Avatar;
