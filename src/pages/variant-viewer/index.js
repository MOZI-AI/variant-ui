import React, { useState, useEffect } from "react";
import {
  Skeleton,
  Statistic,
  Row,
  Col,
  Table,
  Alert,
  Tag,
  Tabs,
  message,
  Typography,
  Tooltip
} from "antd";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Header from "../../components/header";
import Visualizer from "../../components/visualizer";
import Verdict from "../../components/verdict";

const FUNCTIONAL_PREDICTION = [
  {
    title: "Tool",
    dataIndex: "tool",
    key: "tool"
  },
  {
    title: "Score",
    dataIndex: "score",
    key: "score"
  },
  {
    title: "Prediction",
    dataIndex: "prediction",
    key: "prediction"
  }
];

const POPULATION_FREQUENCY = [
  {
    title: "Population",
    dataIndex: "population",
    key: "population"
  },
  {
    title: "HomAlt",
    dataIndex: "homAlt",
    key: "homAlt",
    render: count => (count < 0 ? "N/A" : count)
  },
  {
    title: "AF",
    dataIndex: "af",
    key: "af",
    render: count => (count < 0 ? "N/A" : count)
  },
  {
    title: "AC",
    dataIndex: "ac",
    key: "ac",
    render: count => (count < 0 ? "N/A" : count)
  },
  {
    title: "AN",
    dataIndex: "an",
    key: "an",
    render: count => (count < 0 ? "N/A" : count)
  }
];

const TRANSCRIPT = [
  {
    title: "Transcript ID",
    dataIndex: "transcriptId",
    key: "transcriptId"
  },
  {
    title: "Exon",
    dataIndex: "exon",
    key: "exon"
  },
  {
    title: "cdsChange",
    dataIndex: "cdsChange",
    key: "cdsChange"
  },
  {
    title: "Protein change",
    dataIndex: "proteinChange",
    key: "proteinChange"
  }
];

