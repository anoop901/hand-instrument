import { RefObject, useRef, useState } from "react";

export default function useCamera(videoRef: RefObject<HTMLVideoElement>) {
  const [cameraState, setCameraState] = useState<
    "disabled" | "enabling" | "enabled"
  >("disabled");
  const videoStreamRef = useRef<MediaStream | null>(null);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);

  const enableCamera = () => {
    if (cameraState === "disabled") {
      setCameraState("enabling");
      (async () => {
        try {
          const videoStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          const video = videoRef.current;
          if (video != null) {
            video.srcObject = videoStream;
            videoStreamRef.current = videoStream;
            video.addEventListener("loadeddata", () => {
              setCameraState("enabled");
              setWidth(video.videoWidth);
              setHeight(video.videoHeight);
            });
          } else {
            setCameraState("disabled");
          }
        } catch (e) {
          console.error(e);
          setCameraState("disabled");
        }
      })();
    }
  };

  const disableCamera = () => {
    if (cameraState === "enabled") {
      const videoStream = videoStreamRef.current;
      if (videoStream != null) {
        videoStream.getVideoTracks().forEach((track) => track.stop());
      }
      const video = videoRef.current;
      if (video != null) {
        video.srcObject = null;
      }
      setCameraState("disabled");
    }
  };

  return { cameraState, width, height, enableCamera, disableCamera };
}
