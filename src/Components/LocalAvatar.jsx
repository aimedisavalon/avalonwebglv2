import React, { useRef, useEffect, useMemo, useCallback } from "react";
import {
  Text,
  PerspectiveCamera,
  Billboard,
  useAnimations,
} from "@react-three/drei";
import { useSphere } from "@react-three/cannon";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { animationList } from "../Hooks/animationList";

function LocalAvatar({ name, x, z, model }) {
  const cameraRef = useRef(null);
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  const [playerBody, playerApi] = useSphere(() => ({
    mass: 10,
    args: [0.21],
    position: [x, 0.2, z],
    type: "Dynamic",
  }));

  const { actions } = useAnimations(animationList(), model.scene);

  let firstTimeView = true;
  const movingForward = useRef(false);
  const movingBackward = useRef(false);
  const pointerDown = useRef(false);
  let previousTouchX = useRef(0);
  let previousTouchY = useRef(0);

  // SPEED of character
  const WalkSpeed = 1;
  const WalkBackSpeed = 0.7;

  const tempCameraVector = useMemo(() => new THREE.Vector3(), []);
  const tempModelVector = useMemo(() => new THREE.Vector3(), []);

  const cameraOrigin = useMemo(() => new THREE.Vector3(0, 0.8, 0), []);
  const touchCameraOrigin = useMemo(() => new THREE.Vector3(0, 0.8, 0), []);

  useEffect(() => {
    let isMoving = false;

    const animateModel = (action1, action2) => {
      const nextAction = actions[action1];
      const current = actions[action2];
      current?.fadeOut(0.2);
      nextAction?.reset().fadeIn(0.2).play();
    };

    const mouseDown = (e) => {
      pointerDown.current = true;
    };
    const mouseUp = (e) => {
      pointerDown.current = false;
    };
    const keyDown = (e) => {
      const { keyCode } = e;
      if (keyCode === 87 || keyCode === 38) {
        movingForward.current = true;
        if (!isMoving) {
          animateModel("Walk", "Idle");
          isMoving = true;
        }
      }
      if (keyCode === 83 || keyCode === 40) {
        movingBackward.current = true;
        if (!isMoving) {
          animateModel("WalkBack", "Idle");
          isMoving = true;
        }
      }
    };
    const keyUp = (e) => {
      const { keyCode } = e;
      if (keyCode === 87 || keyCode === 38) {
        movingForward.current = false;
        if (isMoving) {
          animateModel("Idle", "Walk");
          isMoving = false;
        }
      }
      if (keyCode === 83 || keyCode === 40) {
        movingBackward.current = false;
        if (isMoving) {
          animateModel("Idle", "WalkBack");
          isMoving = false;
        }
      }
    };
    const pointerMove = (e) => {
      if (pointerDown.current) {
        const { movementX, movementY } = e;
        const offset = new THREE.Spherical().setFromVector3(
          cameraRef.current.position.clone().sub(touchCameraOrigin)
        );
        const phi = offset.phi - movementY * 0.02;
        offset.theta -= movementX * 0.02;
        offset.phi = Math.max(0.01, Math.min(0.45 * Math.PI, phi));
        cameraRef.current.position.copy(
          touchCameraOrigin
            .clone()
            .add(new THREE.Vector3().setFromSpherical(offset))
        );
        cameraRef.current.lookAt(
          containerRef.current.position.clone().add(touchCameraOrigin)
        );
      }
    };
    const touchMove = (e) => {
      let movementX, movementY;
      if (e.touches.length === 1) {
        const touch = e.touches[0];

        movementX = touch.clientX - previousTouchX.current;
        movementY = touch.clientY - previousTouchY.current;

        previousTouchX.current = touch.clientX;
        previousTouchY.current = touch.clientY;
      }
      const offset = new THREE.Spherical().setFromVector3(
        cameraRef.current.position.clone().sub(cameraOrigin)
      );
      const phi = offset.phi - movementY * 0.02;
      offset.theta -= movementX * 0.02;
      offset.phi = Math.max(0.01, Math.min(0.45 * Math.PI, phi));
      cameraRef.current.position.copy(
        cameraOrigin.clone().add(new THREE.Vector3().setFromSpherical(offset))
      );
      cameraRef.current.lookAt(
        containerRef.current.position.clone().add(cameraOrigin)
      );
    };

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    window.addEventListener("pointermove", pointerMove);
    window.addEventListener("touchmove", touchMove);

    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("touchmove", touchMove);
      previousTouchX.current = 0;
      previousTouchY.current = 0;
    };
  }, [
    cameraRef,
    containerRef,
    playerRef,
    cameraOrigin,
    touchCameraOrigin,
    actions,
  ]);

  const updatePlayer = useCallback(
    (state) => {
      if (movingForward.current || movingBackward.current) {
        // Get the X-Z plane in which camera is looking to move the player
        state.camera.getWorldDirection(tempCameraVector);
        const cameraDirection = tempCameraVector.setY(0).normalize();

        // Get the X-Z plane in which player is looking to compare with camera
        const playerDirection = containerRef.current
          .getWorldDirection(tempModelVector)
          .setY(0.6)
          .normalize();

        // Get the angle to x-axis. z component is used to compare if the angle is clockwise or anticlockwise since angleTo returns a positive value
        const cameraAngle = Math.atan2(cameraDirection.z, cameraDirection.x);
        const playerAngle = Math.atan2(playerDirection.z, playerDirection.x);

        // Get the angle to rotate the player to face the camera. Clockwise positive
        const angleToRotate = playerAngle - cameraAngle;

        // Get the shortest angle from clockwise angle to ensure the player always rotates the shortest angle
        let sanitisedAngle = angleToRotate;
        if (angleToRotate > Math.PI) {
          sanitisedAngle = angleToRotate - 2 * Math.PI;
        }
        if (angleToRotate < -Math.PI) {
          sanitisedAngle = angleToRotate + 2 * Math.PI;
        }

        // Rotate the model by a tiny value towards the camera direction
        playerRef.current.quaternion.setFromEuler(
          new THREE.Euler(0, sanitisedAngle, 0, "XYZ")
        );

        if (movingForward.current) {
          playerApi.velocity.set(
            cameraDirection.x * WalkSpeed,
            cameraDirection.y * WalkSpeed,
            cameraDirection.z * WalkSpeed
          );
          containerRef.current.position.set(pos.current[0], 0, pos.current[2]);
        } else {
          playerApi.velocity.set(
            -cameraDirection.x * WalkBackSpeed,
            -cameraDirection.y * WalkBackSpeed,
            -cameraDirection.z * WalkBackSpeed
          );
          containerRef.current.position.set(pos.current[0], 0, pos.current[2]);
        }
        state.camera.lookAt(
          containerRef.current.position.clone().add(cameraOrigin)
        );

        //Updated Player position
        let position = {
          x: containerRef.current.position.x,
          z: containerRef.current.position.z,
        };
        // console.log(position)
      } else {
        playerApi.velocity.set(0, 0, 0);
        playerApi.rotation.set(0, 0, 0);
      }
    },
    [
      playerRef,
      containerRef,
      playerApi,
      cameraOrigin,
      tempCameraVector,
      tempModelVector,
    ]
  );

  // useEffect for playerBodyUpdate
  const pos = useRef([0, 0, 0]);
  useEffect(() => {
    playerApi.position.subscribe((p) => {
      pos.current = p;
    });
  }, [playerApi.position]);

  useFrame((state) => {
    updatePlayer(state);
    if (firstTimeView) {
      actions["Idle"]?.play();
      cameraRef.current.lookAt(
        containerRef.current.position.clone().add(cameraOrigin)
      );
      firstTimeView = false;
    }
  });

  return (
    <>
      <group ref={containerRef} position={[x, 0, z]}>
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          fov={75}
          position={[0, 1.26, -1.05]}
        />
        <Billboard
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false}
          position={[0, 0.87, 0]}
        >
          <Text fontSize={0.05} color="#0b2c4b">
            {name}
          </Text>
        </Billboard>
        <mesh ref={playerRef} position={[0, 0, 0]} castShadow receiveShadow>
          <primitive object={model.scene} scale={0.45} />
        </mesh>
      </group>
      <mesh ref={playerBody} />
    </>
  );
}

export default LocalAvatar;
