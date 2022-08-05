import * as d3 from "d3";

export default function Network(el, props) {
  const height = document.getElementById("network").offsetHeight;
  const width = document.getElementById("network").offsetWidth;

  const anchorElement = d3.select(el);

  let canvas = anchorElement.select("canvas");
  // Create canvas if not already created
  if (canvas.empty()) {
    canvas = anchorElement.append("canvas");
  }
  canvas
    .attr("width", width)
    .attr("height", height)
    .attr("class", "network-canvas")
    .attr("id", "network-canvas");

  // Create svg if not already created
  let svg = anchorElement.select("svg");
  if (svg.empty()) {
    svg = anchorElement.append("svg");
    svg.append("g");
  }
  svg
    .attr("width", width)
    .attr("height", height)
    .attr("class", "network-svg");

  const g = svg.select("g");
  g.selectAll("*").remove();

  const {
    data,
    simulation,
    zoom,
    zoomTransform,
    setZoomTransform,
    selectedCategories,
    selectedThemes,
    selectedPolicyPlans,
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

  const policyPlanSet = selectedPolicyPlans && selectedPolicyPlans.length !== 0;
  function isSelectedPolicyPlan(node) {
    if (!policyPlanSet) {
      return false;
    }
    return selectedPolicyPlans.indexOf(node.color) !== -1;
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
    props.selectedThemesConnectedLinks.length !== 0
  ) {
    // Get one array from the array of arrays
    linksToShow = props.selectedThemesConnectedLinks.reduce(
      (acc, curr) => acc.concat(curr),
      []
    );
  }
  // Filter links to show only nodes that are connected to the selected node
  if (props.selectedNode && props.connectedLinks) {
    linksToShow = props.connectedLinks;
  }

  function isConnectedToSelectedThemes(node) {
    if (!props.selectedThemesConnectedNodes) {
      return false;
    }
    // Get one array from the array of arrays
    const ns = props.selectedThemesConnectedNodes.reduce(
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
    for (const [key, value] of Object.entries(node)) {
      if (key === "x" || key === "y") {
        continue;
      }
      if (typeof value === "string" && value.toLowerCase().includes(props.searchText.toLowerCase())) {
        return true;
      }
    }
  }

  function isLeadOfSelected(node) {
    if (!props.selectedNode) {
      return false;
    }
    return (
      node.id === props.selectedNode.Lead_person ||
      node.id === props.selectedNode.Lead_org
    );
  }

  function onOverlayClick(event) {
    props.onClick(null);
  }

  // add an overlay on top of everything to take the mouse events
  g.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "#f00")
    .style("opacity", 0)
    .on("click", onOverlayClick);

  // Join data to group without rendering any svg elements
  const link = g
    .append("g")
    .selectAll(".link")
    .data(linksToShow)
    .join("line")
    .classed("link", true)

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
          if (policyPlanSet) {
            return isSelectedPolicyPlan(d) ? d.color : "lightgray";
          }
          if (themeSet) {
            return isConnectedToSelectedThemes(d) ? d.color : "lightgray";
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
        .style(
          "text-shadow",
          "-1px -1px white, -1px 1px white, 1px 1px white, 1px -1px white, -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white"
        )
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
        // TODO: This checks whether the node is of type "species" by looking at the color. Should be better somehow different
        .attr("font-style", (d) => (d.color === "#F57F17" ? "italic" : null))
        .attr("font-weight", (d) => (isLeadOfSelected(d) ? "bold" : "normal"))
        .attr("dx", (d) => nodeRadiusScale(d.size) + 2)
        .attr("dy", 1)
        .attr("dominant-baseline", "middle")
        .attr("text-decoration", function (d) {
          if (!props.selectedNode) {
            return "none";
          }
          return isSelectedNode(d) ? "underline" : "none";
        })
        .text((d) => (props.language !== "es" ? d.labelEN : d.labelES) || d.id)
    );

  // Add a circle to highlight nodes of the selected themes and the selected node
  node
    .filter((d) => isSelectedNode(d) || isSelectedTheme(d))
    .call((g) =>
      g
        // A circle to highlight the selected node
        .append("circle")
        .attr("class", "highlight-circle")
        .attr("r", (d) => nodeRadiusScale(d.size) + 3)
        .attr("fill", "none")
        .attr("stroke", (d) => d.color)
        .attr("stroke-width", 1.5)
    );

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
      if (!props.isStatic) {
        d.x = width/2;
        d.y = height/2;
        simulation?.alpha(0.1).restart();
      }
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

  /* Simulation related functions */
  function tick() {
    render();
  }

  function addCenterForce(selectionFct, counter) {
    simulation
      .force(
        `y${counter}`,
        d3.forceY(height / 2).strength((d) => (selectionFct(d) ? 1 : 0))
      )
      .force(
        `x${counter}`,
        d3.forceX(width / 2).strength((d) => (selectionFct(d) ? 1 : 0))
      );
  }

  function centerForce(addCondition, selectionFct, counter) {
    if (addCondition) {
      addCenterForce(selectionFct, counter);
    } else {
      simulation.force(`y${counter}`, null).force(`x${counter}`, null);
    }
  }

  // Only apply the simulation at all if the flag for it is set
  if (props.isStatic) {
    simulation.stop();
  } else {
    simulation
      .force("center", d3.forceCenter(width / 2, height / 2).strength(1))
      .tick(5)
      .on("tick", tick);
    
    if (props.selectedNode) {
      simulation.force(
        "radial",
        d3
        .forceRadial(20, props.selectedNode.x, props.selectedNode.y)
        .strength((d) => (isConnectedToSelectedNode(d) ? 1 : 0))
      );
    } else {
      simulation.force("radial", null);
    }
  
    centerForce(
      isSelectedTheme && selectedThemes.length >= 1,
      isConnectedToSelectedThemes,
      "themes"
    );
    centerForce(
      selectedCategories && selectedCategories.length !== 0,
      isSelectedCategory,
      "categories"
    );
    centerForce(
      selectedPolicyPlans && selectedPolicyPlans.length !== 0,
      isSelectedPolicyPlan,
      "policy-plan"
    );
    centerForce(
      isSearching,
      isSearchedFor,
      "search"
    );
          
    if (props.resimulate) {
      simulation.alpha(0.1).restart();
    }
  }
          
  function render() {
    // Draw links on canvas
    if (canvas) {
      const context = canvas.node().getContext("2d");
      context.save();
      context.clearRect(0, 0, width, height);
      context.translate(zoomTransform.x, zoomTransform.y);
      context.scale(zoomTransform.k, zoomTransform.k);
      link.each((d, i, nodes) => {
        context.lineWidth = d.weight * 2;
        context.globalAlpha = 0.6;
        if (themeSet) {
          context.strokeStyle = isSelectedTheme(d) ? d.color : "lightgray";
        } else if (!props.selectedNode) {
          context.strokeStyle = "lightgray";
        } else if (categorySet) {
          context.strokeStyle = isSelectedCategory(d) ? d.color : "lightgray";
        } else if (policyPlanSet) {
          // TODO: this does not look right
          context.strokeStyle = isSelectedPolicyPlan(d) ? d.color : "lightgray";
        } else {
          context.strokeStyle = d.color;
        }
        if (d.weight === 0.5) {
          context.setLineDash([5, 5]);
        } else {
          context.setLineDash([]);
        }
        context.beginPath();
        context.moveTo(d.source.x, d.source.y);
        context.lineTo(d.target.x, d.target.y);
        context.stroke();
      });
      context.restore();
    }
    // Draw nodes to svg
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
  canvas.call(zoom);
  // End of zoom

  render();
}