function AnnotationResult({}) {
  const { id } = useParams();
  const [populations, setPopulations] = useState(undefined);
  const [fetching, setFetching] = useState(false);
  const [matchingIDs, setMatchingIDs] = useState([]);
  const [result, setResult] = useState(undefined);

  const constructURL = t => {
    // rsID
    if (/^rs[0-9]*$/.test(t)) {
      return `/annotate/variant/${t.toLowerCase()}`;
    }
    // HGVS Id
    else if (
      /(chr)?([\d|XYMTxymt]+):[gG]\.(\d+)([GCTAgcta])?>([GCTAgcta])/.test(t) ||
      /(chr)?([\d|XYMTxymt]+):[gG]\.(\d+)([gctaGCTA])?=/.test(t) ||
      /(chr)?([\d|XYMTxymt]+):[gG]\.(\d+)(?:_(\d+))?([GCTAgcta]+)?delins([GCTAgcta]+)/.test(
        t
      ) ||
      /(chr)?([\d|XYMTxymt]+):[gG]\.(\d+)_(\d+)ins([GCTAgcta]+)/.test(t) ||
      /(chr)?([\d|XYMTxymt]+):[gG]\.(\d+)(?:_(\d+))?del([GCTAgcta]+)?/.test(
        t
      ) ||
      /(chr)?([\d|XYMTxymt]+):[gG]\.(\d+)_(\d+)ins(\d+)_(\d+)inv/.test(t)
    ) {
      return `/annotate/variant/?hgvs=${t}`;
    } else {
      return `/annotate/variant/?hgvs=${t}`;
    }
  };

  useEffect(() => {
    setFetching(true);
    setResult(undefined);
    axios
      .get(constructURL(id.trim()))
      .then(function(response) {
        // handle success
        console.log("result", response.data);
        setResult(response.data);
      })
      .catch(function(error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.includes("More than one")
        ) {
          const IDs = error.response.data
            .substring(
              error.response.data.indexOf("[") + 1,
              error.response.data.indexOf("]")
            )
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

  useEffect(() => {
    if (result && !populations) {
      const rows = [];
      Object.keys(result.population).map(p => {
        Object.keys(result.population[p]).map(d => {
          if (result.population[p][d]) {
            rows.push({
              key: `${p}${d}`,
              population: p,
              database: d,
              ...result.population[p][d]
            });
          }
        });
      });
      setPopulations(rows);
    }
  });

  const navigateToSection = tab => {
    const section = document.getElementById(tab);
    var sectionOffset = section.offsetTop;
    window.scrollTo(0, sectionOffset - 120);
  };

  const renderSummary = () => (
    <div className="result-section" id="summary">
      <div className="section-header">
        <h2>Summary</h2>
      </div>
      <div className="content">
        <Visualizer chromosome={result.chrom} position={result.pos} />
        <table>
          <tbody>
            <tr>
              <td>GRCh37/hg19 position</td>
              <td>{`${result.chrom}:${result.pos}`}</td>
            </tr>
            <tr>
              <td>Allele (ref/alt)</td>
              <td>{`${result.ref}/${result.alt}`}</td>
            </tr>
            <tr>
              <td>rsID</td>
              <td>{result.id}</td>
            </tr>
            <tr>
              <td>Gene symbol</td>
              <td>{result.gene}</td>
            </tr>
            <tr>
              <td>Type</td>
              <td>{result.bioType ? result.bioType : "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderACMGclassification = () => (
    <div className="result-section" id="acmg">
      <div className="section-header">
        <h2>ACMG Classification</h2>
      </div>
      <div className="content">
        <div className="sub-section">
          <h3>Variant annotation</h3>
          <Row>
            <Col md={12}>
              <Alert
                style={{ marginBottom: 30 }}
                message={
                  <Row>
                    <Col md={12}>
                      <Typography.Paragraph type="secondary">
                        Class
                      </Typography.Paragraph>

                      {result.acmg ? (
                        <Verdict size="large" verdict={result.acmg.verdict} />
                      ) : (
                        "-"
                      )}
                    </Col>
                    <Col md={12}>
                      <Statistic
                        title="ExonicFunc"
                        value={result.acmg ? result.exonicFunction : "-"}
                      />
                    </Col>
                  </Row>
                }
              />
            </Col>
          </Row>
          <table>
            <thead>
              <tr>
                <th>Disease name</th>
                <th>Disease in OrphaNet</th>
                <th>OMIM</th>
              </tr>
            </thead>
            <tbody>
              {result.acmg.diseaseInfos.map((d, i) => (
                <tr key={`dinfo${i}`}>
                  <td>{d.diseaseName}</td>
                  <td>{d.diseaseId}</td>
                  <td>
                    {d.omimIds.map(o => (
                      <a
                        style={{ display: "block" }}
                        target="_blank"
                        key={o}
                        href={`https://omim.org/entry/${o}`}
                      >
                        {o}
                      </a>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="sub-section">
          <h3>Rules in details</h3>
          <table>
            <thead>
              <tr>
                <th rowSpan={2}></th>
                <th colSpan={2}>Benin</th>
                <th colSpan={4}>Pathogenic</th>
              </tr>
              <tr>
                <th>Strong</th>
                <th>Supporting</th>
                <th>Supporting</th>
                <th>Moderate</th>
                <th>Strong</th>
                <th>Very strong</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Population data</td>
                <td>
                  {result.acmg["bs"][0] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="MAF is too high for disorder "
                    >
                      <Tag color="#722ed1">BS1</Tag>
                    </Tooltip>
                  )}
                  {result.acmg["bs"][1] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Observation in controls inconsistent with disease penetrance "
                    >
                      <Tag color="#722ed1">BS2</Tag>{" "}
                    </Tooltip>
                  )}
                  {result.acmg["ba1"] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="MAF is too high for disorder "
                    >
                      <Tag color="#722ed1">BA1</Tag>
                    </Tooltip>
                  )}
                </td>
                <td></td>
                <td></td>
                <td>
                  {result.acmg["pm"][1] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Absent in population databases "
                    >
                      <Tag color="#faad14">PM2</Tag>
                    </Tooltip>
                  )}
                </td>
                <td>
                  {result.acmg["ps"][3] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Prevalence in affecteds statistically increased over controls "
                    >
                      <Tag color="#fa541c">PS4</Tag>
                    </Tooltip>
                  )}
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Computation data</td>
                <td></td>
                <td>
                  {result.acmg["bp"][3] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Multiple lines of computational evidence suggest no impact on gene /gene product "
                    >
                      <Tag color="#2f54eb">BP4</Tag>
                    </Tooltip>
                  )}
                  {result.acmg["bp"][0] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Missense in gene where only truncating cause disease "
                    >
                      <Tag color="#2f54eb">BP1</Tag>
                    </Tooltip>
                  )}
                  {result.acmg["bp"][6] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Silent variant with non predicted splice impact "
                    >
                      <Tag color="#2f54eb">BP7</Tag>
                    </Tooltip>
                  )}
                  {result.acmg["bp"][2] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="In-frame indels in repeat w/out known function "
                    >
                      <Tag color="#2f54eb">BP3</Tag>
                    </Tooltip>
                  )}
                </td>
                <td>
                  {result.acmg["pp"][2] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Multiple lines of computational evidence support a deleterious effect on the gene /gene product "
                    >
                      <Tag color="#52c41a">PP3</Tag>
                    </Tooltip>
                  )}
                </td>
                <td>
                  {result.acmg["pm"][4] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Novel missense change at an amino acid residue where a different pathogenic missense change has been seen before "
                    >
                      <Tag color="#faad14">PM5</Tag>
                    </Tooltip>
                  )}
                  {result.acmg["pm"][3] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Protein length changing variant "
                    >
                      <Tag color="#faad14">PM4</Tag>
                    </Tooltip>
                  )}
                </td>
                <td>
                  {result.acmg["ps"][0] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Same amino acid change as an established pathogenic variant "
                    >
                      <Tag color="#fa541c">PS1</Tag>
                    </Tooltip>
                  )}
                </td>
                <td>
                  {result.acmg["pvs1"] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Predicted null variant in a gene where LOF is a known mechanism of disease "
                    >
                      <Tag color="#f5222d">PSV1</Tag>
                    </Tooltip>
                  )}
                </td>
              </tr>
              <tr>
                <td>Functional data</td>
                <td>
                  {result.acmg["bs"][2] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Well-established functional studies show no deleterious effect "
                    >
                      <Tag color="#722ed1">BS3</Tag>
                    </Tooltip>
                  )}
                </td>
                <td></td>
                <td>
                  {result.acmg["pp"][1] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Missense in gene with low rate of benign missense variants and path. missenses common "
                    >
                      <Tag color="#52c41a">PP2</Tag>
                    </Tooltip>
                  )}
                </td>
                <td>
                  {result.acmg["pm"][0] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Mutational hot spot or well-studied functional domain without benign variation "
                    >
                      <Tag color="#faad14">PM1</Tag>
                    </Tooltip>
                  )}
                </td>
                <td>
                  {result.acmg["ps"][2] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Well-established functional studies show a deleterious effect "
                    >
                      <Tag color="#fa541c">PS3</Tag>
                    </Tooltip>
                  )}
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Segregation data</td>
                <td>
                  {result.acmg["bs"][3] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Nonsegregation with disease "
                    >
                      <Tag color="#722ed1">BS4</Tag>
                    </Tooltip>
                  )}
                </td>
                <td></td>
                <td>
                  {result.acmg["pp"][0] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Cosegregation with disease in multiple affected family members "
                    >
                      <Tag color="#52c41a">PP1</Tag>
                    </Tooltip>
                  )}
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>De novo data</td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  {result.acmg["pm"][5] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="De novo (without paternity & maternity confirmed) "
                    >
                      <Tag color="#faad14">PM6</Tag>
                    </Tooltip>
                  )}
                </td>
                <td>
                  {result.acmg["ps"][1] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="De novo (paternity and maternity confirmed) "
                    >
                      <Tag color="#fa541c">PS2</Tag>
                    </Tooltip>
                  )}
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Allele data</td>
                <td></td>
                <td>
                  {result.acmg["bp"][1] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Observed in trans with a dominant variant BP2 . Observed in cis with a pathogenic variant"
                    >
                      <Tag color="#2f54eb">BP2</Tag>
                    </Tooltip>
                  )}
                </td>
                <td></td>
                <td>
                  {result.acmg["pm"][2] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="For recessive disorders, detected in trans with a pathogenic variant"
                    >
                      <Tag color="#faad14">PM3</Tag>
                    </Tooltip>
                  )}
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Other database</td>
                <td></td>
                <td>
                  {result.acmg["bp"][5] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Reputable source w/out shared data = benign"
                    >
                      <Tag color="#2f54eb">BP6</Tag>
                    </Tooltip>
                  )}
                </td>
                <td>
                  {result.acmg["pp"][4] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Reputable source = pathogenic"
                    >
                      <Tag color="#52c41a">PP5</Tag>
                    </Tooltip>
                  )}
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Other data</td>
                <td></td>
                <td>
                  {result.acmg["bp"][4] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Found in case with an alternate cause"
                    >
                      <Tag color="#2f54eb">BP5</Tag>
                    </Tooltip>
                  )}
                </td>
                <td>
                  {result.acmg["pp"][3] === 1 && (
                    <Tooltip
                      placement="bottom"
                      title="Patient’s phenotype or FH highly specific for gene"
                    >
                      <Tag color="#52c41a">PP4</Tag>
                    </Tooltip>
                  )}
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        {result.clinvar ? (
          <div className="sub-section">
            <h3>Publication IDs</h3>
            {result.clinvar.pumeds
              ? result.clinvar.pumeds.map(p => (
                  <a
                    key={p}
                    href={`https://www.ncbi.nlm.nih.gov/pubmed/?term=${p}`}
                    target="_blank"
                    style={{ marginRight: 30 }}
                  >
                    {p}
                  </a>
                ))
              : null}
          </div>
        ) : null}
      </div>
    </div>
  );

  const renderTranscripts = () => (
    <div className="result-section" id="transcripts">
      <div className="section-header">
        <h2>Transcripts</h2>
      </div>
      <div className="content">
        <div className="sub-section">
          <h3>RefSeq Transcripts</h3>
          <Row>
            <Col md={12}>
              <Table
                size="middle"
                bordered={true}
                pagination={false}
                columns={TRANSCRIPT}
                dataSource={result.refSeqTranscripts.map((t, i) => ({
                  key: `ref_transcript${i}`,
                  ...t,
                  transcriptId: (
                    <a
                      target="_blank"
                      href={`https://www.ncbi.nlm.nih.gov/nuccore/${t.transcriptId}`}
                    >
                      {t.transcriptId}
                    </a>
                  )
                }))}
              />
            </Col>
          </Row>
        </div>
        <div className="sub-section">
          <h3>Ensemble Transcripts</h3>
          <Row>
            <Col md={12}>
              <Table
                size="middle"
                bordered={true}
                pagination={false}
                columns={TRANSCRIPT}
                dataSource={result.ensembleTranscripts.map((t, i) => ({
                  key: `ens_transcript${i}`,
                  ...t,
                  transcriptId: (
                    <a
                      target="_blank"
                      href={`http://grch37.ensembl.org/Homo_sapiens/Transcript/Summary?t=${t.transcriptId}`}
                    >
                      {t.transcriptId}
                    </a>
                  )
                }))}
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );

  const renderClinicalInterpretation = () => (
    <div className="result-section" id="clinvar">
      <div className="section-header">
        <h2>Clinical Interpretation</h2>
      </div>
      <div className="content">
        <div className="sub-section">
          <h3>ClinVar</h3>
          <table>
            <thead>
              <tr>
                <th>Clinical significance</th>
                <th>Review status</th>
                <th>Disease</th>
                <th>Pubmed</th>
              </tr>
            </thead>
            <tbody>
              {result.clinvar.annotation.diseaseInfos.map((d, i) => (
                <tr key={`disease${i}`}>
                  <td>
                    {d.significance.map((s, j) => (
                      <p key={`significance${j}`}>{s}</p>
                    ))}
                  </td>
                  <td>
                    {d.revisionStatus.map((r, k) => (
                      <p key={`revision${k}`}>{r}</p>
                    ))}
                  </td>
                  <td>{d.diseaseDBName}</td>
                  <td>
                    {result.clinvar.pumeds
                      ? result.clinvar.pumeds.map(p => (
                          <a
                            key={p}
                            href={`https://www.ncbi.nlm.nih.gov/pubmed/?term=${p}`}
                            style={{ display: "block" }}
                          >
                            {p}
                          </a>
                        ))
                      : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPopulationFrequency = () => (
    <div className="result-section" id="population">
      <div className="section-header">
        <h2>Population Frequency</h2>
      </div>
      <div className="content">
        <Row>
          <Col md={12}>
            {populations.filter(p => p.database === "thousandGenome").length >
              0 && (
              <div className="sub-header">
                <h3>Thousand Genome</h3>
                <Table
                  pagination={false}
                  size="middle"
                  bordered={true}
                  columns={POPULATION_FREQUENCY}
                  dataSource={populations.filter(
                    p => p.database === "thousandGenome"
                  )}
                />
              </div>
            )}
            <br />
            {populations.filter(p => p.database === "gnomadExome").length >
              0 && (
              <div className="sub-header">
                <h3>Gnomad Exome</h3>
                <Table
                  pagination={false}
                  size="middle"
                  bordered={true}
                  columns={POPULATION_FREQUENCY}
                  dataSource={populations.filter(
                    p => p.database === "gnomadExome"
                  )}
                />
              </div>
            )}
            <br />
            {populations.filter(p => p.database === "gnomadGenome").length >
              0 && (
              <div className="sub-header">
                <h3>Gnomad Genome</h3>
                <Table
                  size="middle"
                  bordered={true}
                  pagination={false}
                  columns={[
                    {
                      title: "Population",
                      dataIndex: "population",
                      key: "population",
                      render: count => (count < 0 ? "N/A" : count)
                    },
                    {
                      title: "AF",
                      dataIndex: "af",
                      key: "af",
                      render: count => (count < 0 ? "N/A" : count)
                    }
                  ]}
                  dataSource={populations.filter(
                    p => p.database === "gnomadGenome"
                  )}
                />
              </div>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );

  const renderFunctionalPrediction = () => (
    <div className="result-section" id="functional_prediction">
      <div className="section-header">
        <h2>Functional Prediction</h2>
      </div>
      <div className="content">
        <Table
          pagination={{ hideOnSinglePage: true }}
          size="middle"
          bordered={true}
          columns={FUNCTIONAL_PREDICTION}
          dataSource={Object.keys(result.scores).map((k, i) => ({
            key: `key${i}`,
            tool: k,
            score: result.scores[k].score || "-",
            prediction: result.scores[k].prediction || "-"
          }))}
        />
      </div>
    </div>
  );

  const renderFetching = () => (
    <div className="content-wrapper">
      <div className="navigation-wrapper">
        <Skeleton active paragraph={false} />
      </div>
      <div className="content-wrapper">
        <Skeleton active /> <br />
        <Skeleton active /> <br />
        <Skeleton active /> <br />
      </div>
    </div>
  );

  const renderMatchingIDs = () => (
    <div className="content-wrapper">
      <h3>More than one allele found for this variant</h3>
      <ul>
        {matchingIDs.map(i => (
          <li key={i}>
            <Link to={`/variant/${i}`} replace>
              {i.trim()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderResult = () => (
    <>
      {console.log("result", result)}
      <div className="navigation-wrapper">
        <Tabs defaultActiveKey="1" onChange={navigateToSection}>
          <Tabs.TabPane tab="Summary" key="summary"></Tabs.TabPane>
          <Tabs.TabPane tab="ACMG Classification" key="acmg"></Tabs.TabPane>
          {result.refSeqTranscripts.length > 0 &&
            result.ensembleTranscripts.length > 0 && (
              <Tabs.TabPane tab="Transcripts" key="transcripts"></Tabs.TabPane>
            )}
          {result.clinvar &&
            result.clinvar.annotation &&
            result.clinvar.annotation.diseaseInfos && (
              <Tabs.TabPane
                tab="Clinical interpretation"
                key="clinvar"
              ></Tabs.TabPane>
            )}
          {populations !== undefined && populations.length > 0 && (
            <Tabs.TabPane
              tab="Population frequency"
              key="population"
            ></Tabs.TabPane>
          )}
          {result.score && (
            <Tabs.TabPane
              tab="Functional prediction"
              key="functional_prediction"
            ></Tabs.TabPane>
          )}
        </Tabs>
      </div>
      <div className="content-wrapper">
        {renderSummary()}
        {result.acmg && renderACMGclassification()}
        {result.refSeqTranscripts.length > 0 &&
          result.ensembleTranscripts.length > 0 &&
          renderTranscripts()}
        {result.clinvar &&
          result.clinvar.annotation &&
          result.clinvar.annotation.diseaseInfos &&
          renderClinicalInterpretation()}
        {populations !== undefined &&
          populations.length > 0 &&
          renderPopulationFrequency()}
        <Row>
          <Col md={12}>{result.scores && renderFunctionalPrediction()}</Col>
        </Row>
      </div>
    </>
  );

  return (
    <>
      <Header />
      {fetching ? (
        renderFetching()
      ) : result ? (
        renderResult()
      ) : matchingIDs.length ? (
        renderMatchingIDs()
      ) : (
        <div className="content-wrapper">
          <h2>Start by seaching for a gene or a variant</h2>
        </div>
      )}
      {}
    </>
  );
}

export default AnnotationResult;
