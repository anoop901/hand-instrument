import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";

export default function useHandLandmarker() {
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const [handLandmarkerReady, setHandLandmarkerReady] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-tasks/hand_landmarker/hand_landmarker.task",
          },
          numHands: 2,
        });
        await handLandmarker.setOptions({ runningMode: "VIDEO" });
        handLandmarkerRef.current = handLandmarker;
        setHandLandmarkerReady(true);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      if (handLandmarkerRef.current != null) {
        handLandmarkerRef.current.close();
      }
    };
  }, []);

  return { handLandmarkerRef, handLandmarkerReady };
}
