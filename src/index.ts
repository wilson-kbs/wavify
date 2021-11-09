type NodeElement = string | HTMLElement;

interface Options {
  container?: string;
  // Height of wave
  height?: number;
  // Amplitude of wave
  amplitude?: number;
  // Animation speed
  speed?: number;
  // Total number of articulation in wave
  bones?: number;
  // position top or bottom
  position?: "TOP" | "BOTTOM";
  // Color
  color?: string;
}

class Wavify {
  constructor(el: NodeElement, options?: Options) {}
}
