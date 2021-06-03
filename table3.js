const table = d3.select('#table').append('table');
const thead = table.append('thead');
const tbody = table.append('tbody');
const colors = {
    "Prevalence":"#72788D",
    "Serotype(s) Present":"#4DA167",
    "Molecular Characteristics":"#4ECDC4",
    "Concentration":"#477998",
    "Survival Time":"#E26D5A",
    "Antimicrobial Resistance":"#04724D",
    "OR/RR/HR":"#C08497",
}

var Tooltip = d3.select("body")
.append("div")
.style("opacity", 0)
.attr("class", "tooltip")
.style("position", "absolute")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "1px")
.style("border-radius", "5px")
.style("padding", "5px")

var mouseover = function(event,d) {
    console.log(d)
    Tooltip
      .style("opacity", 1)
    if(d){
        Tooltip
            .selectAll('div')
            .remove()
        const design = Tooltip
            .selectAll("div")
            .data([...d.entries()].map(([name,studies]) =>{
                return {name:name, count:studies.length}
            }))
            .enter()
            .append("div")
            
        design.append("svg")
            .attr('height',10)
            .attr('width',10)
            .attr('viewbox', "0 0 10 10")
            .append('circle')
            .attr('cx', 5)
            .attr('cy', 5)
            .attr('r', 5)
            .attr('fill', (d)=>colors[d.name])
        design.append("span")
            .text((data)=>`${data.name}: ${data.count}`)
    } else {
        Tooltip
            .selectAll('div')
            .remove()
        Tooltip
            .append("div")
            .text("No data")
    }
  }
  var mousemove = function(event, d) {
    Tooltip
      .style("left", (event.pageX+20) + "px")
      .style("top", (event.pageY+20) + "px")
  }
  var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
  }

d3.csv('data4.csv').then((data) => {
    window.data = data;
    const continentGroup = d3.group(data, (d) => d.continent);
    const locationGrouped = d3.group(data, (d) => d.species, (d) => d.continent, (d) => d.outcome);

    const legend = thead
        .append('tr')
    legend.append('th').text('Animals Species').attr('rowspan', 2).attr('style','background-color:#06357C')
    legend.append('th').text('Region').attr('colspan', continentGroup.size).attr('style','background-color:#06357C')

    thead
        .append('tr')
        .selectAll('th')
        .data([...continentGroup.keys()])
        .enter()
        .append('th')
        .text((d) => d)

    const cells = tbody
        .selectAll('tr')
        .data(locationGrouped.entries())
        .enter()
        .append('tr')
        .selectAll('td')
        .data(([location, d]) => {
            const locationData = [...continentGroup.keys()].map((c) => d.get(c))
            return [location, ...locationData]
        })
        .enter()
        .append('td')

    cells.filter((d, i) => i === 0).text(d => d)
    cells.filter((d, i) => i > 0)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .append('svg')
        .attr('height',80)
        .attr('width',80)
        .attr('viewbox', "0 0 80 80")
        .selectAll('circle')
        .data((d) => {
            if (!d) return []; 
            var dataset = {children:[...d.entries()].map(([name,studies]) =>{
                return {name:name, count:studies.length}
            })}
            var bubble = d3.pack(dataset)
            .size([80, 80])
            .padding(1.5);
            var nodes = d3.hierarchy(dataset)
            .sum((d) => { return d.count; });    
            return bubble(nodes).descendants()
        })
        .enter()
        .filter((d) => !d.children)
        .append('circle')
        .attr('cx', (d)=>d.x)
        .attr('cy', (d)=>d.y)
        .attr('r', (d)=>d.r)
        .attr('fill', (d)=>colors[d.data.name])
})

// select the svg area
var legend = d3.select("#legend")

//Handmade legend
legend.append("circle").attr("cx",20).attr("cy",12).attr("r", 10).style("fill", "#72788D")
legend.append("circle").attr("cx",118).attr("cy",12).attr("r", 10).style("fill", "#4DA167")
legend.append("circle").attr("cx",262).attr("cy",12).attr("r", 10).style("fill", "#4ECDC4")
legend.append("circle").attr("cx",450).attr("cy",12).attr("r", 10).style("fill", "#477998")
legend.append("circle").attr("cx",570).attr("cy",12).attr("r", 10).style("fill", "#E26D5A")
legend.append("circle").attr("cx",690).attr("cy",12).attr("r", 10).style("fill", "#04724D")
legend.append("circle").attr("cx",870).attr("cy",12).attr("r", 10).style("fill", "#C08497")


legend.append("text").attr("x", 35).attr("y", 12).text("Prevalence").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 133).attr("y", 12).text("Serovar(s) Present").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 277).attr("y", 12).text("Molecular Characteristics").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 465).attr("y", 12).text("Concentration").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 585).attr("y", 12).text("Survival Time").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 705).attr("y", 12).text("Antimicrobial resistance").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 885).attr("y", 12).text("OR/RR/HR").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 12).attr("y", 50).text("A single study may report more than one region or animal species, so study count may exceed the number of studies characterized. Furthermore, studies that did ").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 12).attr("y", 70).text("not report prevalence, serotype(s) present, molecular characteristics, survival time, antimicrobial resistance, or the OR/RR/HR were excluded from this").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 12).attr("y", 90).text("characterization.").style("font-size", "15px").attr("alignment-baseline","middle")
