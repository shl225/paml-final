export const Bar = (props) => {
  return <rect {...props} />
}

export const BarChart = (props) => {
  return <svg {...props} />
}

export const CartesianGrid = (props) => {
  return <g {...props} />
}

export const Legend = (props) => {
  return <div>Legend</div>
}

export const Line = (props) => {
  return <path {...props} />
}

export const LineChart = (props) => {
  return <svg {...props} />
}

export const ResponsiveContainer = (props) => {
  return <div style={{ width: "100%", height: "100%" }}>{props.children}</div>
}

export const Tooltip = (props) => {
  return <div>Tooltip</div>
}

export const XAxis = (props) => {
  return <div>XAxis</div>
}

export const YAxis = (props) => {
  return <div>YAxis</div>
}

export const Area = (props) => {
  return <path {...props} />
}

export const AreaChart = (props) => {
  return <svg {...props} />
}
