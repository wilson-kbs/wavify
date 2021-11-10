import gsap, { Power1 } from 'gsap'

type NodeElement = string | Element;

interface Options {
  container: string;
  // Height of wave
  height: number;
  // Amplitude of wave
  amplitude: number;
  // Animation speed
  speed: number;
  // Total number of articulation in wave
  bones: number;
  // position top or bottom
  position: string | 'TOP' | 'BOTTOM' | 'RIGHT' | 'LEFT';
  // Color
  color: string;
}

// type OptionsConstruct = Options;

type CacheValue = {
  container: HTMLElement;
  height: number;
  width: number;
  lastUpdate: number;
  totalTime: number;
  gsapInstance: gsap.core.Tween;
  animationInstance?: number;
  factor: number;
};

type PathPointCurveTo = {
  x: number;
  y: number;
};

// function debounce (
//   func: Function,
//   context: any,
//   wait: number,
//   immediate = false
// ) {
//   let timeout: number | undefined
//   return function () {
//     const args = arguments
//     clearTimeout(timeout)
//     timeout = setTimeout(function () {
//       timeout = undefined
//       if (!immediate) func.apply(context, args)
//     }, wait)
//     if (immediate && !timeout) func.apply(context, args)
//   }
// }

// eslint-disable-next-line no-undef
function getNode<K extends keyof SVGElementTagNameMap>(
  nodeName: K,
  attributes: Record<string, string | number>
  // eslint-disable-next-line no-undef
): SVGElementTagNameMap[K] {
  const node = document.createElementNS('http://www.w3.org/2000/svg', nodeName)
  for (const attrib in attributes) {
    node.setAttributeNS(
      null,
      attrib.replace(/[A-Z]/g, function (m) {
        return '-' + m.toLowerCase()
      }),
      attributes[attrib].toString()
    )
  }
  return node
}

class Wavify {
  private _el: Element;

  private _target: SVGPathElement;

  private _options: Options;

  private _cache: CacheValue;

  constructor(el: NodeElement, options: Partial<Options>) {
    if (typeof el === 'string') {
      const element = document.querySelector(el)
      if (!element) throw new Error(`${element} is not found`)
      this._el = element
    } else this._el = el

    this._options = Object.assign(
      {},
      {
        container: options?.container ?? 'body',
        // Height of wave
        height: 200,
        // Amplitude of wave
        amplitude: 100,
        // Animation speed
        speed: 0.15,
        // Total number of articulation in wave
        bones: 3,
        // position top or bottom
        position: 'BOTTOM',
        // Color
        color: 'rgba(255,255,255, 0.20)'
      },
      options
    )
    this._options.position = this._options.position.toLocaleUpperCase()

    // Create node
    const svg = getNode('svg', {
      version: '1.1',
      height: '100%',
      width: '100%',
      fill: 'none'
    })
    const path = getNode('path', { fill: this._options.color })
    svg.appendChild(path)
    this._el.appendChild(svg)
    this._target = path

    this._cache = {} as never
    this._cache.totalTime = 0

    this._sizeToCache()
    this._setDefault()
    this.play()
    // window.addEventListener("resize", redraw);
  }

  private _sizeToCache() {
    const rect = this._el.getBoundingClientRect()
    console.log(rect, this._el)

    this._cache.width = rect.width
    this._cache.height = rect.height
  }

  private _getPathEnd() {
    let SVGString = ''
    switch (this._options.position) {
      case 'RIGHT':
        SVGString += ` L ${this._cache.width} ${this._cache.height}`
        SVGString += ` L ${this._cache.width} 0`
        break
      case 'LEFT':
        SVGString += ` L 0 ${this._cache.height}`
        SVGString += ' L 0 0'
        break
      case 'TOP':
        SVGString += ` L ${this._cache.width} 0`
        SVGString += ' L 0 0'
        break
      default:
        SVGString += ` L ${this._cache.width} ${this._cache.height}`
        SVGString += ` L 0 ${this._cache.height}`
    }

    SVGString += ' Z'
    return SVGString
  }

  private _setDefault() {
    this._cache.gsapInstance = gsap.set(this._target, {
      attr: {
        d: this._drawFlatPath(this._drawFlatPoints(0))
      }
    })
  }

  private _drawFlatPoints(height: number) {
    const points: PathPointCurveTo[] = []

    switch (this._options.position.toLocaleUpperCase()) {
      case 'RIGHT':
      case 'LEFT':
        for (let i = 0; i <= this._options.bones; i++) {
          const y = (i / this._options.bones) * this._cache.height
          const x =
            this._options.position === 'LEFT'
              ? height
              : this._cache.width - height

          points.push({ x, y })
        }
        break

      case 'TOP':
      case 'BOTTOM':
      default:
        for (let i = 0; i <= this._options.bones; i++) {
          const x = (i / this._options.bones) * this._cache.width
          const y =
            this._options.position === 'TOP'
              ? height
              : this._cache.height - height

          points.push({ x, y })
        }
        break
    }
    return points
  }

