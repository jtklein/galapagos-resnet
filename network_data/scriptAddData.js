let data = require('./RI.json');
const projectsInfo = require("./additional/MAIN");
const organizationsInfo = require("./additional/ORGS FULL");
const speciesInfo = require("./additional/SPECIES FULL");
const plansInfo = require("./additional/plans_info");
const sdgInfo = require("./additional/SDG_INFO");
const fs = require("fs");

// Get sets of the values used as node IDs
const nicknamesESSet = new Set(projectsInfo.map((d) => d.Nickname_ES));
const orgCodeSet = new Set(organizationsInfo.map((d) => d.Org));
const scientificNameSet = new Set(speciesInfo.map((d) => d["Scientific name"]));
const aimSet = new Set(plansInfo.map((d) => d.Aim));
const sdgSet = new Set(sdgInfo.map((d) => d.code));

// Map through the data to add the additional info to the node
data.nodes = data.nodes.map(node => {
  if (nicknamesESSet.has(node.id)) {
    node.type = "project";
    const additionalInfo = projectsInfo.find(d => d.Nickname_ES === node.id);
    // Only take what we actually need to display
    Object.assign(node, {
      Permits: additionalInfo.Permits,
      Leader: additionalInfo.Leader,
      Lead_org: additionalInfo.Lead_org,
      Title_ES: additionalInfo.Title_ES,
      Title_EN: additionalInfo.Title_EN,
      // Use nickname fields as node labels
      labelES: additionalInfo.Nickname_ES,
      labelEN: additionalInfo.Nickname_EN,
      Summary_ES: additionalInfo.Summary_ES,
      Summary_EN: additionalInfo.Summary_EN,
      Link: additionalInfo.Link,
    });
  }
  if (orgCodeSet.has(node.id)) {
    node.type = "organization";
    const additionalInfo = organizationsInfo.find((d) => d.Org === node.id);
    Object.assign(node, {
      Org: additionalInfo.Org,
      "Spanish name": additionalInfo["Spanish name"],
      "English name": additionalInfo["English name"],
      Country: additionalInfo.Country,
      Pais: additionalInfo.Pais,
      Website: additionalInfo.Website,
    });
  }
  if (scientificNameSet.has(node.id)) {
    node.type = "species";
    const additionalInfo = speciesInfo.find(d => d["Scientific name"] === node.id);
    Object.assign(node, {
      Scientific_name: additionalInfo["Scientific name"],
      CommonName_ES: additionalInfo.CommonName_ES,
      CommonName_EN: additionalInfo.CommonName_EN,
      Link: additionalInfo.Link,
    });
  }
  if (aimSet.has(node.id)) {
    node.type = "plan";
    const additionalInfo = plansInfo.find(d => d.Aim === node.id);
    Object.assign(node, {
      Aim: additionalInfo.Aim,
      Title_EN: additionalInfo.Title_EN,
      Title_ES: additionalInfo.Title_ES,
      Plan_EN: additionalInfo.Plan_EN,
      Plan_ES: additionalInfo.Plan_ES,
      "Plan link": additionalInfo["Plan link"],
    });
  }
  if (sdgSet.has(node.id)) {
    node.type = "goal";
    const additionalInfo = sdgInfo.find(d => d.code === node.id);
    Object.assign(node, {
      Title_EN: additionalInfo.nodeTitleEN,
      Title_ES: additionalInfo.nodeTitleES,
    });
  }
  return node;
})

data = JSON.stringify(data, null, 2);
fs.writeFileSync(`./network_data/data.json`, data);
