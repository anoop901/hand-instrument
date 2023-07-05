import useAnimationFrameWithEnableSwitch from "./useAnimationFrameWithEnableSwitch";

export default function useAnimationFrame(callback: () => void) {
  useAnimationFrameWithEnableSwitch(callback, true);
}
