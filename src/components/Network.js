import * as d3 from "d3";

const nodeRadius = 8;
const linkWidth = 1;

export default function Network(el, props) {
  const themeSet = props.selectedThemes && props.selectedThemes.length !== 0;
  function isSelectedTheme(node) {
    if (!themeSet) {
      return false;
    }
    return props.selectedThemes.indexOf(node.color) !== -1;
  }

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

  const { data, simulation, ancZoom, zoom, zoomTransform, setZoomTransform } =
    props;

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

  const isSearching = !!props.searchText && props.searchText.length > 0;

  function isSearchedFor(node) {
    if (!props.searchText) {
      return false;
    }
    return node.id.toLowerCase().includes(props.searchText.toLowerCase());
  }

  const link = g
    .append("g")
    .selectAll(".link")
    .data(linksOfSelectedNode)
    .join("line")
    .classed("link", true)
    .attr("opacity", 0.6)
    .attr("stroke", function (d) {
      // If there is no node selected, all links are grey
      if (!props.selectedNode) {
        return "lightgray";
      }
      if (themeSet) {
        return isSelectedTheme(d) ? d.color : "lightgray";
      }
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
      if (props.selectedNode) {
        return isConnectedNode(d) || isSelectedNode(d) ? 1 : 0.3;
      }
      if (isSearching) {
        return isSearchedFor(d) ? 1 : 0.3;
      }
      return 1;
    })
    .on("click", function (event, d) {
      if (event.defaultPrevented) return; // if panning or dragged
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
          if (themeSet) {
            return isSelectedTheme(d) ? d.color : "lightgray";
          }
          if (props.selectedNode) {
            return isConnectedNode(d) || isSelectedNode(d)
              ? d.color
              : "lightgray";
          }
          if (isSearching) {
            return isSearchedFor(d) ? d.color : "lightgray";
          }
          return d.color;
        })
    )
    // TODO: Place a call iterating over these after the first round of mapping, so that the labels are alwys above other nodes
    .call((g) =>
      g
        .append("text")
        .attr("fill", function (d) {
          if (props.selectedNode) {
            return isConnectedNode(d) || isSelectedNode(d)
              ? "#000"
              : "lightgray";
          }
          if (isSearching) {
            return isSearchedFor(d) ? "#000" : "lightgray";
          }
          return "#000";
        })
        .attr("dx", nodeRadius + 2)
        .attr("dy", nodeRadius / 2)
        .attr("font-size", nodeRadius * 1.5)
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
          return isSelectedNode(d) || isSelectedTheme(d) ? d.color : null;
        })
        .attr("stroke-width", 1.5)
    )
    .call(
      d3
        .drag()
        .on("drag", (event, d) => {
          // Update node position
          d.x = event.x;
          d.y = event.y;
        })
        .on("start.update drag.update end.update", render)
    );

  simulation
    .force("center", d3.forceCenter(width / 2, height / 2))
    .tick(25)
    .on("tick", tick);

  function tick() {
    render();
  }

  function render() {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
    node.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
    g.attr("transform", zoomTransform);
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

  // set up the ancillary zoom and an accessor for the transform
  ancZoom
    .extent([[0, 0],[width, height]])
    .scaleExtent([1, 8]);
  const ancT = () => d3.zoomTransform(g.node());

  // active zooming
  zoom.on("zoom", function (e) {
    const t = e.transform;
    const k = t.k / zoomTransform.k;
    const point = center(e, this);
    if (k === 1) {
      // pure translation?
      g.call(ancZoom.translateBy, (t.x - zoomTransform.x) / ancT().k, 0);
    } else {
      // if not, we're zooming on a fixed point
      g.call(ancZoom.scaleBy, k, point);
    }
    setZoomTransform(t);
  });

  svg.call(zoom);
  // End of zoom

  render();
}