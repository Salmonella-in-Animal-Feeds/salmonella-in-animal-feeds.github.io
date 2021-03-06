const table = d3.select('#table').append('table');
const thead = table.append('thead');
const tbody = table.append('tbody');
const colors = {
    "Analytical observational":"#000075",
    "Diagnostic test evaluation":"#4363d8",
    "Single group observational":"#aaffc3",
    "Molecular studies":"#ffe119",
    "Laboratory study (experimental)":"#e6194b",
    "Clinical / field trial with natural disease exposure":" #f58231",
    "Challenge trial in natural setting":"#42d4f4",
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

d3.csv('data9.csv').then((data) => {
    window.data = data;
    const continentGroup = d3.group(data, (d) => d.continent);
    const locationGrouped = d3.group(data, (d) => d.serotype, (d) => d.continent, (d) => d.st_design);

    const legend = thead
        .append('tr')
    legend.append('th').text('Serovar').attr('rowspan', 2).attr('style','background-color:#06357C')
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
legend.append("circle").attr("cx",20).attr("cy",12).attr("r", 10).style("fill", "#000075")
legend.append("circle").attr("cx",200).attr("cy",12).attr("r", 10).style("fill", "#4363d8")
legend.append("circle").attr("cx",386).attr("cy",12).attr("r", 10).style("fill", "#aaffc3")
legend.append("circle").attr("cx",578).attr("cy",12).attr("r", 10).style("fill", "#ffe119")
legend.append("circle").attr("cx",716).attr("cy",12).attr("r", 10).style("fill", "#e6194b")
legend.append("circle").attr("cx",20).attr("cy",45).attr("r", 10).style("fill", "#f58231")
legend.append("circle").attr("cx",348).attr("cy",45).attr("r", 10).style("fill", "#42d4f4")

legend.append("text").attr("x", 35).attr("y", 12).text("Analytical Observational").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 215).attr("y", 12).text("Diagnostic test evaluation").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 401).attr("y", 12).text("Single group observational").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 593).attr("y", 12).text("Molecular studies").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 731).attr("y", 12).text("Laboratory study (experimental)").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 35).attr("y", 45).text("Clinical / field trial with natural disease exposure").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 363).attr("y", 45).text("Challenge trial in natural setting").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 12).attr("y", 80).text("A single study may report more than one region or serovar, so study count may exceed the number of studies characterized. In addition, the serovars").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 12).attr("y", 100).text("included the top 10 across all five sectors. However, the number of serovars listed is greater than 10 because some serovars were studied an equal").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 12).attr("y", 120).text("number of times. Moreover, studies that reported multiple regions (n = 6) were excluded from this map since data (e.g., serovars) were not extracted").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("x", 12).attr("y", 140).text("for each individual region.").style("font-size", "15px").attr("alignment-baseline","middle")