import * as d3 from "d3";

import './Network.css';

const nodeRadius = 8;
const linkWidth = 2;

export default function Network(el, props) {

  const anchorElement = d3.select(el);
  let svg = anchorElement.select("svg");

  // Create svg if not already created
  if (svg.empty()) {
    anchorElement.selectAll("*").remove();
    svg = anchorElement.append("svg");
    svg.append("g");
  }

  const g = svg.select("g");
  g.selectAll("*").remove();

  const height = parseInt(d3.select("#network").style("height"));
  const width = parseInt(d3.select("#network").style("width"));

  svg.attr("width", width).attr("height", height);

  const { data } = props;

  let linksOfSelectedNode = data.links;
  if (props.selectedNode && props.connectedLinks) {
    linksOfSelectedNode = props.connectedLinks;
  }
  const link = g
    .append("g")
    .selectAll(".link")
    .data(linksOfSelectedNode)
    .join("line")
    .classed("link", true)
    .attr("stroke", "lightgray")
    .attr("stroke-width", linkWidth);

  const node = g
    .selectAll(".node")
    .data(data.nodes, function (d) {
      return d.id;
    })
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("cursor", "pointer")
    .on("click", function (event, d) {
      if (event.defaultPrevented) return; // dragged
      delete d.fx;
      delete d.fy;
      simulation.alpha(1).restart();
      // Get this node's data
      const datum = d3.select(this).datum();
      props.onClick(datum);
    })
    .call((g) =>
      g
        .append("circle")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .attr("r", nodeRadius)
        .attr("fill", function (d) {
          return d.color;
        })
    )
    // TODO: Place a call iterating over these after the first round of mapping, so that the labels are alwys above other nodes
    .call((g) =>
      g
        .append("text")
        .attr("fill", "#000")
        .attr("dx", nodeRadius)
        .attr("dy", nodeRadius)
        .text((d) => d.id)
    )
    .call(
      d3
        .drag()
        .on("drag", dragged)
    );
;

  const simulation = d3
    .forceSimulation()
    .nodes(data.nodes)
    .force("charge", d3.forceManyBody().strength(-150))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("link", d3.forceLink(data.links).id(d => d.id))
    .on("tick", tick);

  function tick() {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
    node.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
  }

  function clamp(x, lo, hi) {
    return x < lo ? lo : x > hi ? hi : x;
  }

  function dragged(event, d) {
    d.fx = clamp(event.x, 0, width);
    d.fy = clamp(event.y, 0, height);
    simulation.alpha(1).restart();
  }
}