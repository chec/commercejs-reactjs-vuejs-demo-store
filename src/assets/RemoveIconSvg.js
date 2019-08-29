import { h } from 'panel';

export default () => {
  return h('svg', {
    attrs: {
      width: '100%',
      height: '100%',
      viewBox: '0 0 30 29',
      fill: 'none'
    }
  }, [
    h('ellipse', {
      attrs: {
        cx: "14.6088",
        cy: "14.5",
        rx: "14.6088",
        ry: "14.5",
        fill: "#545454"
      }
    }),
    h('line', {
      attrs: {
        y1:"-0.5",
        x2: "10.6728",
        y2: "-0.5",
        transform: "matrix(0.709745 -0.704458 0.709745 0.704458 11 18.5186)",
        stroke: "#E37070"
      }
    }),
    h('line', {
      attrs: {
        y1: "-0.5",
        x2: "10.6728",
        y2: "-0.5",
        transform: "matrix(-0.709745 -0.704458 -0.709745 0.704458 18.575 18.5186)",
        stroke: "#E37070"
      }
    })
  ])
}