  private _drawFlatPath(points: PathPointCurveTo[]) {
    let SVGString = `M ${points[0].x} ${points[0].y}`

    SVGString += `C ${points[0].x} ${points[0].y} ${points[1].x} ${points[1].y} ${points[1].x} ${points[1].y}`

    for (let i = 1; i < points.length - 1; i++) {
      SVGString += `C ${points[i].x} ${points[i].y} ${points[i + 1].x} ${points[i + 1].y
        } ${points[i + 1].x} ${points[i + 1].y}`
    }

    SVGString += this._getPathEnd()
    return SVGString
  }

  private _drawPoints(factor: number) {
    const points: PathPointCurveTo[] = []

    switch (this._options.position) {
      case 'RIGHT':
      case 'LEFT':
        for (let i = 0; i <= this._options.bones; i++) {
          const y = (i / this._options.bones) * this._cache.height

          const sinSeed =
            (factor + (i + (i % this._options.bones))) *
            this._options.speed *
            100
          const sinHeight =
            Math.sin(sinSeed / 100) *
            (this._options.position === 'LEFT'
              ? this._options.amplitude
              : -this._options.amplitude)

          const xPos =
            Math.sin(sinSeed / 100) * sinHeight +
            (this._options.position === 'LEFT'
              ? this._options.height
              : this._cache.width - this._options.height)
          points.push({ x: xPos, y: y })
        }
        break

      case 'TOP':
      case 'BOTTOM':
      default:
        for (let i = 0; i <= this._options.bones; i++) {
          const x = (i / this._options.bones) * this._cache.width
          const sinSeed =
            (factor + (i + (i % this._options.bones))) *
            this._options.speed *
            100
          const sinHeight =
            Math.sin(sinSeed / 100) *
            (this._options.position === 'TOP'
              ? this._options.amplitude
              : -this._options.amplitude)
          const yPos =
            Math.sin(sinSeed / 100) * sinHeight +
            (this._options.position === 'TOP'
              ? this._options.height
              : this._cache.height - this._options.height)
          points.push({ x: x, y: yPos })
        }
        break
    }

    return points
  }

  private _drawPath(points: PathPointCurveTo[]) {
    let SVGString = `M ${points[0].x} ${points[0].y}`

    const cp = {
      x: 0,
      y: 0
    }
    switch (this._options.position) {
      case 'RIGHT':
      case 'LEFT':
        cp.x =
          points[1].x - points[0].x + points[0].x + (points[1].x - points[0].x)
        cp.y = (points[1].y - points[0].y) / 2
        break

      case 'TOP':
      case 'BOTTOM':
      default:
        cp.x = (points[1].x - points[0].x) / 2
        cp.y =
          points[1].y - points[0].y + points[0].y + (points[1].y - points[0].y)
        break
    }

    SVGString += `C ${cp.x} ${cp.y} ${cp.x} ${cp.y} ${points[1].x} ${points[1].y}`

    for (let i = 1; i < points.length - 1; i++) {
      cp.x = points[i].x - cp.x + points[i].x
      cp.y = points[i].y - cp.y + points[i].y

      SVGString += `C ${cp.x} ${cp.y} ${cp.x} ${cp.y} ${points[i + 1].x} ${points[i + 1].y
        }`
    }

    SVGString += this._getPathEnd()
    return SVGString
  }

  private _draw() {
    const now = window.Date.now()

    if (this._cache.lastUpdate) {
      const elapsed = (now - this._cache.lastUpdate) / 1000

      this._cache.lastUpdate = now

      this._cache.totalTime += elapsed

      const factor = this._cache.totalTime * Math.PI

      this._cache.gsapInstance = gsap.to(this._target, {
        duration: this._options.speed,
        attr: {
          d: this._drawPath(this._drawPoints(factor))
        },
        ease: Power1.easeInOut
      })
    } else {
      this._cache.lastUpdate = now
    }

    this._cache.animationInstance = requestAnimationFrame(
      this._draw.bind(this)
    )
  }

  play(): void {
    if (!this._cache.animationInstance) {
      this._cache.animationInstance = requestAnimationFrame(
        this._draw.bind(this)
      )
    }
  }

  pause(): void {
    if (this._cache.animationInstance) {
      cancelAnimationFrame(this._cache.animationInstance)
      delete this._cache.animationInstance
    }
  }

  setOptions(options: Partial<Options>): void {
    this._options = Object.assign({}, this._options, options)
    this._options.position = this._options.position.toLocaleUpperCase()
  }
}

function wavify(el: NodeElement, options: Partial<Options>): Wavify {
  return new Wavify(el, options)
}

export { Wavify, wavify }
export default wavify
