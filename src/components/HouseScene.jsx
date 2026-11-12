import { useEffect, useMemo, useRef, useState } from 'react'
import { findLocation } from '../data'

const U = 26
const K = 0.866
const CX = 247
const CY = 102

const P = (x, z, y = 0) => [CX + (x - z) * K * U, CY + (x + z) * 0.5 * U - y * U]
const pt = (x, z, y = 0) => P(x, z, y).map((n) => n.toFixed(2)).join(',')
const poly = (points) => points.map(([x, z, y = 0]) => `${P(x, z, y)[0].toFixed(2)},${P(x, z, y)[1].toFixed(2)}`).join(' ')

const palette = {
  white: { top: '#FCFAF4', front: '#F1ECE2', side: '#E3DDD1', stroke: '#DED6C8' },
  cream: { top: '#F5F0E5', front: '#EAE2D4', side: '#DDD3C3', stroke: '#D7CCBC' },
  wood: { top: '#DCC2A0', front: '#C8A77E', side: '#B48E63', stroke: '#A9845A' },
  lightWood: { top: '#E4CFB2', front: '#D0B28B', side: '#B99468', stroke: '#B08D62' },
  darkWood: { top: '#B18E68', front: '#94704D', side: '#7F5D3D', stroke: '#76563A' },
  sage: { top: '#C9DCD2', front: '#AEC9BB', side: '#95B4A5', stroke: '#8CA99A' },
  deepSage: { top: '#AECABD', front: '#8DB19F', side: '#769886', stroke: '#6F907F' },
  grey: { top: '#E8E7E1', front: '#D7D5CE', side: '#C6C3BA', stroke: '#C1BDB3' },
  stone: { top: '#E8E1D4', front: '#D9CFBF', side: '#C8BCA8', stroke: '#C1B39E' },
  dark: { top: '#7C837C', front: '#606963', side: '#4F5852', stroke: '#49524B' },
  brass: { top: '#CDB27E', front: '#B6975F', side: '#A2834D', stroke: '#9B7D49' },
  terracotta: { top: '#D2A98C', front: '#BE8B6B', side: '#A97557', stroke: '#A17053' },
  linen: { top: '#F4EDDF', front: '#E7DCCB', side: '#D8CBBA', stroke: '#D4C6B3' },
  black: { top: '#44514C', front: '#2D3531', side: '#222825', stroke: '#1F2422' },
}

function IsoBox({
  x,
  z,
  w,
  d,
  h,
  y = 0,
  colors = palette.white,
  className = '',
  shadow = true,
  children,
  topStroke = true,
}) {
  const top = poly([
    [x, z, y + h],
    [x + w, z, y + h],
    [x + w, z + d, y + h],
    [x, z + d, y + h],
  ])
  const front = poly([
    [x, z + d, y + h],
    [x + w, z + d, y + h],
    [x + w, z + d, y],
    [x, z + d, y],
  ])
  const side = poly([
    [x + w, z, y + h],
    [x + w, z + d, y + h],
    [x + w, z + d, y],
    [x + w, z, y],
  ])
  const shadowPts = poly([
    [x - 0.06, z + 0.08, 0.01],
    [x + w + 0.11, z + 0.08, 0.01],
    [x + w + 0.11, z + d + 0.15, 0.01],
    [x - 0.06, z + d + 0.15, 0.01],
  ])
  return (
    <g className={className}>
      {shadow && <polygon points={shadowPts} fill="#6C7469" opacity=".11" filter="url(#softBlur)" />}
      <polygon points={side} fill={colors.side} stroke={colors.stroke} strokeWidth=".7" strokeLinejoin="round" />
      <polygon points={front} fill={colors.front} stroke={colors.stroke} strokeWidth=".7" strokeLinejoin="round" />
      <polygon
        points={top}
        fill={colors.top}
        stroke={topStroke ? colors.stroke : 'none'}
        strokeWidth=".7"
        strokeLinejoin="round"
      />
      {children}
    </g>
  )
}

function Cylinder({ x, z, r = 0.25, h = 0.6, y = 0, top = '#F8F4EB', side = '#E6DED1', rim = 'rgba(98,86,70,.15)' }) {
  const [cx, cy] = P(x, z, y + h)
  const rx = r * U * 1.18
  const ry = r * U * 0.5
  const baseY = P(x, z, y)[1]
  return (
    <g>
      <path
        d={`M ${cx - rx} ${cy} L ${cx - rx} ${baseY} A ${rx} ${ry} 0 0 0 ${cx + rx} ${baseY} L ${cx + rx} ${cy} Z`}
        fill={side}
      />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={top} stroke={rim} />
    </g>
  )
}

function Plant({ x, z, y = 0, scale = 1, pot = '#C9D7CC', leaves = '#7F9E89', className = '' }) {
  const [cx, cy] = P(x, z, y + 0.45 * scale)
  const leafPath = (dx, dy, rot, fill, opacity = 1) => (
    <ellipse
      key={`${dx}-${dy}-${rot}`}
      cx={cx + dx * scale}
      cy={cy + dy * scale}
      rx={8.5 * scale}
      ry={3.7 * scale}
      fill={fill}
      opacity={opacity}
      transform={`rotate(${rot} ${cx + dx * scale} ${cy + dy * scale})`}
    />
  )
  return (
    <g className={className}>
      <ellipse cx={cx + 5} cy={P(x, z, y)[1] + 2} rx={17 * scale} ry={6 * scale} fill="#69756A" opacity=".11" />
      <Cylinder x={x} z={z} r={0.22 * scale} h={0.4 * scale} y={y} top={pot} side={pot} rim="rgba(85,72,53,.13)" />
      <path
        d={`M ${cx} ${cy - 7 * scale} C ${cx - 2 * scale} ${cy - 25 * scale}, ${cx - 3 * scale} ${cy - 38 * scale}, ${cx + 2 * scale} ${cy - 46 * scale}`}
        fill="none"
        stroke="#657C67"
        strokeWidth={1.05 * scale}
      />
      <path
        d={`M ${cx} ${cy - 13 * scale} C ${cx + 13 * scale} ${cy - 20 * scale}, ${cx + 18 * scale} ${cy - 33 * scale}, ${cx + 11 * scale} ${cy - 38 * scale}`}
        fill="none"
        stroke="#6C856E"
        strokeWidth={1 * scale}
      />
      {leafPath(-14, -38, -42, leaves, 0.92)}
      {leafPath(9, -50, 28, leaves, 0.86)}
      {leafPath(18, -30, 55, '#92AD98', 0.9)}
      {leafPath(-18, -21, -65, '#78967F', 0.9)}
      {leafPath(1, -31, 78, '#A0B8A5', 0.85)}
    </g>
  )
}

function Books({ x, z, y, width = 0.55, depth = 0.2, colors = ['#B4A58D', '#879A8C', '#D8C8AE', '#A88979'] }) {
  const count = colors.length
  const step = width / count
  return (
    <g>
      {colors.map((fill, index) => (
        <IsoBox
          key={fill + index}
          x={x + index * step}
          z={z}
          w={step * 0.7}
          d={depth}
          h={0.36 + (index % 2) * 0.09}
          y={y}
          colors={{ top: fill, front: fill, side: fill, stroke: 'rgba(80,70,55,.08)' }}
          shadow={false}
          topStroke={false}
        />
      ))}
    </g>
  )
}

function Sink({ x, z }) {
  const top = poly([
    [x, z, 0.97],
    [x + 0.8, z, 0.97],
    [x + 0.8, z + 0.48, 0.97],
    [x, z + 0.48, 0.97],
  ])
  const base = P(x + 0.4, z + 0.44, 0.97)
  const spoutTop = P(x + 0.4, z + 0.18, 1.36)
  return (
    <g>
      <polygon points={top} fill="#D8D3C8" stroke="#C3BDB1" strokeWidth=".8" />
      <polygon
        points={poly([
          [x + 0.08, z + 0.07, 0.98],
          [x + 0.7, z + 0.07, 0.98],
          [x + 0.7, z + 0.4, 0.98],
          [x + 0.08, z + 0.4, 0.98],
        ])}
        fill="#C9C9C1"
        opacity=".8"
      />
      <path
        d={`M ${base[0]} ${base[1]} C ${base[0]} ${base[1] - 21}, ${spoutTop[0]} ${spoutTop[1] + 8}, ${spoutTop[0]} ${spoutTop[1]}`}
        fill="none"
        stroke="#A69278"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <circle cx={spoutTop[0]} cy={spoutTop[1] + 1} r="2.2" fill="#C4AF91" />
    </g>
  )
}

