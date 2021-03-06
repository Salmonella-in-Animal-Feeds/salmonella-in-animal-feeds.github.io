const table = d3.select('#table').append('table');
const thead = table.append('thead');
const tbody = table.append('tbody');
const colors = {
    "S. Tennessee":"#dcbeff",
    "S. Infantis":"#0827F5",
    "S. Senftenberg":"#469990",
    "S. spp":"#000075",
    "S. Mbandaka":"#e6194b",
    "S. Montevideo":"#a9a9a9",
    "S. Ohio":"#000000",
    "S. Livingstone":"#a40000",
    "S. Orion":"#FFBB00",
    "S. Oranienburg":"#aaffc3",
    "S. Schwarzengrund":"#f15a22"
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

d3.csv('transport_serotypes.csv').then((data) => {
    window.data = data;
    const continentGroup = d3.group(data, (d) => d.continent);
    const locationGrouped = d3.group(data, (d) => d.species, (d) => d.continent, (d) => d.serotype);

    const legend = thead
        .append('tr')
    legend.append('th').text('Animal Species for Which the Feed was Intended').attr('rowspan', 2).attr('style','background-color:#06357C')
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
legend.append("circle").attr("cx",20).attr("cy",12).attr("r", 10).style("fill", "#0827F5")
legend.append("circle").attr("cx",113).attr("cy",12).attr("r", 10).style("fill", "#a40000")
legend.append("circle").attr("cx",233).attr("cy",12).attr("r", 10).style("fill", "#e6194b")
legend.append("circle").attr("cx",348).attr("cy",12).attr("r", 10).style("fill", "#a9a9a9")
legend.append("circle").attr("cx",470).attr("cy",12).attr("r", 10).style("fill", "#000000")
legend.append("circle").attr("cx",551).attr("cy",12).attr("r", 10).style("fill", "#aaffc3")
legend.append("circle").attr("cx",676).attr("cy",12).attr("r", 10).style("fill", "#FFBB00")
legend.append("circle").attr("cx",20).attr("cy",45).attr("r", 10).style("fill", "#f15a22")
legend.append("circle").attr("cx",170).attr("cy",45).attr("r", 10).style("fill", "#469990")
legend.append("circle").attr("cx",290).attr("cy",45).attr("r", 10).style("fill", "#000075")
legend.append("circle").attr("cx",358).attr("cy",45).attr("r", 10).style("fill", "#dcbeff")




legend.append("text").attr("x", 35).attr("y", 12).text("S. Infantis").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 128).attr("y", 12).text("S. Livingstone").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 248).attr("y", 12).text("S. Mbandaka").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 363).attr("y", 12).text("S. Montevideo").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 485).attr("y", 12).text("S. Ohio").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 566).attr("y", 12).text("S. Oranienburg").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 691).attr("y", 12).text("S. Orion").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 35).attr("y", 45).text("S. Schwarzengrund").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 185).attr("y", 45).text("S. Senftenberg").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 305).attr("y", 45).text("S. spp").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 373).attr("y", 45).text("S. Tennessee").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 12).attr("y", 78).text("The top 10 serovars found on feed transportation are reported. However, no studies idenfitied Oceania and thus this").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 12).attr("y", 98).text("region was excluded from the map. Moreover, studies that reported multiple regions (n=6) were excluded from this").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 12).attr("y", 118).text("map since data (e.g., serovars) were not extracted for each individual region.").style("font-size", "15px").attr("alignment-baseline","middle")