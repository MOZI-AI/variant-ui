import React, { useRef, useEffect } from "react";
import axios from "axios";
const igv = require("igv");

const Visualizer = ({ chromosome, position }) => {
  const visualizerWrapper = useRef();

  useEffect(() => {
    var options = {
      genome: "hg19",
      locus: `chr${chromosome}:${position - 10}-${position + 10}`,
      tracks: []
    };

    axios
      .get(
        `/annotate/variant/range/?q=chr${chromosome}:${position -
          10}-${position + 10}&limit=10`
      )
      .then(function({ data }) {
        const snpFeatures = data.map(d => ({
          id: d.hgvs,
          label: d.hgvs,
          chr: d.chrom,
          start: d.pos - 1,
          end: d.pos - 1,
          name: d.hgvs,
          bioType: d.bioType,
          acmg: d.acmg.verdict
        }));

        options.tracks.push({
          name: "Annotation",
          type: "annotation",
          displayMode: "EXPANDED",
          autoHeight: true,
          visibilityWindow: 500000,
          features: snpFeatures
        });

        igv
          .createBrowser(visualizerWrapper.current, options)
          .then(function(browser) {
            console.log("Created IGV browser");
          });
      });
  }, []);

  return <div ref={visualizerWrapper}></div>;
};

export default Visualizer;
