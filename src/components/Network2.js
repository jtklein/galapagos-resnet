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

  function isSelectedNode(node) {
    if (!props.selectedNode) {
      return false;
    }
    return node.id === props.selectedNode.id;
  }

  function isConnectedNode(node) {
    if (!props.selectedNode || !props.connectedNodes) {
      return false;
    }
    const connectedIDs = props.connectedNodes.map((n) => n.id);
    return connectedIDs.includes(node.id);
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
    .attr("opacity", function (d) {
      if (!props.selectedNode) {
        return 1;
      }
      return isConnectedNode(d) || isSelectedNode(d) ? 1 : 0.3;
    })
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
          if (!props.selectedNode) {
            return d.color;
          }
          return isConnectedNode(d) || isSelectedNode(d)
            ? d.color
            : "lightgray";
        })
    )
    // TODO: Place a call iterating over these after the first round of mapping, so that the labels are alwys above other nodes
    .call((g) =>
      g
        .append("text")
        .attr("fill", function (d) {
          if (!props.selectedNode) {
            return "#000";
          }
          return isConnectedNode(d) || isSelectedNode(d) ? "#000" : "lightgray";
        })
        .attr("dx", nodeRadius)
        .attr("dy", nodeRadius)
        .attr("text-decoration", function (d) {
          if (!props.selectedNode) {
            return "none";
          }
          return isSelectedNode(d) ? "underline" : "none";
        })
        .text((d) => d.id)
    )
    .call((g) =>
      g
        // A circle to highlight the selected node
        // TODO: this is pretty inefficient because it adds nodes' size worth of amount of extra invisible circles
        .append("circle")
        .attr("class", "highlight-circle")
        .attr("r", (d) => nodeRadius + 3)
        .attr("fill", "none")
        .attr("stroke", (d) => {
          return isSelectedNode(d) ? d.color : null;
        })
        .attr("stroke-width", 1.5)
    )
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
      d.fx = clamp(event.x, 0, width);
      d.fy = clamp(event.y, 0, height);
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0.0001);
    d.fx = null;
    d.fy = null;
  }

  function clamp(x, lo, hi) {
    return x < lo ? lo : x > hi ? hi : x;
  }

  const simulation = d3
    .forceSimulation()
    .nodes(data.nodes)
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force(
      "link",
      d3.forceLink(data.links).id((d) => d.id)
    )
    .force("collide", d3.forceCollide())
    .on("tick", tick);

  function tick() {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
    node.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
  }

}