export default function Grain() {
  return (
    <>
      <svg width="0" height="0" className="fixed pointer-events-none">
        <filter id="grain-filter" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.68"
            numOctaves="4"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
          <feBlend in="SourceGraphic" in2="gray" mode="overlay" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="in" />
        </filter>
      </svg>
      <div
        className="fixed inset-0 pointer-events-none z-[5]"
        style={{ opacity: 0.032, filter: 'url(#grain-filter)', willChange: 'transform' }}
      />
    </>
  )
}
