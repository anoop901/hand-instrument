import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";
import styles from "./LandmarksDisplay.module.css";
import clsx from "clsx";
import * as THREE from "three";
import useAnimationFrame from "@/hooks/useAnimationFrame";

export default function LandmarksDisplay({
  worldLandmarks,
  width,
  height,
}: {
  worldLandmarks: NormalizedLandmark[];
  width: number;
  height: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const groupRef = useRef<THREE.Group | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const rendererRef = useRef<THREE.Renderer | null>(null);

  const [theta, setTheta] = useState(0);

  useAnimationFrame(() => {
    setTheta((theta) => theta + 0.1);
  });

  useEffect(() => {
    const camera = cameraRef.current;
    if (camera != null) {
      const newPosition = new THREE.Vector3(0, 0, 0.5).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        theta
      );
      camera.position.copy(newPosition);
      camera.rotation.y = theta;
    }
  }, [theta]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas != null) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 200 / 200, 0.1, 1000);

      const renderer = new THREE.WebGLRenderer({ canvas });
      renderer.setSize(200, 200);

      const group = new THREE.Group();
      scene.add(group);

      camera.position.z = 0.5;
      const light = new THREE.PointLight();
      light.position.copy(camera.position);

      renderer.render(scene, camera);

      groupRef.current = group;
      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;
    }
  }, []);

  const material = new THREE.MeshBasicMaterial();

  useEffect(() => {
    const group = groupRef.current;
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (group != null && renderer != null && scene != null && camera != null) {
      group.clear();
      for (const landmark of worldLandmarks) {
        const geometry = new THREE.SphereGeometry(0.01);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(landmark.x, -landmark.y, -landmark.z);
        group.add(mesh);
      }
      renderer.render(scene, camera);
    }
  }, [worldLandmarks]);
  return (
    <>
      <canvas
        className={clsx(styles.landmarksDisplay, styles.flipped)}
        width={width}
        height={height}
        ref={canvasRef}
      ></canvas>
    </>
  );
}
