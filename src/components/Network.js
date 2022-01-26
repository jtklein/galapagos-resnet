import * as d3 from "d3";

import './Network.css';

export default function Network(el, properties) {
  const props = Object.assign(
    {
      nodeColor: (d) => "lightgray",
    },
    properties
  );
  const linkWeightsSet =
    props.selectedLinkWeights && props.selectedLinkWeights.length !== 0;
  const goalsSet =
    props.selectedGoals && props.selectedGoals.length !== 0;

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

  function isSelectedLinkWeight(link) {
    if (!linkWeightsSet) {
      return false;
    }
    return  props.selectedLinkWeights.indexOf(link.weight) !== -1;
  }

  function isIncomingLink(link, node) {
    return (link.target.id || link.target) === node.id;
  }

  function isOutgoingLink(link, node) {
    return (link.source.id || link.source) === node.id;
  }

  function isSelectedDirection(link) {
    if (!props.selectedDirection || !props.selectedNode) {
      return false;
    }
    if (props.selectedDirection === "incoming") {
      return isIncomingLink(link, props.selectedNode);
    }
    if (props.selectedDirection === "outgoing") {
      return isOutgoingLink(link, props.selectedNode);
    }
  }

  function isSelectedNode(node) {
    if (!props.selectedNode) {
      return false;
    }
    return node.id === props.selectedNode.id;
  }

  function isConnectedNode(node) {
    if (!props.selectedNode) {
      return false;
    }
    const connectedIDs = [];
    linksOfSelectedNode.map((link) => {
      if (
        linkWeightsSet &&
        props.selectedLinkWeights.indexOf(link.weight) === -1
      ) {
        return false;
      }
      if (props.selectedDirection && !isSelectedDirection(link)) {
        return false;
      }
      connectedIDs.push(link.source);
      connectedIDs.push(link.target);
      return true;
    });
    return connectedIDs.includes(node.id);
  }

  function isSelectedGoal(node) {
    if (!goalsSet) {
      return false;
    }
    return props.selectedGoals.indexOf(node.id.split(".")[0]) !== -1 ;
  }

  const linkWidth = (d) => {
    return d.weight;
  };

  const nodeSize = (d) => {
    const radius = d.size * 200;
    d.radius = radius;
    return d.radius;
  };

  const textDx = (d) => {
    return d.size * -100;
  };

  const shakeNode = () => {
    const transitionTime = 100;
    const centralDistance = 4;
    const randomY = Math.random() * centralDistance;
    const xDist = Math.random() > 0.5 ? centralDistance : centralDistance * -1;
    const yDist = Math.random() > 0.5 ? randomY : randomY * -1;
    node
      .transition()
      .delay((d, i) => i * 10 * d.delayFactor)
      .duration(transitionTime)
      .attr("transform", (d) => `translate(${d.x + xDist * d.directionFactor}, ${d.y + yDist})`)
      .transition()
      .duration(transitionTime * 2)
      .attr("transform", (d) => `translate(${d.x - xDist * d.directionFactor}, ${d.y - yDist})`)
      .transition()
      .duration(transitionTime)
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`);
  };

  const jiggle = () => {
    node
     .each(d => {
       d.delayFactor = Math.random();
       d.directionFactor = (Math.random() * 2) - 1;
      });
    shakeNode();
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

  var defs = svg.append("svg:defs");

  function marker(d) {
    defs
      .append("svg:marker")
      .attr("id", props.linkColor(d).replace("#", ""))
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)
      .attr("refY", 0)
      .attr("markerWidth", 9)
      .attr("markerHeight", 9)
      .attr("orient", "auto")
      .attr("markerUnits", "userSpaceOnUse")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5")
      .style("fill", props.linkColor(d));
    return "url(" + props.linkColor(d) + ")";
  }

  defs
    .append("svg:marker")
    .attr("id", "grey-marker")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 10)
    .attr("refY", 0)
    .attr("markerWidth", 9)
    .attr("markerHeight", 9)
    .attr("orient", "auto")
    .attr("markerUnits", "userSpaceOnUse")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5")
    .style("fill", "lightgray");

  // The links between the nodes
  const path = g
    .append("g")
    .selectAll(".link")
    .data(linksOfSelectedNode)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("stroke", "lightgray")
    .attr("stroke-width", (d) => linkWidth(d))
    .style("fill", "none")
    .attr("marker-end", function (d) {
      if (!props.selectedNode) {
        return "url(#grey-marker)";
      }
      // If a link weight and link direction is highlighted only color the according links
      if (linkWeightsSet && props.selectedDirection) {
        return isSelectedLinkWeight(d) && isSelectedDirection(d)
          ? marker(d)
          : "url(#grey-marker)";
      }
      if (linkWeightsSet) {
        return isSelectedLinkWeight(d) ? marker(d) : "url(#grey-marker)";
      }
      if (props.selectedDirection) {
        return isSelectedDirection(d) ? marker(d) : "url(#grey-marker)";
      }
      return isLinkOfSelectedNode(d) ? marker(d) : "url(#grey-marker)";
    })
    .attr("stroke", function (d) {
      // If there is no node selected, all links are grey
      if (!props.selectedNode) {
        return "lightgray";
      }
      // If a link weight and link direction is highlighted only color the according links
      if (linkWeightsSet && props.selectedDirection) {
        return isSelectedLinkWeight(d) && isSelectedDirection(d)
          ? props.linkColor(d)
          : "lightgray";
      }
      if (linkWeightsSet) {
        return isSelectedLinkWeight(d) ? props.linkColor(d) : "lightgray";
      }
      if (props.selectedDirection) {
        return isSelectedDirection(d) ? props.linkColor(d) : "lightgray";
      }
      // Only color links that are connected to the highlighted node
      return isLinkOfSelectedNode(d) ? props.linkColor(d) : "lightgray";
    })
    .attr("opacity", function (d) {
      if (!props.selectedNode) {
        return 0.3;
      }
      // If a link weight and link direction is highlighted only color the according links
      if (linkWeightsSet && props.selectedDirection) {
        return isSelectedLinkWeight(d) && isSelectedDirection(d)
          ? 1
          : 0.3;
      }
      if (linkWeightsSet) {
        return isSelectedLinkWeight(d) ? 1 : 0.3;
      }
      if (props.selectedDirection) {
        return isSelectedDirection(d) ? 1 : 0.3;
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
          if (goalsSet) {
            return isSelectedGoal(d) ? props.nodeColor(d) : "lightgray";
          }
          if (!props.selectedNode) {
            return props.nodeColor(d);
          }
          return isConnectedNode(d) || isSelectedNode(d) ? props.nodeColor(d) : "lightgray";
        })
    )
    .call((g) =>
      g
        .append("text")
        .attr("textLength", (d) => nodeSize(d))
        .attr("lengthAdjust", "spacingAndGlyphs")
        .attr("fill", "#fff")
        .attr("dx", (d) => textDx(d))
        .attr("dy", ".35em")
        .text((d) => d.id)
    )
    .call((g) =>
      g
        // A circle to highlight nodes of the selected goal
        .append("circle")
        .attr("class", "highlight-circle")
        .attr("r", (d) => nodeSize(d) + 3)
        .attr("fill", "none")
        .attr("stroke", (d) => {
          return isSelectedGoal(d) ? props.nodeColor(d) : null;
        })
        .attr("stroke-width", 1.5)
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
  if (props.shouldJiggle) {
    jiggle();
  }
}
