import * as d3 from "d3";

import './Network.css';

const nodeRadius = 20;
const linkWidth = 2;

export default function Network(el, properties) {
  const props = Object.assign(
    {
      nodeColor: (d) => "lightgray",
    },
    properties
  );

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
  if (props.selectedNode) {
    linksOfSelectedNode = data.links.filter((link) =>
      isLinkOfSelectedNode(link)
    );
  }

  function isLinkOfNode(link, node) {
    return (
      ((link.source.id || link.source) === node.id) |
      ((link.target.id || link.target) === node.id)
    );
  }

  function isLinkOfSelectedNode(link) {
    if (!props.selectedNode) {
      return false;
    }
    return isLinkOfNode(link, props.selectedNode);
  }

  function isSelectedNode(node) {
    if (!props.selectedNode) {
      return false;
    }
    return node.id === props.selectedNode.id;
  }

  const nodeSize = (d) => {
    d.radius = nodeRadius;
    return nodeRadius;
  };

  const draw = () => {
    path.attr("d", function (d) {
      const sourceNode = data.nodes.filter((node) => node.id === d.source)[0];
      const targetNode = data.nodes.filter((node) => node.id === d.target)[0];

      // Total difference in x and y from source to target
      const dx = targetNode.x - sourceNode.x;
      const dy = targetNode.y - sourceNode.y;
      // Length of path from center of source node to center of target node
      const dr = Math.sqrt(dx * dx + dy * dy);

      // x and y distances from center to outside edge of target node
      const offsetX = (dx * targetNode.radius) / dr;
      const offsetY = (dy * targetNode.radius) / dr;

      return `M${
        sourceNode.x
      },${sourceNode.y}A${dr * 1.5},${dr * 1.5} 0 0,1 ${targetNode.x - offsetX},${targetNode.y - offsetY}`;
    });

    node.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
  };

  // The links between the nodes
  const path = g
    .append("g")
    .selectAll(".link")
    .data(linksOfSelectedNode)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("stroke", "lightgray")
    .attr("stroke-width", linkWidth)
    .style("fill", "none")
    .attr("stroke", function (d) {
      // If there is no node selected, all links are grey
      if (!props.selectedNode) {
        return "lightgray";
      }
      // Only color links that are connected to the highlighted node
      return isLinkOfSelectedNode(d) ? props.linkColor(d) : "lightgray";
    })
    .attr("opacity", function (d) {
      if (!props.selectedNode) {
        return 0.3;
      }
      return isLinkOfSelectedNode(d) ? 1 : 0.3;
    });

  const node = g
    .selectAll(".node")
    .data(data.nodes, function (d) {
      return d.id;
    })
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("cursor", "pointer")
    .on("click", function (event) {
      if (event.defaultPrevented) return; // dragged
      // Get this node's data
      const datum = d3.select(this).datum();
      props.onClick(datum);
    })
    .call((g) =>
      g
        .append("circle")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .attr("r", (d) => nodeSize(d))
        .attr("fill", function (d) {
          if (!props.selectedNode) {
            return d.color;
          }
          return isSelectedNode(d) ? d.color : "lightgray";
        })
    )
    // TODO: Place a call iterating over these after the first round of mapping, so that the labels are alwys above other nodes
    .call((g) =>
      g
        .append("text")
        .attr("fill", "#000")
        .attr("dx", 20)
        .attr("dy", 20)
        .text((d) => d.id)
    )
    .call(
      d3
        .drag()
        .on("drag", (event, d) => {
          // Restrict dragging to the svg rectangle
          let x = event.x;
          if (x + d.radius > width) {
            x = width - d.radius;
          } else if (event.x - d.radius < 0) {
            x = 0 + d.radius;
          }
          let y = event.y;
          if (y + d.radius > height) {
            y = height - d.radius;
          } else if (event.y - d.radius < 0) {
            y = 0 + d.radius;
          }
          // Update node position
          d.x = x;
          d.y = y;
        })
        .on("start.update drag.update end.update", draw)
    );
  draw();
}
