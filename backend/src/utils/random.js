export const clamp = (n, min, max) => Math.max(min, Math.min(max, n))
export const rand = (min, max) => Math.random() * (max - min) + min
export const randInt = (min, max) => Math.floor(rand(min, max + 1))

export const drift = (value, step, min, max) => {
  const v = value + (Math.random() * 2 - 1) * step
  return clamp(v, min, max)
}