function Lamp({ x, z, y, scale = 1 }) {
  const [cx, cy] = P(x, z, y)
  return (
    <g>
      <path d={`M ${cx} ${cy} L ${cx} ${cy - 23 * scale}`} stroke="#9D855F" strokeWidth={1.5 * scale} />
      <path
        d={`M ${cx - 10 * scale} ${cy - 20 * scale} L ${cx + 10 * scale} ${cy - 20 * scale} L ${cx + 6 * scale} ${cy - 35 * scale} L ${cx - 6 * scale} ${cy - 35 * scale} Z`}
        fill="#F1E4C9"
        stroke="#D7C4A6"
        strokeWidth=".7"
      />
      <ellipse cx={cx} cy={cy + 1} rx={6 * scale} ry={2.1 * scale} fill="#A38863" />
    </g>
  )
}

const labels = [
  { id: 'fridge', left: 38, top: 7, anchor: 'bottom' },
  { id: 'kitchenCabinet', left: 62, top: 16.5, anchor: 'bottom' },
  { id: 'storageCabinet', left: 10, top: 28, anchor: 'bottom' },
  { id: 'sideboard', left: 41, top: 33, anchor: 'bottom' },
  { id: 'livingCabinet', left: 81, top: 35, anchor: 'bottom' },
  { id: 'bedsideTable', left: 25, top: 47, anchor: 'bottom' },
  { id: 'wardrobe', left: 49.5, top: 45, anchor: 'bottom' },
  { id: 'tvStand', left: 74, top: 50, anchor: 'top' },
  { id: 'bedroomCabinet', left: 12, top: 57, anchor: 'top' },
  { id: 'bathroomCabinet', left: 60, top: 58, anchor: 'top' },
]

