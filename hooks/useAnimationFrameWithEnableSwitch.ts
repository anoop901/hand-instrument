import { useEffect, useRef } from "react";

export default function useAnimationFrameWithEnableSwitch(
  callback: () => void,
  enable: boolean
) {
  const animationFrameIdRef = useRef<number | null>(null);
  useEffect(() => {
    const onAnimationFrame = () => {
      try {
        callback();
      } catch (e) {
        console.error(e);
      }
      animationFrameIdRef.current = requestAnimationFrame(onAnimationFrame);
    };

    const startAnimation = () => {
      if (animationFrameIdRef.current == null) {
        animationFrameIdRef.current = requestAnimationFrame(onAnimationFrame);
      }
    };
    const stopAnimation = () => {
      if (animationFrameIdRef.current != null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };

    if (enable) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => {
      stopAnimation();
    };
  }, [enable]);
}
