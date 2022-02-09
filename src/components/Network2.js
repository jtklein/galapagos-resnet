import * as d3 from "d3";

import './Network.css';

const nodeRadius = 8;
const linkWidth = 2;

export default function Network(el, props) {
  const height = parseInt(d3.select("#network").style("height"));
  const width = parseInt(d3.select("#network").style("width"));

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
    .attr("stroke", function (d) {
      return d.color;
    })
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
        .attr("dx", nodeRadius + 2)
        .attr("dy", nodeRadius / 2)
        .attr("font-size", nodeRadius + nodeRadius * 0.1)
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
    );

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

  // Zoom related
  // center the action (handles multitouch)
  function center(event, target) {
    if (event.sourceEvent) {
      const p = d3.pointers(event, target);
      return [d3.mean(p, (d) => d[0]), d3.mean(p, (d) => d[1])];
    }
    return [width / 2, height / 2];
  }

  // z holds a copy of the previous transform, so we can track its changes
  let z = d3.zoomIdentity;

  // set up the ancillary zoom and an accessor for the transform
  const zoomX = d3.zoom()
    .extent([[0, 0],[width, height]])
    .scaleExtent([1, 8]);
  const tx = () => d3.zoomTransform(g.node());

  // active zooming
  const zoom = d3.zoom().on("zoom", function (e) {
    const t = e.transform;
    const k = t.k / z.k;
    const point = center(e, this);

    if (k === 1) {
      // pure translation?
      g.call(zoomX.translateBy, (t.x - z.x) / tx().k, 0);
    } else {
      // if not, we're zooming on a fixed point
      g.call(zoomX.scaleBy, k, point);
    }

    z = t;

    g.attr("transform", t);
  });

  svg.call(zoom).call(zoom.transform, d3.zoomIdentity.scale(1));
  // End of zoom
}