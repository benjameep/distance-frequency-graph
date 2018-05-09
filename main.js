const svg = d3.select('svg'),
  margin = {top:20,right:40,bottom:30,left:40},
  width = svg.attr('width') - margin.left - margin.right,
  height = svg.attr('height') - margin.top - margin.bottom


const color = n => d3.interpolateMagma(n*360/(233/144)%360/360)

const container = svg.append("g")
  .attr('transform',`translate(${margin.left},${margin.top})`)

const dotplot = container.append('g')

const dotAxis = dotplot.append('g')
  .attr('class','axis axis--x')
  .attr('transform',`translate(0,${height})`)
const dotScale = d3.scaleLinear().domain([0,1]).range([0,width])
dotAxis.call(d3.axisBottom(dotScale).ticks()).selectAll('text').remove()

function updateDotPlot(){
  const dots = dotplot.selectAll('.dot').data(data)
  dots
    .attr('opacity',1)
    .transition()
    .duration(500)
    .attr('cx',dotScale)
  dots.exit()
    .transition()
    .duration(500)
    .attr('opacity',0)
    .attr('cx',() => dotScale(Math.random()))
    .remove()
  dots.enter().append('circle')
    .attr('class','dot')
    .attr('r',2.5)
    .attr('cy',height-10)
    .attr('opacity',0)
    .attr('cx',() => dotScale(Math.random()))
    .transition()
    .duration(500)
    .attr('opacity',1)
    .attr('cx',dotScale)
}


const floor = height-60

const x = d3.scaleBand().range([5,width]),
  y = d3.scaleLinear().rangeRound([floor,0]).domain([0,1])

const bargraph = container.append('g')
const barxAxis = bargraph.append('g')
  .attr('class','axis axis--x')
  .attr('transform',`translate(0,${floor})`)
const baryAxis = bargraph.append('g')
  .attr('class','axis axis--y')


function updateBarGraph(){
  const dists = data.sort().map((n,i) => n - (data[i-1]==undefined?0:data[i-1]))
  const size = 1/bucketCount
  const buckets = dists.reduce((b,n) => {
    b[Math.floor(n/size)]++
    return b
  },Array(bucketCount).fill(0)).map(n => n/data.length)

  x.domain(Object.keys(buckets))
  
  barxAxis.call(d3.axisBottom(x))
  baryAxis.call(d3.axisLeft(y).ticks(10,'%'))
  barxAxis.selectAll('text').remove()

  const bars = bargraph.selectAll('.bar').data(buckets)
  bars
    .transition()
    .duration(500)
    .attr('height',d => floor-y(d))
    .attr('y',y)
    .attr('x',(n,i) => x(i))
    .attr('width',x.bandwidth())
  bars.exit()    
    .transition()
    .duration(500)
    .attr('height',0)
    .attr('y',floor)
    .remove()
  bars.enter().append('rect')
    .attr('class','bar')
    .attr('x',(n,i) => x(i))
    .attr('width',x.bandwidth())
    .attr('height',0)
    .attr('y',floor)
    .transition()
    .duration(500)
    .attr('height',d => floor-y(d))
    .attr('y',y)
}

var data
var bucketCount = 20
var num = 20

function generate(){
  data = Array(num).fill().map(Math.random)
  updateDotPlot()
  updateBarGraph()
}
