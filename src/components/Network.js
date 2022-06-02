import * as d3 from "d3";

const linkWidth = 1;

export default function Network(el, props) {
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

  const {
    data,
    simulation,
    zoom,
    zoomTransform,
    setZoomTransform,
    selectedCategories,
    selectedThemes,
  } = props;

  // Create a node radius range with linear scale from data min and max
  const nodeRadiusScale = d3
    .scaleLinear()
    .domain([0, d3.max(data.nodes, (d) => d.size)])
    .range([0, 12]);

  const smallestRadius = () =>
    d3.min(data.nodes, (d) => nodeRadiusScale(d.size));

  const categorySet = selectedCategories && selectedCategories.length !== 0;
  function isSelectedCategory(node) {
    if (!categorySet) {
      return false;
    }
    return selectedCategories.indexOf(node.color) !== -1;
  }

  const themeSet = selectedThemes && selectedThemes.length !== 0;
  function isSelectedTheme(node) {
    if (!themeSet) {
      return false;
    }
    return selectedThemes.indexOf(node.color) !== -1;
  }

  let linksToShow = data.links;
  // Filter links to show only links that are connected to selected themes
  if (
    props.selectedThemes.length !== 0 &&
    props.selectedThemeNodesConnectedLinks.length !== 0
  ) {
    // Get one array from the array of arrays
    linksToShow = props.selectedThemeNodesConnectedLinks.reduce(
      (acc, curr) => acc.concat(curr),
      []
    );
  }
  // Filter links to show only nodes that are connected to the selected node
  if (props.selectedNode && props.connectedLinks) {
    linksToShow = props.connectedLinks;
  }

  function isSelectedThemeNode(node) {
    if (!props.selectedThemeNodes) {
      return false;
    }
    const selectedThemeIDs = props.selectedThemeNodes.map((n) => n.id);
    return selectedThemeIDs.includes(node.id);
  }

  function isConnectedToSelectedThemes(node) {
    if (!props.selectedThemeNodes || !props.selectedThemeNodesConnectedNodes) {
      return false;
    }
    // Get one array from the array of arrays
    const ns = props.selectedThemeNodesConnectedNodes.reduce(
      (acc, curr) => acc.concat(curr),
      []
    );
    const connectedIDs = ns.map((n) => n.id);
    return connectedIDs.includes(node.id);
  }

  function isSelectedNode(node) {
    if (!props.selectedNode) {
      return false;
    }
    return node.id === props.selectedNode.id;
  }

  function isConnectedToSelectedNode(node) {
    if (!props.selectedNode || !props.connectedNodes) {
      return false;
    }
    const connectedIDs = props.connectedNodes.map((n) => n.id);
    return connectedIDs.includes(node.id);
  }

  const selectable = (node) => {
    // if there is no node selected then all nodes are selectable
    if (!props.selectedNode) {
      return true;
    }
    return isSelectedNode(node) || isConnectedToSelectedNode(node);
  };

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
    .data(linksToShow)
    .join("line")
    .classed("link", true)
    .attr("opacity", 0.6)
    .attr("stroke", function (d) {
      if (themeSet) {
        return isSelectedTheme(d) ? d.color : "lightgray";
      }
      // If there is no node selected, all links are grey
      if (!props.selectedNode) {
        return "lightgray";
      }
      if (categorySet) {
        return isSelectedCategory(d) ? d.color : "lightgray";
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
    .attr("cursor", "default")
    .attr("opacity", function (d) {
      if (props.selectedNode) {
        return isConnectedToSelectedNode(d) || isSelectedNode(d) ? 1 : 0.3;
      }
      if (isSearching) {
        return isSearchedFor(d) ? 1 : 0.3;
      }
      return 1;
    })
    .call((g) =>
      g
        .append("circle")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .attr("r", (d) => nodeRadiusScale(d.size))
        .attr("fill", function (d) {
          if (categorySet) {
            return isSelectedCategory(d) ? d.color : "lightgray";
          }
          if (themeSet) {
            return isConnectedToSelectedThemes(d) || isSelectedThemeNode(d)
              ? d.color
              : "lightgray";
          }
          if (props.selectedNode) {
            return isConnectedToSelectedNode(d) || isSelectedNode(d)
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
            return isConnectedToSelectedNode(d) || isSelectedNode(d)
              ? "#000"
              : "lightgray";
          }
          if (isSearching) {
            return isSearchedFor(d) ? "#000" : "lightgray";
          }
          return "#000";
        })
        .attr("font-size", (d) => smallestRadius() * 1.5)
        .attr("dx", (d) => nodeRadiusScale(d.size) + 2)
        .attr("dy", 1)
        .attr("dominant-baseline", "middle")
        .attr("text-decoration", function (d) {
          if (!props.selectedNode) {
            return "none";
          }
          return isSelectedNode(d) ? "underline" : "none";
        })
        .text((d) => d.id)
    );
    // .call((g) =>
    //   g
    //     // A circle to highlight the selected node
    //     // TODO: this is pretty inefficient because it adds nodes' size worth of amount of extra invisible circles
    //     .append("circle")
    //     .attr("class", "highlight-circle")
    //     .attr("r", (d) => nodeRadius + 3)
    //     .attr("fill", "none")
    //     .attr("stroke", (d) => {
    //       return isSelectedNode(d) || isSelectedTheme(d) ? d.color : null;
    //     })
    //     .attr("stroke-width", 1.5)
    // )

  node
    .filter((d) => selectable(d))
    .attr("cursor", "pointer")
    .on("mousedown", function (event) {
      const d = d3.select(this);
      d.attr("cursor", "move");
    })
    .on("pointerup", function (event) {
      const d = d3.select(this);
      d.attr("cursor", "pointer");
    })
    .on("click", function (event, d) {
      if (event.defaultPrevented) return; // if panning or dragged
      // Get this node's datum
      const datum = d3.select(this).datum();
      props.onClick(datum);
    })
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