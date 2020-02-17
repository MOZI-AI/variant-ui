import React, { useEffect, useState, Fragment } from "react";
import { Table, Skeleton, message } from "antd";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "../../components/header";
import Verdict from "../../components/verdict";

const InterVarClassOrder = {
  pathogenic: 5,
  "likely pathogenic": 4,
  "uncertain significance": 3,
  "likely benign": 2,
  benign: 1
};

const GeneViewerColumns = [
  {
    title: "Variant",
    dataIndex: "variant",
    key: "variant"
  },
  {
    title: "HGVS nomination",
    dataIndex: "HGVS",
    key: "HGVS"
  },
  {
    title: "rsID",
    dataIndex: "rsID",
    key: "rsID"
  },
  {
    title: "InterVar.class",
    dataIndex: "interVar",
    key: "interVar",
    sorter: (a, b) =>
      InterVarClassOrder[a.acmg.verdict.toLowerCase()] -
      InterVarClassOrder[b.acmg.verdict.toLowerCase()],
    sortDirections: ["descend"]
  },
  {
    title: "ExonicFunc",
    dataIndex: "exonic",
    key: "exonic"
  },
  {
    title: "Disease name",
    dataIndex: "disease",
    key: "disease"
  },
  {
    title: "Phenotype",
    dataIndex: "phenotype",
    key: "phenotype"
  },
  {
    title: "Disease in OrhpaNet",
    dataIndex: "orphanet",
    key: "orphanet"
  },
  {
    title: "OMIM",
    dataIndex: "omim",
    key: "omim"
  },
  {
    title: "Phenotype_MIM",
    dataIndex: "Phenotype_MIM",
    key: "Phenotype_MIM"
  },
  {
    title: "ExAc.AF (AC/AN, population)",
    dataIndex: "exac",
    key: "exac"
  },
  {
    title: "Polyphen2.Conservation",
    dataIndex: "polyphen",
    key: "polyphen"
  },
  {
    title: "Polyphen.Score",
    dataIndex: "score",
    key: "score"
  }
];

const GeneViewer = props => {
  const { id } = useParams();
  const [fetching, setFetching] = useState(false);
  const [matchingIDs, setMatchingIDs] = useState([]);
  const [result, setResult] = useState(undefined);

  const constructURL = t => {
    // Gene symbol
    if (/^[a-zA-Z0-9]+$/.test(t)) {
      return `/annotate/gene/${t.toUpperCase()}`;
    }
    // Entrez id
    if (/^[1-9]\d*$/.test(t)) {
      return `/annotate/gene/entrez/${t}`;
    }
    // Gene id
    if (/^ENSG/.test(t)) {
      return `/annotate/gene/id/${t.toUpperCase()}`;
    }
  };

  useEffect(() => {
    setFetching(true);
    axios
      .get(constructURL(id.trim()))
      .then(function(response) {
        setResult(response.data);
      })
      .catch(function(error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.includes("following ids")
        ) {
          const IDs = error.response.data
            .substring(error.response.data.indexOf(":") + 1)
            .trim()
            .split(",");
          setMatchingIDs(IDs);
        } else {
          message.error(error.response ? error.response.data : error.message);
        }
      })
      .finally(function() {
        setFetching(false);
      });
  }, [id]);

  return (
    <>
      <Header />
      <div className="content-wrapper">
        {fetching ? (
          <>
            <Skeleton active />
          </>
        ) : result ? (
          <>
            <h2>Variants for {id}</h2>
            <Table
              pagination={{ pageSize: 3 }}
              columns={GeneViewerColumns}
              dataSource={result.variants.map((v, j) => ({
                key: `variant${j}`,
                variant: (
                  <Link
                    to={`/variant/${v.hgvs}`}
                  >{`${v.chrom}:${v.pos}:${v.ref}/${v.alt}`}</Link>
                ),
                HGVS: v.effect ? v.effect.hgvsNomination : "-",
                rsID: v.id || "-",
                interVar: <Verdict verdict={v.acmg.verdict} />,
                exonic: v.acmg.exonicFunction,
                disease: v.acmg.diseaseInfos
                  ? v.acmg.diseaseInfos.map(d => d.diseaseName).join(" , ")
                  : "-",
                phenotype: "?",
                orphanet: v.acmg.diseaseInfos
                  ? v.acmg.diseaseInfos.map(d => d.diseaseId).join(" , ")
                  : "-",
                omim: v.acmg.diseaseInfos ? (
                  <>
                    {v.acmg.diseaseInfos
                      .reduce((a, d) => [...a, ...d.omimIds], [])
                      .map((o, i) => (
                        <Fragment key={`omim${i}`}>
                          <a
                            target="_blank"
                            href={`https://omim.org/entry/${o}`}
                          >
                            {o}
                          </a>{" "}
                          ,{" "}
                        </Fragment>
                      ))}{" "}
                  </>
                ) : (
                  "-"
                ),
                Phenotype_MIM: "?",
                exac: "?",
                polyphen: "?",
                score: "?"
              }))}
            />
          </>
        ) : matchingIDs.length ? (
          <>
            <h3>
              Found more than one gene for symbol PAH with the following ids:
            </h3>
            <ul>
              {matchingIDs.map((g, i) => (
                <li key={`gene${i}`}>
                  <Link replace to={`/gene/${g}`}>
                    {g}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <h2>Start by seaching for a gene or a variant</h2>
        )}
      </div>
    </>
  );
};

export default GeneViewer;
