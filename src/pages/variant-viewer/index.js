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
  Typography
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
    key: "homAlt"
  },
  {
    title: "AF",
    dataIndex: "af",
    key: "af"
  },
  {
    title: "AC",
    dataIndex: "ac",
    key: "ac"
  },
  {
    title: "AN",
    dataIndex: "an",
    key: "an"
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
        <table>
          <tbody>
            <tr>
              <td>GRCh37/hg19 position</td>
              <td>{`${result.chrom}:${result.pos}`}</td>
            </tr>
            <tr>
              <td>Allel (ref/alt)</td>
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
                  {result.acmg["bs"][0] === 1 && <Tag color="#722ed1">BS1</Tag>}
                  {result.acmg["bs"][1] === 1 && <Tag color="#722ed1">BS2</Tag>}
                  {result.acmg["ba1"] === 1 && <Tag color="#722ed1">BA1</Tag>}
                </td>
                <td></td>
                <td></td>
                <td>
                  {result.acmg["pm"][1] === 1 && <Tag color="#faad14">PM2</Tag>}
                </td>
                <td>
                  {result.acmg["ps"][3] === 1 && <Tag color="#fa541c">PS4</Tag>}
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Computation data</td>
                <td></td>
                <td>
                  {result.acmg["bp"][3] === 1 && <Tag color="#2f54eb">BP4</Tag>}
                  {result.acmg["bp"][0] === 1 && <Tag color="#2f54eb">BP1</Tag>}
                  {result.acmg["bp"][6] === 1 && <Tag color="#2f54eb">BP7</Tag>}
                  {result.acmg["bp"][2] === 1 && <Tag color="#2f54eb">BP3</Tag>}
                </td>
                <td>
                  {" "}
                  {result.acmg["pp"][2] === 1 && <Tag color="#52c41a">PP3</Tag>}
                </td>
                <td>
                  {result.acmg["pm"][4] === 1 && <Tag color="#faad14">PM5</Tag>}
                  {result.acmg["pm"][3] === 1 && <Tag color="#faad14">PM4</Tag>}
                </td>
                <td>
                  {result.acmg["ps"][0] === 1 && <Tag color="#fa541c">PS1</Tag>}
                </td>
                <td>
                  {result.acmg["pvs1"] === 1 && <Tag color="#f5222d">PSV1</Tag>}
                </td>
              </tr>
              <tr>
                <td>Functional data</td>
                <td>
                  {result.acmg["bs"][2] === 1 && <Tag color="#722ed1">BS3</Tag>}
                </td>
                <td></td>
                <td>
                  {result.acmg["pp"][1] === 1 && <Tag color="#52c41a">PP2</Tag>}
                </td>
                <td>
                  {result.acmg["pm"][0] === 1 && <Tag color="#faad14">PM1</Tag>}
                </td>
                <td>
                  {" "}
                  {result.acmg["ps"][2] === 1 && <Tag color="#fa541c">PS3</Tag>}
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Segregation data</td>
                <td>
                  {result.acmg["bs"][3] === 1 && <Tag color="#722ed1">BS4</Tag>}
                </td>
                <td></td>
                <td>
                  {" "}
                  {result.acmg["pp"][0] === 1 && <Tag color="#52c41a">PP1</Tag>}
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
                  {result.acmg["pm"][5] === 1 && <Tag color="#faad14">PM6</Tag>}
                </td>
                <td>
                  {result.acmg["ps"][1] === 1 && <Tag color="#fa541c">PS2</Tag>}
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Allele data</td>
                <td></td>
                <td>
                  {result.acmg["bp"][1] === 1 && <Tag color="#2f54eb">BP2</Tag>}
                </td>
                <td></td>
                <td>
                  {result.acmg["pm"][2] === 1 && <Tag color="#faad14">PM3</Tag>}
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Other database</td>
                <td></td>
                <td>
                  {result.acmg["bp"][5] === 1 && <Tag color="#2f54eb">BP6</Tag>}
                </td>
                <td>
                  {" "}
                  {result.acmg["pp"][4] === 1 && <Tag color="#52c41a">PP5</Tag>}
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Other data</td>
                <td></td>
                <td>
                  {result.acmg["bp"][4] === 1 && <Tag color="#2f54eb">BP5</Tag>}
                </td>
                <td>
                  {result.acmg["pp"][3] === 1 && <Tag color="#52c41a">PP4</Tag>}
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
                  ...t
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
                  ...t
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
                      key: "population"
                    },
                    {
                      title: "AF",
                      dataIndex: "af",
                      key: "af"
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
          <Col md={12}>{result.score && renderFunctionalPrediction()}</Col>
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
