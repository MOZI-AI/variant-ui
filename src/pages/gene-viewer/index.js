import React, { useEffect, useState } from "react";
import { Table, Alert, Skeleton } from "antd";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "../../components/header";

const GeneAnnotationColumns = [
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
    key: "interVar"
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

const GeneAnnotation = props => {
  const { id } = useParams();
  const [fetching, setFetching] = useState(false);
  const [matchingIDs, setMatchingIDs] = useState([]);
  const [result, setResult] = useState(undefined);

  const constructURL = t => {
    // Gene symbol
    if (/^[a-zA-Z]+$/.test(t)) {
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
        // handle success
        console.log(response.data);
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
            <Table
              columns={GeneAnnotationColumns}
              dataSource={result.variants.map(v => ({
                variant: (
                  <Link
                    to={`/variant/${v.hgvs}`}
                    replace
                  >{`${v.chrom}:${v.pos}:${v.ref}/${v.alt}`}</Link>
                ),
                HGVS: v.hgvs,
                rsID: v.id,
                interVar: v.acmg.verdict,
                exonic: v.acmg.exonicFunction,
                disease: v.acmg.diseaseInfos
                  ? v.acmg.diseaseInfos.map(d => d.diseaseName).join(" , ")
                  : "-",
                phenotype: "?",
                orphanet: "?",
                omim: "?",
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
              {matchingIDs.map(i => (
                <li>
                  <Link replace to={`/gene/${i}`}>
                    {i}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <Alert message="Other error" description="try again" />
          </>
        )}
      </div>
    </>
  );
};

export default GeneAnnotation;
