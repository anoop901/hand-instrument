"use client";
import { useRef, useState } from "react";
import styles from "./page.module.css";
import { Landmark } from "@mediapipe/tasks-vision";
import useAnimationFrameWithEnableSwitch from "@/hooks/useAnimationFrameWithEnableSwitch";
import LandmarksDisplay from "@/components/LandmarksDisplay";
import useCamera from "@/hooks/useCamera";
import clsx from "clsx";
import useHandLandmarker from "@/hooks/useHandLandmarker";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const { cameraState, enableCamera, disableCamera, width, height } =
    useCamera(videoRef);
  const { handLandmarkerRef, handLandmarkerReady } = useHandLandmarker();

  const enableHandTracking = cameraState === "enabled" && handLandmarkerReady;
  const lastVideoTimeRef = useRef<number>(-1);
  const [worldLandmarkss, setWorldLandmarkss] = useState<Landmark[][]>([]);
  useAnimationFrameWithEnableSwitch(() => {
    const handLandmarker = handLandmarkerRef.current;
    const video = videoRef.current;
    if (handLandmarker != null && video != null) {
      const startTimeMs = performance.now();
      if (lastVideoTimeRef.current !== video.currentTime) {
        lastVideoTimeRef.current = video.currentTime;
        const landmarkerResult = handLandmarker.detectForVideo(
          video,
          startTimeMs
        );
        setWorldLandmarkss(landmarkerResult.worldLandmarks);
      }
    }
  }, enableHandTracking);

  return (
    <div>
      <button
        disabled={cameraState === "enabling"}
        onClick={() => {
          if (cameraState === "enabled") {
            disableCamera();
          } else if (cameraState === "disabled") {
            enableCamera();
          }
        }}
      >
        {cameraState === "enabled" ? "Disable" : "Enable"}
      </button>
      <div>
        <video
          className={clsx(styles.webcamPreview, styles.flipped)}
          autoPlay
          playsInline
          ref={videoRef}
        ></video>
      </div>
      <div>
        {worldLandmarkss.map((worldLandmarks, i) => (
          <LandmarksDisplay
            key={i}
            worldLandmarks={worldLandmarks}
            width={width}
            height={height}
          ></LandmarksDisplay>
        ))}
      </div>
    </div>
  );
}
