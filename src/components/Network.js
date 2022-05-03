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

  const height = document.getElementById("network").offsetHeight;
  const width = document.getElementById("network").offsetWidth;

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

  // For some reason the svg height adds seven on each rerender (i.e. the value of height taken from getElementById is too big)
  svg.attr("width", width).attr("height", height - 7);

  const { data, simulation, zoom, zoomTransform, setZoomTransform } =
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
      // Get this node's datum
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
  // When active zooming
  zoom.on("zoom", function (e) {
    const t = e.transform;
    setZoomTransform(t);
  });

  // Attach zoom handler to svg
  svg.call(zoom);
  // End of zoom

  render();
}