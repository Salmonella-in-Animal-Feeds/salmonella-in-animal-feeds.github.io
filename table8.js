const table = d3.select('#table').append('table');
const thead = table.append('thead');
const tbody = table.append('tbody');
const colors = {
    "S. Typhimurium":"#72788D",
    "S. Anatum":"#4DA167",
    "S. Senftenberg":"#231123",
    "S. spp":"#477998",
    "S. Mbandaka":"#8B1E3F",
    "S. Montevideo":"#816E94",
    "S. Kedougou":"#FFC15E",
    "S. Derby":"#E26D5A",
    "S. Rissen":"#4ECDC4",
    "S. Durham":"#04724D",
    "S. Newport":"#C08497",
    "S. Stanley":"#CCF5AC",
    "S. Typhimurium DT104":"#874F6F",
    
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

d3.csv('field_serotypes.csv').then((data) => {
    window.data = data;
    const continentGroup = d3.group(data, (d) => d.continent);
    const locationGrouped = d3.group(data, (d) => d.species, (d) => d.continent, (d) => d.serotype);

    const legend = thead
        .append('tr')
    legend.append('th').text('Animal Species').attr('rowspan', 2).attr('style','background-color:#06357C')
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
legend.append("circle").attr("cx",20).attr("cy",12).attr("r", 10).style("fill", "#4DA167")
legend.append("circle").attr("cx",118).attr("cy",12).attr("r", 10).style("fill", "#E26D5A")
legend.append("circle").attr("cx",203).attr("cy",12).attr("r", 10).style("fill", "#04724D")
legend.append("circle").attr("cx",299).attr("cy",12).attr("r", 10).style("fill", "#FFC15E")
legend.append("circle").attr("cx",408).attr("cy",12).attr("r", 10).style("fill", "#8B1E3F")
legend.append("circle").attr("cx",518).attr("cy",12).attr("r", 10).style("fill", "#816E94")
legend.append("circle").attr("cx",638).attr("cy",12).attr("r", 10).style("fill", "#C08497")
legend.append("circle").attr("cx",20).attr("cy",45).attr("r", 10).style("fill", "#4ECDC4")
legend.append("circle").attr("cx",108).attr("cy",45).attr("r", 10).style("fill", "#231123")
legend.append("circle").attr("cx",228).attr("cy",45).attr("r", 10).style("fill", "#477998")
legend.append("circle").attr("cx",297).attr("cy",45).attr("r", 10).style("fill", "#CCF5AC")
legend.append("circle").attr("cx",389).attr("cy",45).attr("r", 10).style("fill", "#72788D")
legend.append("circle").attr("cx",518).attr("cy",45).attr("r", 10).style("fill", "#874F6F")



legend.append("text").attr("x", 35).attr("y", 12).text("S. Anatum").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 133).attr("y", 12).text("S. Derby").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 218).attr("y", 12).text("S. Durham").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 314).attr("y", 12).text("S. Kedougou").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 423).attr("y", 12).text("S. Mbandaka").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 533).attr("y", 12).text("S. Montevideo").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 653).attr("y", 12).text("S. Newport").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 35).attr("y", 45).text("S. Rissen").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 123).attr("y", 45).text("S. Senftenberg").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 243).attr("y", 45).text("S. spp").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 312).attr("y", 45).text("S. Stanley").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 404).attr("y", 45).text("S. Typhimurium").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 533).attr("y", 45).text("S. Typhimurium DT104").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 12).attr("y", 78).text("The top 10 serovars found in fields used to grow animal feeds are reported. However, the list exceeds 10 because").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 12).attr("y", 98).text("several serovars were studied an equal number of times. Further, no studies identified Oceania or South America and").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 12).attr("y", 118).text("thus these regions were excluded from this map. Moreover, studies that reported multiple regions (n=6) were excluded").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 12).attr("y", 138).text("from this map since data (e.g., serovars) were not extracted for each individual region.").style("font-size", "15px").attr("alignment-baseline","middle")