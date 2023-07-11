import { useFBX } from "@react-three/drei";

export function animationList() {
  const { animations: Walk } = useFBX("Animations/Walking.fbx");
  const { animations: Wave } = useFBX("Animations/Waving Gesture.fbx");
  const { animations: Idle } = useFBX("Animations/Idle.fbx");
  const { animations: Run } = useFBX("Animations/Run.fbx");
  const { animations: Jump } = useFBX("Animations/Jump.fbx");
  const { animations: Sitting } = useFBX("Animations/Sitting Idle.fbx");
  const { animations: WalkBack } = useFBX("Animations/Walking Backwards.fbx");
  Walk[0].name = "Walk";
  Wave[0].name = "Wave";
  Idle[0].name = "Idle";
  Run[0].name = "Run";
  Jump[0].name = "Jump";
  Sitting[0].name = "Sitting";
  WalkBack[0].name = "WalkBack";

  return [Walk[0],Wave[0],Idle[0],Run[0],Jump[0],Sitting[0],WalkBack[0]]
}
