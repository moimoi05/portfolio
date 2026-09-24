interface MagnetInput {
  x: number;
  y: number;
  left: number;
  top: number;
  width: number;
  height: number;
  padding: number;
  strength: number;
}

export function getMagnetOffset(input: MagnetInput) {
  const { x, y, left, top, width, height, padding, strength } = input;
  const active = x >= left - padding && x <= left + width + padding
    && y >= top - padding && y <= top + height + padding;
  if (!active || strength <= 0) return { x: 0, y: 0, active: false };
  return { x: (x - left - width / 2) / strength, y: (y - top - height / 2) / strength, active };
}

export function getMarqueeOffset(scrollY: number, sectionTop: number, viewportHeight: number) {
  return (scrollY - sectionTop + viewportHeight) * 0.3;
}