function Zone({ id, children, onSelect, counts, selected }) {
  const location = findLocation(id)
  return (
    <g
      className={`house-zone ${selected === id ? 'is-picked' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`查看${location.name}，${counts?.[id] ?? 0}件物品`}
      onClick={() => onSelect(id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(id)
        }
      }}
    >
      <title>{`${location.name} · ${counts?.[id] ?? 0} 件物品`}</title>
      {children}
    </g>
  )
}

export default function HouseScene({ counts = {}, onSelect, soonCounts = {} }) {
  const [picked, setPicked] = useState(null)
  const pickTimer = useRef(null)

  useEffect(() => {
    return () => {
      if (pickTimer.current) window.clearTimeout(pickTimer.current)
    }
  }, [])

  const handleSelect = (id) => {
    if (!counts[id]) return
    if (pickTimer.current) window.clearTimeout(pickTimer.current)
    setPicked(id)
    pickTimer.current = window.setTimeout(() => {
      setPicked(null)
      onSelect(id)
    }, 160)
  }

  const locationData = useMemo(
    () =>
      labels
        .map((label) => ({ ...label, location: findLocation(label.id), count: counts[label.id] ?? 0 }))
        .filter((label) => label.count > 0),
    [counts],
  )

  return (
    <div className="house-scene">
      <div className="house-ambient" />
      <div className="house-svg-wrap">
        <svg viewBox="0 0 570 440" className="house-svg" role="img" aria-label="HomeKeep 3D 等距家庭空间全景">
          <defs>
            <linearGradient id="wallBack" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FBF8F1" />
              <stop offset="100%" stopColor="#F1ECDF" />
            </linearGradient>
            <linearGradient id="wallSide" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F4EFE4" />
              <stop offset="100%" stopColor="#E8E0D1" />
            </linearGradient>
            <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#DCE9E2" />
              <stop offset="64%" stopColor="#EAF1EA" />
              <stop offset="100%" stopColor="#C8DBCF" />
            </linearGradient>
            <linearGradient id="tvGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#58665F" />
              <stop offset="52%" stopColor="#303B35" />
              <stop offset="100%" stopColor="#1F2823" />
            </linearGradient>
            <linearGradient id="water" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#BFD8D2" />
              <stop offset="100%" stopColor="#8EB8AF" />
            </linearGradient>
            <linearGradient id="floorKitchen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E8DFD1" />
              <stop offset="100%" stopColor="#DDD2C1" />
            </linearGradient>
            <linearGradient id="floorLiving" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E9D9C2" />
              <stop offset="100%" stopColor="#DDC9AD" />
            </linearGradient>
            <linearGradient id="floorBedroom" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E8DED0" />
              <stop offset="100%" stopColor="#DED2C2" />
            </linearGradient>
            <linearGradient id="floorBath" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#DCE7E0" />
              <stop offset="100%" stopColor="#CFDED5" />
            </linearGradient>
            <linearGradient id="floorUtility" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E2E5DF" />
              <stop offset="100%" stopColor="#D6DAD3" />
            </linearGradient>
            <linearGradient id="rug" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F6F1E7" />
              <stop offset="100%" stopColor="#EAE2D4" />
            </linearGradient>
            <linearGradient id="sunPatch" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFDF7" stopOpacity=".5" />
              <stop offset="100%" stopColor="#FFFDF7" stopOpacity="0" />
            </linearGradient>
            <filter id="softBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <filter id="tvGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <clipPath id="kitchenFloorClip">
              <polygon points={poly([[0, 0], [6, 0], [6, 5], [0, 5]])} />
            </clipPath>
            <clipPath id="livingFloorClip">
              <polygon points={poly([[6, 0], [13, 0], [13, 5], [6, 5]])} />
            </clipPath>
            <clipPath id="bedroomFloorClip">
              <polygon points={poly([[4, 5], [9, 5], [9, 10], [4, 10]])} />
            </clipPath>
            <clipPath id="bathFloorClip">
              <polygon points={poly([[9, 5], [13, 5], [13, 10], [9, 10]])} />
            </clipPath>
            <clipPath id="utilityFloorClip">
              <polygon points={poly([[0, 5], [4, 5], [4, 10], [0, 10]])} />
            </clipPath>
            <clipPath id="bathWallClip">
              <polygon
                points={poly([
                  [9.15, 5.04, 0],
                  [12.95, 5.04, 0],
                  [12.95, 5.04, 2.15],
                  [9.15, 5.04, 2.15],
                ])}
              />
            </clipPath>
            <pattern id="bathTiles" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(26.5)">
              <rect width="24" height="24" fill="#EAF1EB" />
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#D2E0D7" strokeWidth="1" />
            </pattern>
            <pattern id="bedroomTexture" width="11" height="11" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r=".7" fill="#CABCA9" opacity=".45" />
            </pattern>
          </defs>

          <ellipse cx="298" cy="387" rx="230" ry="34" fill="#8A9589" opacity=".13" filter="url(#softBlur)" />
          <ellipse cx="300" cy="382" rx="143" ry="18" fill="#6E7C70" opacity=".09" filter="url(#softBlur)" />
          <g className="house-outside-sprays">
            <path d="M51 146 C32 106, 76 91, 87 125 C98 154, 61 167, 51 146Z" fill="#C9DBCF" opacity=".34" />
            <path d="M531 285 C507 246, 547 225, 567 253 C585 278, 552 302, 531 285Z" fill="#D9E5DD" opacity=".3" />
            <circle cx="67" cy="294" r="5" fill="#B8CCBD" opacity=".55" />
            <circle cx="536" cy="251" r="4" fill="#B8CCBD" opacity=".45" />
            <circle cx="518" cy="109" r="7" fill="#D9E3DA" opacity=".4" />
          </g>

          {/* Cutaway walls */}
          <g className="house-walls">
            <polygon
              points={poly([
                [0, 0, 0],
                [13, 0, 0],
                [13, 0, 3.18],
                [0, 0, 3.18],
              ])}
              fill="url(#wallBack)"
              stroke="#D9D0C0"
              strokeWidth=".8"
            />
            <polygon
              points={poly([
                [13, 0, 0],
                [13, 0, 3.18],
                [13, 0.12, 3.18],
                [13, 0.12, 0],
              ])}
              fill="#E9E1D3"
            />
            <polygon
              points={poly([
                [0, 0, 0],
                [0, 10, 0],
                [0, 10, 3.18],
                [0, 0, 3.18],
              ])}
              fill="url(#wallSide)"
              stroke="#D8CEBD"
              strokeWidth=".8"
            />
            <polygon
              points={poly([
                [0, 0, 3.18],
                [13, 0, 3.18],
                [13, 0.1, 3.18],
                [0, 0.1, 3.18],
              ])}
              fill="#D6CCBA"
              opacity=".9"
            />
            <polygon
              points={poly([
                [0, 0, 3.18],
                [0, 10, 3.18],
                [0.1, 10, 3.18],
                [0.1, 0, 3.18],
              ])}
              fill="#CEC3B0"
              opacity=".86"
            />
            <line
              x1={P(0, 0, 3.18)[0]}
              y1={P(0, 0, 3.18)[1]}
              x2={P(13, 0, 3.18)[0]}
              y2={P(13, 0, 3.18)[1]}
              stroke="#C8BEAD"
              strokeWidth="1.4"
            />
          </g>

          {/* Back windows */}
          <g className="house-windows">
            <polygon
              points={poly([
                [8.35, 0.02, 1.12],
                [11.25, 0.02, 1.12],
                [11.25, 0.02, 2.78],
                [8.35, 0.02, 2.78],
              ])}
              fill="#CABCA8"
            />
            <polygon
              points={poly([
                [8.48, 0.03, 1.23],
                [11.12, 0.03, 1.23],
                [11.12, 0.03, 2.67],
                [8.48, 0.03, 2.67],
              ])}
              fill="url(#glass)"
            />
            <g opacity=".72">
              <circle cx={P(10.7, 0, 2.05)[0]} cy={P(10.7, 0, 2.05)[1]} r="14" fill="#A7C1AD" />
              <circle cx={P(9.35, 0, 1.65)[0]} cy={P(9.35, 0, 1.65)[1]} r="11" fill="#C1D3C2" />
              <path
                d={`M ${P(8.5, 0, 1.28)[0]} ${P(8.5, 0, 1.28)[1]} C ${P(9.2, 0, 2.1)[0]} ${P(9.2, 0, 2.1)[1]}, ${P(10.2, 0, 2.1)[0]} ${P(10.2, 0, 2.1)[1]}, ${P(10.8, 0, 2.67)[0]} ${P(10.8, 0, 2.67)[1]}`}
                fill="none"
                stroke="#F9F6EF"
                strokeWidth="6"
                opacity=".28"
              />
            </g>
            <line
              x1={P(8.48, 0, 1.95)[0]}
              y1={P(8.48, 0, 1.95)[1]}
              x2={P(11.12, 0, 1.95)[0]}
              y2={P(11.12, 0, 1.95)[1]}
              stroke="#E7E0D4"
              strokeWidth="2"
            />
            <line
              x1={P(9.8, 0, 1.23)[0]}
              y1={P(9.8, 0, 1.23)[1]}
              x2={P(9.8, 0, 2.67)[0]}
              y2={P(9.8, 0, 2.67)[1]}
              stroke="#E7E0D4"
              strokeWidth="2"
            />
            <polygon
              points={poly([
                [8.28, 0.02, 1.03],
                [11.32, 0.02, 1.03],
                [11.32, 0.02, 1.12],
                [8.28, 0.02, 1.12],
              ])}
              fill="#D9CDBB"
            />
            <polygon
              points={poly([
                [1.05, 0.02, 1.42],
                [3.37, 0.02, 1.42],
                [3.37, 0.02, 2.74],
                [1.05, 0.02, 2.74],
              ])}
              fill="#CCBEA9"
            />
            <polygon
              points={poly([
                [1.17, 0.03, 1.53],
                [3.25, 0.03, 1.53],
                [3.25, 0.03, 2.63],
                [1.17, 0.03, 2.63],
              ])}
              fill="url(#glass)"
            />
            <line
              x1={P(2.21, 0, 1.53)[0]}
              y1={P(2.21, 0, 1.53)[1]}
              x2={P(2.21, 0, 2.63)[0]}
              y2={P(2.21, 0, 2.63)[1]}
              stroke="#E8E1D5"
              strokeWidth="2"
            />
            <line
              x1={P(1.17, 0, 2.1)[0]}
              y1={P(1.17, 0, 2.1)[1]}
              x2={P(3.25, 0, 2.1)[0]}
              y2={P(3.25, 0, 2.1)[1]}
              stroke="#E8E1D5"
              strokeWidth="2"
            />
            <g opacity=".58">
              <ellipse cx={P(2.75, 0, 2.48)[0]} cy={P(2.75, 0, 2.48)[1]} rx="12" ry="7" fill="#9CB9A2" />
              <ellipse cx={P(1.55, 0, 1.83)[0]} cy={P(1.55, 0, 1.83)[1]} rx="8" ry="5" fill="#B9CEBA" />
            </g>
            {/* Left wall window */}
            <polygon
              points={poly([
                [0.02, 6.85, 1.22],
                [0.02, 8.25, 1.22],
                [0.02, 8.25, 2.63],
                [0.02, 6.85, 2.63],
              ])}
              fill="#CCBEA9"
            />
            <polygon
              points={poly([
                [0.03, 6.96, 1.33],
                [0.03, 8.14, 1.33],
                [0.03, 8.14, 2.52],
                [0.03, 6.96, 2.52],
              ])}
              fill="url(#glass)"
            />
            <line
              x1={P(0.03, 7.55, 1.33)[0]}
              y1={P(0.03, 7.55, 1.33)[1]}
              x2={P(0.03, 7.55, 2.52)[0]}
              y2={P(0.03, 7.55, 2.52)[1]}
              stroke="#E8E1D5"
              strokeWidth="2"
            />
            <line
              x1={P(0.03, 6.96, 1.9)[0]}
              y1={P(0.03, 6.96, 1.9)[1]}
              x2={P(0.03, 8.14, 1.9)[0]}
              y2={P(0.03, 8.14, 1.9)[1]}
              stroke="#E8E1D5"
              strokeWidth="2"
            />
          </g>

          {/* Floating artwork and a tiny wall shelf */}
          <g className="house-wall-decor">
            <g transform={`translate(${P(5.1, 0, 2.1)[0] - 15}, ${P(5.1, 0, 2.1)[1] - 19})`}>
              <rect width="30" height="38" rx="2" fill="#ECDCC7" stroke="#C9B592" strokeWidth="1.5" transform="skewY(26.6)" />
              <circle cx="15" cy="15" r="5" fill="#A8BEA9" transform="skewY(26.6)" />
              <path d="M3 31 Q 11 17 27 27 L27 35 L3 35Z" fill="#CEDBCB" opacity=".8" transform="skewY(26.6)" />
            </g>
            <IsoBox x={5.65} z={0.16} w={1.1} d={0.16} h={0.08} y={2.18} colors={palette.wood} shadow={false} topStroke={false} />
            <Cylinder x={5.92} z={0.24} r={0.1} h={0.25} y={2.26} top="#DDE7DE" side="#BACDBE" />
            <Cylinder x={6.2} z={0.24} r={0.08} h={0.2} y={2.26} top="#E6DBC6" side="#CBB89A" />
            <Cylinder x={6.46} z={0.24} r={0.09} h={0.31} y={2.26} top="#D8E0D6" side="#BECDBF" />
          </g>

          {/* Floor slab */}
          <g>
            <polygon points={poly([[0, 10, 0], [13, 10, 0], [13, 10, -0.34], [0, 10, -0.34]])} fill="#C0B5A3" />
            <polygon points={poly([[13, 0, 0], [13, 10, 0], [13, 10, -0.34], [13, 0, -0.34]])} fill="#B4A896" />
            <polygon
              points={poly([
                [0, 0],
                [13, 0],
                [13, 10],
                [0, 10],
              ])}
              fill="#E5D9C9"
              stroke="#C7BBA8"
              strokeWidth="1"
            />
          </g>

          {/* Room floors */}
          <g className="room-floors">
            <polygon points={poly([[0, 0], [6, 0], [6, 5], [0, 5]])} fill="url(#floorKitchen)" />
            <g clipPath="url(#kitchenFloorClip)" opacity=".46">
              {[1, 2, 3, 4, 5].map((n) => (
                <line key={`kx${n}`} x1={P(n, 0)[0]} y1={P(n, 0)[1]} x2={P(n, 5)[0]} y2={P(n, 5)[1]} stroke="#C8BBA7" strokeWidth=".7" />
              ))}
              {[1, 2, 3, 4].map((n) => (
                <line key={`kz${n}`} x1={P(0, n)[0]} y1={P(0, n)[1]} x2={P(6, n)[0]} y2={P(6, n)[1]} stroke="#C8BBA7" strokeWidth=".7" />
              ))}
            </g>
            <polygon points={poly([[6, 0], [13, 0], [13, 5], [6, 5]])} fill="url(#floorLiving)" />
            <g clipPath="url(#livingFloorClip)" opacity=".45">
              {[0.8, 1.65, 2.5, 3.35, 4.2].map((n) => (
                <line key={`lz${n}`} x1={P(6, n)[0]} y1={P(6, n)[1]} x2={P(13, n)[0]} y2={P(13, n)[1]} stroke="#BCA88B" strokeWidth=".7" />
              ))}
              {[7.4, 9, 10.6, 12].map((n) => (
                <line key={`lx${n}`} x1={P(n, 0)[0]} y1={P(n, 0)[1]} x2={P(n, 5)[0]} y2={P(n, 5)[1]} stroke="#BCA88B" strokeWidth=".55" opacity=".55" />
              ))}
            </g>
            <polygon points={poly([[4, 5], [9, 5], [9, 10], [4, 10]])} fill="url(#floorBedroom)" />
            <rect
              x="0"
              y="0"
              width="570"
              height="440"
              fill="url(#bedroomTexture)"
              clipPath="url(#bedroomFloorClip)"
              opacity=".5"
            />
            <polygon points={poly([[9, 5], [13, 5], [13, 10], [9, 10]])} fill="url(#floorBath)" />
            <g clipPath="url(#bathFloorClip)" opacity=".55">
              {[1, 2, 3, 4].map((n) => (
                <line key={`bx${n}`} x1={P(9 + n, 5)[0]} y1={P(9 + n, 5)[1]} x2={P(9 + n, 10)[0]} y2={P(9 + n, 10)[1]} stroke="#B7CCC1" strokeWidth=".75" />
              ))}
              {[1, 2, 3, 4].map((n) => (
                <line key={`bz${n}`} x1={P(9, 5 + n)[0]} y1={P(9, 5 + n)[1]} x2={P(13, 5 + n)[0]} y2={P(13, 5 + n)[1]} stroke="#B7CCC1" strokeWidth=".75" />
              ))}
            </g>
            <polygon points={poly([[0, 5], [4, 5], [4, 10], [0, 10]])} fill="url(#floorUtility)" />
            <g clipPath="url(#utilityFloorClip)" opacity=".45">
              {[6, 7, 8, 9].map((n) => (
                <line key={`uz${n}`} x1={P(0, n)[0]} y1={P(0, n)[1]} x2={P(4, n)[0]} y2={P(4, n)[1]} stroke="#B7BEB5" strokeWidth=".7" />
              ))}
              {[1, 2, 3].map((n) => (
                <line key={`ux${n}`} x1={P(n, 5)[0]} y1={P(n, 5)[1]} x2={P(n, 10)[0]} y2={P(n, 10)[1]} stroke="#B7BEB5" strokeWidth=".7" />
              ))}
            </g>
            {/* Brass floor seams */}
            <line x1={P(6, 0, 0.015)[0]} y1={P(6, 0, 0.015)[1]} x2={P(6, 5, 0.015)[0]} y2={P(6, 5, 0.015)[1]} stroke="#B79A69" strokeWidth="1.1" opacity=".62" />
            <line x1={P(0, 5, 0.015)[0]} y1={P(0, 5, 0.015)[1]} x2={P(13, 5, 0.015)[0]} y2={P(13, 5, 0.015)[1]} stroke="#B79A69" strokeWidth="1.1" opacity=".58" />
            <line x1={P(4, 5, 0.015)[0]} y1={P(4, 5, 0.015)[1]} x2={P(4, 10, 0.015)[0]} y2={P(4, 10, 0.015)[1]} stroke="#B79A69" strokeWidth=".8" opacity=".4" />
            <line x1={P(9, 5, 0.015)[0]} y1={P(9, 5, 0.015)[1]} x2={P(9, 10, 0.015)[0]} y2={P(9, 10, 0.015)[1]} stroke="#B79A69" strokeWidth=".8" opacity=".4" />
            {/* Sun patch */}
            <polygon
              points={poly([
                [8.6, 0.3, 0.02],
                [10.8, 0.3, 0.02],
                [9.8, 3.8, 0.02],
                [7.9, 3.8, 0.02],
              ])}
              fill="url(#sunPatch)"
            />
          </g>

          {/* Room rugs */}
          <g className="room-rugs">
            <polygon
              points={poly([
                [6.85, 1.75],
                [10.95, 1.75],
                [10.95, 4.55],
                [6.85, 4.55],
              ])}
              fill="url(#rug)"
              stroke="#D7CCB9"
              strokeWidth=".8"
            />
            <polygon
              points={poly([
                [5.1, 7.9],
                [8.6, 7.9],
                [8.6, 9.6],
                [5.1, 9.6],
              ])}
              fill="#EFE6D8"
              stroke="#D9CBB6"
              strokeWidth=".7"
              opacity=".9"
            />
            <polygon
              points={poly([
                [10.25, 7.15],
                [12.55, 7.15],
                [12.55, 9.2],
                [10.25, 9.2],
              ])}
              fill="#DDE8E1"
              stroke="#C5D6CA"
              strokeWidth=".6"
              opacity=".75"
            />
          </g>

          {/* Kitchen counter + upper cabinets */}
          <Zone id="kitchenCabinet" onSelect={handleSelect} counts={counts} selected={picked}>
            <IsoBox x={2.1} z={0.18} w={3.75} d={0.55} h={1.02} y={1.58} colors={palette.cream}>
              <line
                x1={P(3.95, 0.18, 2.55)[0]}
                y1={P(3.95, 0.18, 2.55)[1]}
                x2={P(3.95, 0.18, 1.64)[0]}
                y2={P(3.95, 0.18, 1.64)[1]}
                stroke="#D1C3B0"
                strokeWidth="1"
              />
              <line
                x1={P(2.55, 0.75, 2.3)[0]}
                y1={P(2.55, 0.75, 2.3)[1]}
                x2={P(2.55, 0.75, 1.9)[0]}
                y2={P(2.55, 0.75, 1.9)[1]}
                stroke="#B49A73"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <line
                x1={P(5.1, 0.75, 2.3)[0]}
                y1={P(5.1, 0.75, 2.3)[1]}
                x2={P(5.1, 0.75, 1.9)[0]}
                y2={P(5.1, 0.75, 1.9)[1]}
                stroke="#B49A73"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </IsoBox>
            <IsoBox x={2.08} z={0.48} w={3.78} d={1.12} h={0.88} colors={palette.lightWood}>
              <line
                x1={P(3.34, 1.6, 0.78)[0]}
                y1={P(3.34, 1.6, 0.78)[1]}
                x2={P(3.34, 1.6, 0.14)[0]}
                y2={P(3.34, 1.6, 0.14)[1]}
                stroke="#A9855B"
                strokeWidth=".8"
              />
              <line
                x1={P(4.58, 1.6, 0.78)[0]}
                y1={P(4.58, 1.6, 0.78)[1]}
                x2={P(4.58, 1.6, 0.14)[0]}
                y2={P(4.58, 1.6, 0.14)[1]}
                stroke="#A9855B"
                strokeWidth=".8"
              />
              <line
                x1={P(3.55, 1.6, 0.65)[0]}
                y1={P(3.55, 1.6, 0.65)[1]}
                x2={P(3.55, 1.6, 0.55)[0]}
                y2={P(3.55, 1.6, 0.55)[1]}
                stroke="#8D7453"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1={P(4.38, 1.6, 0.65)[0]}
                y1={P(4.38, 1.6, 0.65)[1]}
                x2={P(4.38, 1.6, 0.55)[0]}
                y2={P(4.38, 1.6, 0.55)[1]}
                stroke="#8D7453"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </IsoBox>
            <IsoBox x={2.02} z={0.42} w={3.9} d={1.26} h={0.1} y={0.88} colors={palette.stone} shadow={false}>
              <Sink x={4.32} z={0.55} />
              <Cylinder x={2.65} z={0.9} r={0.11} h={0.32} y={0.98} top="#E4EDE5" side="#C5D2C5" />
              <IsoBox x={2.9} z={0.7} w={0.55} d={0.34} h={0.06} y={0.98} colors={palette.wood} shadow={false} topStroke={false} />
              <Cylinder x={3.15} z={0.88} r={0.12} h={0.08} y={1.02} top="#DCC9A8" side="#C6AB81" />
            </IsoBox>
          </Zone>

          <Plant x={5.4} z={1.4} scale={0.95} className="house-plant" />

          {/* Fridge */}
          <Zone id="fridge" onSelect={handleSelect} counts={counts} selected={picked}>
            <IsoBox x={0.32} z={0.72} w={1.36} d={1.14} h={3.05} colors={palette.white}>
              <line
                x1={P(0.97, 1.86, 3.0)[0]}
                y1={P(0.97, 1.86, 3.0)[1]}
                x2={P(0.97, 1.86, 0.02)[0]}
                y2={P(0.97, 1.86, 0.02)[1]}
                stroke="#D2CABE"
                strokeWidth=".9"
              />
              <line
                x1={P(0.63, 1.87, 2.7)[0]}
                y1={P(0.63, 1.87, 2.7)[1]}
                x2={P(0.63, 1.87, 2.2)[0]}
                y2={P(0.63, 1.87, 2.2)[1]}
                stroke="#A88D68"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1={P(1.28, 1.87, 1.48)[0]}
                y1={P(1.28, 1.87, 1.48)[1]}
                x2={P(1.28, 1.87, 1.08)[0]}
                y2={P(1.28, 1.87, 1.08)[1]}
                stroke="#A88D68"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx={P(0.53, 1.87, 2.72)[0]} cy={P(0.53, 1.87, 2.72)[1]} r="1.6" fill="#C7B28D" />
              <rect
                x={P(0.58, 1.87, 2.36)[0] - 4}
                y={P(0.58, 1.87, 2.36)[1] - 2}
                width="8"
                height="7"
                rx="1"
                fill="#D9E5DA"
                transform={`rotate(26.6 ${P(0.58, 1.87, 2.36)[0]} ${P(0.58, 1.87, 2.36)[1]})`}
              />
              <circle cx={P(1.35, 1.87, 2.34)[0]} cy={P(1.35, 1.87, 2.34)[1]} r="1.3" fill="#C7A59A" opacity=".8" />
            </IsoBox>
            <Cylinder x={0.9} z={0.88} r={0.16} h={0.25} y={3.08} top="#E1EDE3" side="#BBD0C0" />
            <Plant x={1.4} z={1.05} y={3.08} scale={0.4} pot="#D9E2D8" />
          </Zone>

          {/* Dining sideboard */}
          <Zone id="sideboard" onSelect={handleSelect} counts={counts} selected={picked}>
            <IsoBox x={3.6} z={3.55} w={1.92} d={0.72} h={0.82} colors={palette.wood}>
              <line
                x1={P(4.14, 4.27, 0.7)[0]}
                y1={P(4.14, 4.27, 0.7)[1]}
                x2={P(4.14, 4.27, 0.2)[0]}
                y2={P(4.14, 4.27, 0.2)[1]}
                stroke="#9A7A53"
                strokeWidth=".8"
              />
              <line
                x1={P(4.88, 4.27, 0.7)[0]}
                y1={P(4.88, 4.27, 0.7)[1]}
                x2={P(4.88, 4.27, 0.2)[0]}
                y2={P(4.88, 4.27, 0.2)[1]}
                stroke="#9A7A53"
                strokeWidth=".8"
              />
              <circle cx={P(4.27, 4.28, 0.48)[0]} cy={P(4.27, 4.28, 0.48)[1]} r="1.4" fill="#D4BA8F" />
              <circle cx={P(4.77, 4.28, 0.48)[0]} cy={P(4.77, 4.28, 0.48)[1]} r="1.4" fill="#D4BA8F" />
            </IsoBox>
            <Cylinder x={4.05} z={3.78} r={0.17} h={0.35} y={0.84} top="#DEE8DC" side="#BACABA" />
            <path
              d={`M ${P(4.05, 3.78, 1.15)[0]} ${P(4.05, 3.78, 1.15)[1]} C ${P(4.05, 3.78, 1.55)[0]} ${P(4.05, 3.78, 1.55)[1]}, ${P(3.8, 3.78, 1.7)[0]} ${P(3.8, 3.78, 1.7)[1]}, ${P(3.72, 3.78, 1.85)[0]} ${P(3.72, 3.78, 1.85)[1]}`}
              fill="none"
              stroke="#78957D"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <ellipse cx={P(3.73, 3.78, 1.9)[0]} cy={P(3.73, 3.78, 1.9)[1]} rx="5.5" ry="2.5" fill="#91AA95" transform={`rotate(-24 ${P(3.73, 3.78, 1.9)[0]} ${P(3.73, 3.78, 1.9)[1]})`} />
            <ellipse cx={P(4.05, 3.78, 1.5)[0]} cy={P(4.05, 3.78, 1.5)[1]} rx="4.2" ry="2" fill="#A7BEA9" transform={`rotate(20 ${P(4.05, 3.78, 1.5)[0]} ${P(4.05, 3.78, 1.5)[1]})`} />
            <Cylinder x={4.98} z={3.83} r={0.25} h={0.09} y={0.84} top="#F4EEE3" side="#DED6C9" />
          </Zone>

          {/* Living room TV + cabinet */}
          <Zone id="tvStand" onSelect={handleSelect} counts={counts} selected={picked}>
            <IsoBox x={9.25} z={0.54} w={2.32} d={0.7} h={0.54} colors={palette.lightWood}>
              <line
                x1={P(10.41, 1.25, 0.44)[0]}
                y1={P(10.41, 1.25, 0.44)[1]}
                x2={P(10.41, 1.25, 0.12)[0]}
                y2={P(10.41, 1.25, 0.12)[1]}
                stroke="#9B7B54"
                strokeWidth=".7"
              />
              <line
                x1={P(9.65, 1.25, 0.3)[0]}
                y1={P(9.65, 1.25, 0.3)[1]}
                x2={P(9.98, 1.25, 0.3)[0]}
                y2={P(9.98, 1.25, 0.3)[1]}
                stroke="#987851"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <line
                x1={P(10.84, 1.25, 0.3)[0]}
                y1={P(10.84, 1.25, 0.3)[1]}
                x2={P(11.17, 1.25, 0.3)[0]}
                y2={P(11.17, 1.25, 0.3)[1]}
                stroke="#987851"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </IsoBox>
            <IsoBox x={9.65} z={0.66} w={1.55} d={0.09} h={0.98} y={0.56} colors={palette.cream} shadow={false}>
              <polygon
                points={poly([
                  [9.72, 0.61, 0.67],
                  [11.13, 0.61, 0.67],
                  [11.13, 0.61, 1.43],
                  [9.72, 0.61, 1.43],
                ])}
                fill="url(#tvGradient)"
                opacity=".98"
              />
              <path
                d={`M ${P(9.8, 0.6, 1.37)[0]} ${P(9.8, 0.6, 1.37)[1]} L ${P(10.54, 0.6, 1.37)[0]} ${P(10.54, 0.6, 1.37)[1]}`}
                stroke="#7B8E84"
                strokeWidth="8"
                opacity=".17"
                strokeLinecap="round"
              />
            </IsoBox>
            <Cylinder x={11.78} z={0.8} r={0.14} h={0.35} y={0.55} top="#DCE8DD" side="#BACFBE" />
            <Plant x={11.9} z={1.1} y={0.55} scale={0.35} pot="#DEE7DF" />
          </Zone>

          <Zone id="livingCabinet" onSelect={handleSelect} counts={counts} selected={picked}>
            <IsoBox x={12.05} z={1.75} w={0.76} d={1.05} h={2.5} colors={palette.cream}>
              <line
                x1={P(12.05, 2.8, 2.5)[0]}
                y1={P(12.05, 2.8, 2.5)[1]}
                x2={P(12.05, 2.8, 0)[0]}
                y2={P(12.05, 2.8, 0)[1]}
                stroke="#D4C6B4"
                strokeWidth=".8"
              />
              <line
                x1={P(12.05, 2.8, 1.72)[0]}
                y1={P(12.05, 2.8, 1.72)[1]}
                x2={P(12.81, 2.8, 1.72)[0]}
                y2={P(12.81, 2.8, 1.72)[1]}
                stroke="#D4C6B4"
                strokeWidth=".8"
              />
              <line
                x1={P(12.05, 2.8, 0.84)[0]}
                y1={P(12.05, 2.8, 0.84)[1]}
                x2={P(12.81, 2.8, 0.84)[0]}
                y2={P(12.81, 2.8, 0.84)[1]}
                stroke="#D4C6B4"
                strokeWidth=".8"
              />
            </IsoBox>
            <Books x={12.15} z={1.86} y={0.88} width={0.54} colors={['#9BAF9E', '#C7B28E', '#D8C3A4']} />
            <Books x={12.14} z={1.86} y={1.73} width={0.5} colors={['#CEBDA4', '#8EA295']} />
            <Cylinder x={12.45} z={2.24} r={0.09} h={0.24} y={2.52} top="#D8E2D8" side="#BACABD" />
          </Zone>

          {/* Sofa */}
          <g className="house-sofa">
            <polygon
              points={poly([
                [6.9, 2.22],
                [10.02, 2.22],
                [10.02, 4.2],
                [6.9, 4.2],
              ])}
              fill="#C9B99F"
              opacity=".12"
              filter="url(#softBlur)"
            />
            <IsoBox x={7.08} z={2.3} w={2.72} d={0.92} h={0.28} y={0.22} colors={palette.linen}>
              <line
                x1={P(8.44, 3.22, 0.44)[0]}
                y1={P(8.44, 3.22, 0.44)[1]}
                x2={P(8.44, 3.22, 0.26)[0]}
                y2={P(8.44, 3.22, 0.26)[1]}
                stroke="#CDBCA5"
                strokeWidth=".7"
              />
            </IsoBox>
            <IsoBox x={7.08} z={2.27} w={2.72} d={0.22} h={1.04} y={0.36} colors={{ ...palette.linen, top: '#E3D7C5' }} />
            <IsoBox x={6.98} z={2.37} w={0.22} d={0.88} h={0.67} y={0.18} colors={{ ...palette.linen, top: '#DECFBA' }} />
            <IsoBox x={9.68} z={2.37} w={0.22} d={0.88} h={0.67} y={0.18} colors={{ ...palette.linen, top: '#DECFBA' }} />
            <IsoBox x={7.3} z={2.55} w={1.12} d={0.57} h={0.14} y={0.52} colors={{ ...palette.linen, top: '#F7F1E6', front: '#E4D7C4' }} shadow={false} />
            <IsoBox x={8.51} z={2.55} w={1.04} d={0.57} h={0.14} y={0.52} colors={{ ...palette.linen, top: '#F7F1E6', front: '#E4D7C4' }} shadow={false} />
            <IsoBox x={7.65} z={2.4} w={0.58} d={0.32} h={0.48} y={0.6} colors={{ ...palette.sage, top: '#C9DACF', front: '#A9C3B4' }} shadow={false} />
            <IsoBox x={8.54} z={2.4} w={0.55} d={0.32} h={0.46} y={0.6} colors={{ ...palette.linen, top: '#EADFCB', front: '#D8C8B1' }} shadow={false} />
          </g>

          {/* Coffee table */}
          <g className="house-coffee">
            <IsoBox x={8.26} z={3.74} w={1.44} d={0.62} h={0.09} y={0.42} colors={palette.wood} />
            {[
              [8.36, 3.81],
              [9.55, 3.81],
              [8.36, 4.2],
              [9.55, 4.2],
            ].map(([x, z]) => (
              <line
                key={`${x}-${z}`}
                x1={P(x, z, 0.42)[0]}
                y1={P(x, z, 0.42)[1]}
                x2={P(x, z, 0)[0]}
                y2={P(x, z, 0)[1]}
                stroke="#A38157"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ))}
            <Cylinder x={8.65} z={3.95} r={0.11} h={0.17} y={0.52} top="#E7EFE5" side="#BFCFC1" />
            <IsoBox x={9.0} z={3.93} w={0.3} d={0.2} h={0.05} y={0.52} colors={palette.cream} shadow={false} topStroke={false} />
            <ellipse cx={P(8.65, 3.95, 0.73)[0]} cy={P(8.65, 3.95, 0.73)[1]} rx="4" ry="2" fill="#9DB09F" />
          </g>

          <Plant x={12.36} z={3.96} scale={1.28} pot="#DDE6DC" className="house-plant living-plant" />

          {/* Low partition: bedroom / bathroom */}
          <g>
            <IsoBox x={8.94} z={5.2} w={0.16} d={4.45} h={0.58} colors={{ ...palette.sage, top: '#D0E1D7' }} />
            <IsoBox x={3.93} z={5.3} w={0.15} d={2.15} h={0.66} colors={{ ...palette.cream, top: '#E7DDCD' }} />
          </g>

          {/* Bathroom tiled half wall */}
          <g>
            <IsoBox x={9.15} z={5.02} w={3.8} d={0.14} h={2.12} colors={{ ...palette.white, front: '#EEF3ED', top: '#F8F5EC' }} />
            <g clipPath="url(#bathWallClip)">
              <rect
                x={P(9.15, 5.02, 0)[0] - 30}
                y={P(9.15, 5.02, 2.12)[1] - 6}
                width="240"
                height="130"
                fill="url(#bathTiles)"
                opacity=".78"
              />
            </g>
            <ellipse
              cx={P(10.65, 5.0, 1.45)[0]}
              cy={P(10.65, 5.0, 1.45)[1]}
              rx="22"
              ry="30"
              fill="#D7E5DF"
              stroke="#C0AC8C"
              strokeWidth="2.6"
              transform={`rotate(-26.6 ${P(10.65, 5.0, 1.45)[0]} ${P(10.65, 5.0, 1.45)[1]})`}
            />
            <ellipse
              cx={P(10.65, 5.0, 1.45)[0] - 5}
              cy={P(10.65, 5.0, 1.45)[1] - 9}
              rx="9"
              ry="14"
              fill="#F7F3EA"
              opacity=".4"
              transform={`rotate(-26.6 ${P(10.65, 5.0, 1.45)[0]} ${P(10.65, 5.0, 1.45)[1]})`}
            />
            <circle cx={P(10.65, 5.0, 2.22)[0]} cy={P(10.65, 5.0, 2.22)[1]} r="4" fill="#F3E5CA" />
          </g>

          {/* Bedroom wardrobe */}
          <Zone id="wardrobe" onSelect={handleSelect} counts={counts} selected={picked}>
            <IsoBox x={7.86} z={5.65} w={0.82} d={1.72} h={2.56} colors={palette.lightWood}>
              <line
                x1={P(8.27, 7.37, 2.48)[0]}
                y1={P(8.27, 7.37, 2.48)[1]}
                x2={P(8.27, 7.37, 0.08)[0]}
                y2={P(8.27, 7.37, 0.08)[1]}
                stroke="#A4845D"
                strokeWidth=".9"
              />
              <line
                x1={P(8.15, 7.38, 1.55)[0]}
                y1={P(8.15, 7.38, 1.55)[1]}
                x2={P(8.15, 7.38, 1.27)[0]}
                y2={P(8.15, 7.38, 1.27)[1]}
                stroke="#8E704D"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <line
                x1={P(8.4, 7.38, 1.55)[0]}
                y1={P(8.4, 7.38, 1.55)[1]}
                x2={P(8.4, 7.38, 1.27)[0]}
                y2={P(8.4, 7.38, 1.27)[1]}
                stroke="#8E704D"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <line
                x1={P(8.02, 7.38, 2.38)[0]}
                y1={P(8.02, 7.38, 2.38)[1]}
                x2={P(8.02, 7.38, 2.15)[0]}
                y2={P(8.02, 7.38, 2.15)[1]}
                stroke="#C3AD8B"
                strokeWidth="1.2"
              />
            </IsoBox>
          </Zone>

          {/* Bed */}
          <Zone id="bedsideTable" onSelect={handleSelect} counts={counts} selected={picked}>
            <IsoBox x={4.62} z={6.02} w={0.56} d={0.58} h={0.62} colors={palette.wood}>
              <line
                x1={P(4.9, 6.6, 0.48)[0]}
                y1={P(4.9, 6.6, 0.48)[1]}
                x2={P(4.9, 6.6, 0.34)[0]}
                y2={P(4.9, 6.6, 0.34)[1]}
                stroke="#9E7D54"
                strokeWidth="1.6"
              />
              <line
                x1={P(4.9, 6.6, 0.22)[0]}
                y1={P(4.9, 6.6, 0.22)[1]}
                x2={P(4.9, 6.6, 0.08)[0]}
                y2={P(4.9, 6.6, 0.08)[1]}
                stroke="#9E7D54"
                strokeWidth="1.6"
              />
            </IsoBox>
            <Lamp x={4.9} z={6.3} y={0.62} scale={0.74} />
          </Zone>

          <g className="house-bed">
            <IsoBox x={5.3} z={6.18} w={2.35} d={1.72} h={0.24} y={0.08} colors={palette.wood} />
            <IsoBox x={5.26} z={6.08} w={2.44} d={0.13} h={1.06} y={0.08} colors={{ ...palette.cream, top: '#EDE4D7' }} />
            <IsoBox x={5.36} z={6.18} w={2.24} d={1.64} h={0.34} y={0.32} colors={{ ...palette.white, top: '#FBF7EF', front: '#ECE5D9' }} />
            <IsoBox x={5.58} z={6.3} w={0.78} d={0.38} h={0.18} y={0.66} colors={{ ...palette.white, top: '#FFFDF8' }} shadow={false} />
            <IsoBox x={6.58} z={6.3} w={0.78} d={0.38} h={0.18} y={0.66} colors={{ ...palette.white, top: '#FFFDF8' }} shadow={false} />
            <polygon
              points={poly([
                [5.38, 7.08, 0.68],
                [7.58, 7.08, 0.68],
                [7.58, 7.7, 0.68],
                [5.38, 7.7, 0.68],
              ])}
              fill="#B8CBBF"
              stroke="#A7BBAD"
              strokeWidth=".6"
            />
            <polygon
              points={poly([
                [5.38, 7.08, 0.69],
                [7.58, 7.08, 0.69],
                [7.58, 7.28, 0.69],
                [5.38, 7.28, 0.69],
              ])}
              fill="#E1EADD"
              opacity=".55"
            />
            <line
              x1={P(5.4, 7.09, 0.7)[0]}
              y1={P(5.4, 7.09, 0.7)[1]}
              x2={P(5.4, 7.68, 0.7)[0]}
              y2={P(5.4, 7.68, 0.7)[1]}
              stroke="#F3F7F2"
              strokeWidth="1"
              opacity=".5"
            />
            <line
              x1={P(7.56, 7.09, 0.7)[0]}
              y1={P(7.56, 7.09, 0.7)[1]}
              x2={P(7.56, 7.68, 0.7)[0]}
              y2={P(7.56, 7.68, 0.7)[1]}
              stroke="#9EB4A7"
              strokeWidth="1"
              opacity=".5"
            />
          </g>

          {/* Bedroom vanity */}
          <Zone id="bedroomCabinet" onSelect={handleSelect} counts={counts} selected={picked}>
            <IsoBox x={4.25} z={8.42} w={1.62} d={0.58} h={0.68} colors={palette.white}>
              <line
                x1={P(5.06, 9.0, 0.56)[0]}
                y1={P(5.06, 9.0, 0.56)[1]}
                x2={P(5.06, 9.0, 0.1)[0]}
                y2={P(5.06, 9.0, 0.1)[1]}
                stroke="#D1C3B1"
                strokeWidth=".8"
              />
              <circle cx={P(4.88, 9.01, 0.37)[0]} cy={P(4.88, 9.01, 0.37)[1]} r="1.5" fill="#BBA17C" />
              <circle cx={P(5.24, 9.01, 0.37)[0]} cy={P(5.24, 9.01, 0.37)[1]} r="1.5" fill="#BBA17C" />
            </IsoBox>
            <ellipse
              cx={P(5.0, 8.8, 1.36)[0] - 8}
              cy={P(5.0, 8.8, 1.36)[1]}
              rx="19"
              ry="26"
              fill="#E7EFE9"
              stroke="#C7B18B"
              strokeWidth="2.6"
              transform={`rotate(-26.6 ${P(5.0, 8.8, 1.36)[0] - 8} ${P(5.0, 8.8, 1.36)[1]})`}
            />
            <ellipse
              cx={P(5.0, 8.8, 1.36)[0] - 8}
              cy={P(5.0, 8.8, 1.36)[1] - 4}
              rx="10"
              ry="15"
              fill="#F7F4ED"
              opacity=".45"
              transform={`rotate(-26.6 ${P(5.0, 8.8, 1.36)[0] - 8} ${P(5.0, 8.8, 1.36)[1]})`}
            />
            <Cylinder x={4.6} z={8.66} r={0.11} h={0.25} y={0.68} top="#F3E4DD" side="#D8C4B8" />
            <Cylinder x={5.55} z={8.66} r={0.08} h={0.18} y={0.68} top="#DCE7DE" side="#BCCDBF" />
          </Zone>

          {/* Utility storage shelving */}
          <Zone id="storageCabinet" onSelect={handleSelect} counts={counts} selected={picked}>
            <IsoBox x={0.22} z={6.05} w={1.15} d={2.28} h={2.34} colors={{ ...palette.cream, top: '#E9DFCF' }}>
              <line
                x1={P(0.8, 8.33, 2.3)[0]}
                y1={P(0.8, 8.33, 2.3)[1]}
                x2={P(0.8, 8.33, 0.05)[0]}
                y2={P(0.8, 8.33, 0.05)[1]}
                stroke="#CAB99F"
                strokeWidth=".9"
              />
              <line
                x1={P(0.22, 8.33, 1.76)[0]}
                y1={P(0.22, 8.33, 1.76)[1]}
                x2={P(1.37, 8.33, 1.76)[0]}
                y2={P(1.37, 8.33, 1.76)[1]}
                stroke="#CAB99F"
                strokeWidth=".9"
              />
              <line
                x1={P(0.22, 8.33, 1.12)[0]}
                y1={P(0.22, 8.33, 1.12)[1]}
                x2={P(1.37, 8.33, 1.12)[0]}
                y2={P(1.37, 8.33, 1.12)[1]}
                stroke="#CAB99F"
                strokeWidth=".9"
              />
              <line
                x1={P(0.22, 8.33, 0.53)[0]}
                y1={P(0.22, 8.33, 0.53)[1]}
                x2={P(1.37, 8.33, 0.53)[0]}
                y2={P(1.37, 8.33, 0.53)[1]}
                stroke="#CAB99F"
                strokeWidth=".9"
              />
              <rect
                x={P(0.45, 8.35, 0.72)[0] - 4}
                y={P(0.45, 8.35, 0.72)[1]}
                width="9"
                height="14"
                rx="2"
                fill="#B8C8BA"
                transform={`rotate(26.6 ${P(0.45, 8.35, 0.72)[0]} ${P(0.45, 8.35, 0.72)[1]})`}
              />
              <rect
                x={P(0.94, 8.35, 0.72)[0] - 4}
                y={P(0.94, 8.35, 0.72)[1] - 3}
                width="9"
                height="16"
                rx="2"
                fill="#D6C5AA"
                transform={`rotate(26.6 ${P(0.94, 8.35, 0.72)[0]} ${P(0.94, 8.35, 0.72)[1]})`}
              />
              <rect
                x={P(0.8, 8.35, 1.4)[0] - 3}
                y={P(0.8, 8.35, 1.4)[1] - 10}
                width="12"
                height="9"
                rx="1"
                fill="#E4D8C4"
                transform={`rotate(26.6 ${P(0.8, 8.35, 1.4)[0]} ${P(0.8, 8.35, 1.4)[1]})`}
              />
              <rect
                x={P(0.52, 8.35, 1.98)[0] - 3}
                y={P(0.52, 8.35, 1.98)[1] - 4}
                width="10"
                height="13"
                rx="2"
                fill="#C7D6CA"
                transform={`rotate(26.6 ${P(0.52, 8.35, 1.98)[0]} ${P(0.52, 8.35, 1.98)[1]})`}
              />
              <circle cx={P(0.38, 8.35, 1.86)[0]} cy={P(0.38, 8.35, 1.86)[1]} r="1.4" fill="#AD9370" />
              <circle cx={P(0.38, 8.35, 1.18)[0]} cy={P(0.38, 8.35, 1.18)[1]} r="1.4" fill="#AD9370" />
            </IsoBox>
            <IsoBox x={0.18} z={5.55} w={1.18} d={0.4} h={0.5} colors={palette.sage} shadow={false}>
              <Cylinder x={0.55} z={5.75} r={0.11} h={0.26} y={0.5} top="#E7EEE7" side="#C4D1C5" />
              <Cylinder x={0.9} z={5.75} r={0.09} h={0.2} y={0.5} top="#D9CAB5" side="#C1AF92" />
            </IsoBox>
          </Zone>

          {/* Utility rack and cleaning tools */}
          <g className="house-utility">
            <line
              x1={P(2.65, 6.22, 0)[0]}
              y1={P(2.65, 6.22, 0)[1]}
              x2={P(2.65, 6.22, 1.9)[0]}
              y2={P(2.65, 6.22, 1.9)[1]}
              stroke="#9B805F"
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            <path
              d={`M ${P(2.65, 6.22, 1.7)[0]} ${P(2.65, 6.22, 1.7)[1]} L ${P(2.45, 6.22, 1.25)[0]} ${P(2.45, 6.22, 1.25)[1]} M ${P(2.65, 6.22, 1.7)[0]} ${P(2.65, 6.22, 1.7)[1]} L ${P(2.82, 6.22, 1.28)[0]} ${P(2.82, 6.22, 1.28)[1]}`}
              stroke="#8D7B65"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1={P(2.14, 6.9, 0)[0]}
              y1={P(2.14, 6.9, 0)[1]}
              x2={P(2.14, 6.9, 1.75)[0]}
              y2={P(2.14, 6.9, 1.75)[1]}
              stroke="#A48661"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d={`M ${P(2.14, 6.9, 0.35)[0]} ${P(2.14, 6.9, 0.35)[1]} l -8 18 l 15 -1 Z`}
              fill="#C6B18C"
              opacity=".8"
            />
            <Cylinder x={3.05} z={6.57} r={0.17} h={0.35} y={0} top="#D7E2D9" side="#B6C8B8" />
            <Cylinder x={3.12} z={6.99} r={0.14} h={0.26} y={0} top="#E9DDC8" side="#CFBEA3" />
            <Cylinder x={2.98} z={7.38} r={0.18} h={0.4} y={0} top="#C5D5C9" side="#A9BFAF" />
            <IsoBox x={2.9} z={7.7} w={0.75} d={0.54} h={0.38} colors={palette.cream}>
              <line x1={P(3.1, 8.24, 0.32)[0]} y1={P(3.1, 8.24, 0.32)[1]} x2={P(3.5, 8.24, 0.32)[0]} y2={P(3.5, 8.24, 0.32)[1]} stroke="#C3B49F" strokeWidth="1" />
            </IsoBox>
          </g>

          {/* Washing machine */}
          <g className="house-washer">
            <IsoBox x={2.5} z={8.43} w={0.98} d={0.88} h={0.98} colors={palette.white}>
              <ellipse
                cx={P(2.99, 9.31, 0.57)[0]}
                cy={P(2.99, 9.31, 0.57)[1] - 1}
                rx="14"
                ry="18"
                fill="#DDE8E4"
                stroke="#B9C9C2"
                strokeWidth="2.2"
                transform={`rotate(-26.6 ${P(2.99, 9.31, 0.57)[0]} ${P(2.99, 9.31, 0.57)[1]})`}
              />
              <ellipse
                cx={P(2.99, 9.31, 0.57)[0] - 2}
                cy={P(2.99, 9.31, 0.57)[1] - 5}
                rx="8"
                ry="11"
                fill="#C4D8D3"
                opacity=".55"
                transform={`rotate(-26.6 ${P(2.99, 9.31, 0.57)[0]} ${P(2.99, 9.31, 0.57)[1]})`}
              />
              <rect
                x={P(2.7, 9.32, 0.91)[0]}
                y={P(2.7, 9.32, 0.91)[1] - 5}
                width="20"
                height="6"
                rx="2"
                fill="#DFE7E2"
                transform={`rotate(26.6 ${P(2.7, 9.32, 0.91)[0]} ${P(2.7, 9.32, 0.91)[1]})`}
              />
              <circle cx={P(3.32, 9.32, 0.91)[0]} cy={P(3.32, 9.32, 0.91)[1]} r="2" fill="#B6C3BB" />
            </IsoBox>
          </g>

          {/* Bathroom vanity */}
          <Zone id="bathroomCabinet" onSelect={handleSelect} counts={counts} selected={picked}>
            <IsoBox x={9.36} z={5.64} w={1.8} d={0.62} h={0.7} colors={palette.white}>
              <line
                x1={P(10.26, 6.26, 0.58)[0]}
                y1={P(10.26, 6.26, 0.58)[1]}
                x2={P(10.26, 6.26, 0.13)[0]}
                y2={P(10.26, 6.26, 0.13)[1]}
                stroke="#D1C4B3"
                strokeWidth=".8"
              />
              <circle cx={P(10.06, 6.27, 0.4)[0]} cy={P(10.06, 6.27, 0.4)[1]} r="1.4" fill="#BAA27C" />
              <circle cx={P(10.47, 6.27, 0.4)[0]} cy={P(10.47, 6.27, 0.4)[1]} r="1.4" fill="#BAA27C" />
            </IsoBox>
            <IsoBox x={9.32} z={5.58} w={1.88} d={0.72} h={0.08} y={0.7} colors={palette.stone} shadow={false}>
              <ellipse
                cx={P(10.25, 5.9, 0.79)[0]}
                cy={P(10.25, 5.9, 0.79)[1]}
                rx="18"
                ry="9"
                fill="#F4F7F2"
                stroke="#C7D3CB"
                strokeWidth="1.2"
              />
              <ellipse
                cx={P(10.25, 5.9, 0.79)[0]}
                cy={P(10.25, 5.9, 0.79)[1]}
                rx="12"
                ry="5.5"
                fill="#D9E5DF"
              />
              <path
                d={`M ${P(10.25, 5.72, 0.8)[0]} ${P(10.25, 5.72, 0.8)[1]} L ${P(10.25, 5.72, 1.08)[0]} ${P(10.25, 5.72, 1.08)[1]}`}
                stroke="#A99477"
                strokeWidth="2.3"
                strokeLinecap="round"
              />
              <circle cx={P(10.25, 5.72, 1.09)[0]} cy={P(10.25, 5.72, 1.09)[1]} r="2.2" fill="#C3AF90" />
              <Cylinder x={9.65} z={5.86} r={0.1} h={0.23} y={0.8} top="#E4D4C9" side="#C9B6A7" />
            </IsoBox>
          </Zone>

          {/* Bathtub */}
          <g className="house-bathtub">
            <IsoBox x={10.8} z={6.95} w={1.54} d={1.4} h={0.6} colors={{ ...palette.white, top: '#FAF7F0' }}>
              <ellipse
                cx={P(11.57, 7.65, 0.61)[0]}
                cy={P(11.57, 7.65, 0.61)[1]}
                rx="25"
                ry="14"
                fill="#FDFBF6"
                stroke="#D5CDC0"
                strokeWidth="1"
              />
              <ellipse
                cx={P(11.57, 7.65, 0.61)[0]}
                cy={P(11.57, 7.65, 0.61)[1] + 1}
                rx="18"
                ry="9.5"
                fill="url(#water)"
                opacity=".82"
              />
              <ellipse
                cx={P(11.57, 7.65, 0.61)[0] - 6}
                cy={P(11.57, 7.65, 0.61)[1] - 3}
                rx="6"
                ry="2"
                fill="#F9FCF8"
                opacity=".45"
              />
              <path
                d={`M ${P(10.95, 7.2, 0.58)[0]} ${P(10.95, 7.2, 0.58)[1]} L ${P(10.95, 7.2, 0.02)[0]} ${P(10.95, 7.2, 0.02)[1]}`}
                stroke="#C2B6A6"
                strokeWidth="2.2"
              />
              <path
                d={`M ${P(12.2, 7.2, 0.58)[0]} ${P(12.2, 7.2, 0.58)[1]} L ${P(12.2, 7.2, 0.02)[0]} ${P(12.2, 7.2, 0.02)[1]}`}
                stroke="#C2B6A6"
                strokeWidth="2.2"
              />
            </IsoBox>
            <Cylinder x={10.95} z={8.7} r={0.19} h={0.13} y={0.03} top="#F2EAE0" side="#D7CABB" />
            <Plant x={12.24} z={6.73} y={0.62} scale={0.5} pot="#DDE7DE" />
          </g>

          {/* Small decor / plants */}
          <g className="house-decor">
            <IsoBox x={1.72} z={3.86} w={0.62} d={0.36} h={0.06} y={1.54} colors={palette.wood} shadow={false} topStroke={false} />
            <Cylinder x={2.0} z={4.0} r={0.12} h={0.3} y={1.58} top="#E8E0D2" side="#CDBFA8" />
            <Plant x={3.05} z={4.15} scale={0.6} pot="#D8C6AC" />
            <Cylinder x={11.23} z={3.43} r={0.15} h={0.42} y={0} top="#F1EAE0" side="#D6C9B9" />
            <line
              x1={P(11.23, 3.43, 0.42)[0]}
              y1={P(11.23, 3.43, 0.42)[1]}
              x2={P(11.23, 3.43, 1.22)[0]}
              y2={P(11.23, 3.43, 1.22)[1]}
              stroke="#AA936F"
              strokeWidth="1.6"
            />
            <path
              d={`M ${P(11.23, 3.43, 1.22)[0]} ${P(11.23, 3.43, 1.22)[1]} L ${P(11.02, 3.43, 1.45)[0]} ${P(11.02, 3.43, 1.45)[1]} L ${P(11.44, 3.43, 1.45)[0]} ${P(11.44, 3.43, 1.45)[1]} Z`}
              fill="#F1E8D5"
              stroke="#D9C8AD"
              strokeWidth=".8"
            />
          </g>
        </svg>
      </div>

      <div className="house-label-layer">
        {locationData.map((label) => (
          <button
            key={label.id}
            className={`house-label ${label.anchor === 'top' ? 'label-top' : ''} ${picked === label.id ? 'is-picked' : ''}`}
            style={{ left: `${label.left}%`, top: `${label.top}%` }}
            onClick={() => handleSelect(label.id)}
            aria-label={`打开${label.location.name}`}
          >
            <span className="house-label-dot" style={{ background: label.location.color }} />
            <span>{label.location.mapLabel || label.location.name}</span>
            <span className="house-label-count">{label.count}</span>
            {soonCounts[label.id] ? <span className="house-label-soon" /> : null}
          </button>
        ))}
      </div>
    </div>
  )
}
