import React from "react";
import Grid from "@material-ui/core/Grid";
import { useTranslation, Trans } from "react-i18next";

import daniel from "../assets/icons/team/Daniel.png";
import johannes from "../assets/icons/team/Johannes.png";
import gndp from "../assets/icons/team/GNDP.png";
import gct from "../assets/icons/team/GCT.png";
import sophia from "../assets/icons/team/Sophia.png";

const Person = ({ noLink, name, affiliation, href, src }) => (
  <Grid item xs={4} sm={2}>
    <div>
      <section>
        <p>
          {name}
          <br />({affiliation})
        </p>
      </section>
      <div>
        {noLink ? (
          <img style={{ width: "100%", maxWidth: "200px" }} src={src} alt="" />
        ) : (
          <a href={href} rel="noopener noreferrer" target="_blank">
            <img
              className="clickable"
              style={{ width: "100%", maxWidth: "200px" }}
              src={src}
              alt=""
            />
          </a>
        )}
      </div>
    </div>
  </Grid>
);

function Team() {
  const { t } = useTranslation();
  return (
    <div>
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="flex-end"
        spacing={2}
      >
        <Person
          name={t("sophia")}
          affiliation={t("sophiaAff")}
          href={"https://www.sophiacooke.com"}
          src={sophia}
        />
        <Person
          name="Daniel Proaño"
          affiliation="FUNCAVID"
          href={"http://www.funcavid.org"}
          src={daniel}
        />
        <Person name={t("gnpd")} affiliation={t("gnpdAff")} noLink src={gndp} />
        <Person name={t("gct")} affiliation={t("gctAff")} noLink src={gct} />
        <Person
          name="Dr. Johannes Klein"
          affiliation={t("johannesAff")}
          noLink
          src={johannes}
        />
      </Grid>
      <p>
        <Trans i18nKey="contactChannels">
          Contact us on
          <a href="mailto:info@co-galapagos.org">info@co-galapagos.org</a>.
        </Trans>
      </p>
      <p>
        <Trans i18nKey="contactText">
          Contact us on
          <a href="https://www.co-galapagos.org">info@co-galapagos.org</a>.
        </Trans>
      </p>
    </div>
  );
}

function Team2() {
  return <div>Details about the team</div>;
}

export default Team2;
