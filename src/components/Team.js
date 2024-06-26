import React from "react";
import Grid from "@material-ui/core/Grid";
import { useTranslation, Trans } from "react-i18next";

import daniel from "../assets/icons/team/Daniel.png";
import johannes from "../assets/icons/team/Johannes.png";
import gndp from "../assets/icons/team/GNDP.png";
import gct from "../assets/icons/team/GCT.png";
import sophia from "../assets/icons/team/Sophia.png";

import alejandra from "../assets/icons/team/interns/Alejandra.png";
import mateo from "../assets/icons/team/interns/Mateo.png";
import pablo from "../assets/icons/team/interns/Pablo.png";
import rebeca from "../assets/icons/team/interns/Rebeca.png";
import zuley from "../assets/icons/team/interns/Zuley.png";
import olivia from "../assets/icons/team/interns/Olivia.png";


const Person = ({ noLink, name, affiliation, href, src, xs, sm }) => (
  <Grid item xs={xs} sm={sm}>
    <div>
      <section>
        <p>
          {name}
          {affiliation ? <>
            <br />({affiliation})
          </> : null}
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
          xs={4}
          sm={2}
        />
        <Person
          name="Daniel Proaño"
          affiliation="FUNCAVID"
          href={"http://www.funcavid.org"}
          src={daniel}
          xs={4}
          sm={2}
        />
        <Person
          name={t("gnpd")}
          affiliation={t("gnpdAff")}
          href={
            "http://areasprotegidas.ambiente.gob.ec/en/areas-protegidas/galapagos-national-park"
          }
          src={gndp}
          xs={4}
          sm={2}
        />
        <Person
          name={t("gct")}
          affiliation={t("gctAff")}
          href={"https://galapagosconservation.org.uk/"}
          src={gct}
          xs={4}
          sm={2}
        />
        <Person
          name="Dr. Johannes Klein"
          affiliation={t("johannesAff")}
          noLink
          src={johannes}
          xs={4}
          sm={2}
        />
      </Grid>
      <p>{t("thanksToTeam")}</p>
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="flex-end"
        spacing={2}
      >
        <Person name="Alejandra Ayala" noLink src={alejandra} xs={6} sm={2} />
        <Person name="Olivia Estes" noLink src={olivia} xs={6} sm={2} />
        <Person name="Zuley Leon" noLink src={zuley} xs={6} sm={2} />
        <Person name="Pablo Llerena" noLink src={pablo} xs={6} sm={2} />
        <Person name="Mateo Zaldumbide" noLink src={mateo} xs={6} sm={2} />
        <Person name="Rebeca Zúñiga" src={rebeca} noLink xs={6} sm={2} />
      </Grid>
      <p>
        <Trans i18nKey="contactText">
          The development of this tool is linked to the
          <a href="https://www.co-galapagos.org">Co-Galapagos</a> initiative
          which seeks to promote collaboration, cooperation & coordination to
          achieve the 2030 SDG Agenda in Galápagos
        </Trans>
      </p>
      <p>
        <Trans i18nKey="contactChannels">
          Contact us on
          <a href="mailto:uncambioxlavida@gmail.com">uncambioxlavida@gmail.com</a>.
        </Trans>
      </p>
      <p>
        <Trans i18nKey="contactAdditions">
          Translated text
          <a href="https://www.cognitoforms.com/CoGalapagos/RedDeProyectosDeGalapagos">
            here
          </a>
          .
        </Trans>
      </p>
    </div>
  );
}

export default Team;
