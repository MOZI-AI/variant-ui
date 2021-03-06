import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { message } from "antd";
import logo from "../../assets/logo.png";

const geneRegex = [/^[a-zA-Z1-9]+$/, /^[1-9]\d*$/, /^ENSG/];
const variantRegex = [
  /^rs[0-9]*$/,
  /(chr)?([\d|XYMTxymt]+):[gG]\.(\d+)([GCTAgcta])?>([GCTAgcta])/,
  /(chr)?([\d|XYMTxymt]+):[gG]\.(\d+)([gctaGCTA])?=/,
  /(chr)?([\d|XYMTxymt]+):[gG]\.(\d+)(?:_(\d+))?([GCTAgcta]+)?delins([GCTAgcta]+)/,
  /(chr)?([\d|XYMTxymt]+):[gG]\.(\d+)_(\d+)ins([GCTAgcta]+)/,
  /(chr)?([\d|XYMTxymt]+):[gG]\.(\d+)(?:_(\d+))?del([GCTAgcta]+)?/,
  /(chr)?([\d|XYMTxymt]+):[gG]\.(\d+)_(\d+)ins(\d+)_(\d+)inv/
];

const AnnotationForm = ({ onSubmit }) => {
  const history = useHistory();
  const [searchToken, setSearchToken] = useState(undefined);

  // When the search token changes, redirect to the either the gene viwer or variant viewer page depending on what the token is
  const handleSubmit = () => {
    // Check if the token is a gene
    if (variantRegex.reduce((a, r) => a || r.test(searchToken), false)) {
      history.push(`/variant/${searchToken}`);
    } else if (geneRegex.reduce((a, r) => a || r.test(searchToken), false)) {
      history.push(`/gene/${searchToken}`);
    } else {
      message.error(
        "The search token is not recognized. Make sure it is a valid token."
      );
    }
  };

  return (
    <div className="form-wrapper">
      <div className="vertical header">
        <img src={logo} className="logo" />
        <h1>MOZI</h1>
        <h2>Gene and variant annotation service</h2>
      </div>
      <div className="search-wrapper">
        <input
          className="search-input"
          placeholder="Enter a symbol"
          onChange={e => setSearchToken(e.target.value)}
          onKeyUp={e =>
            searchToken && event.keyCode === 13 ? handleSubmit() : null
          }
        />
        <button disabled={!searchToken} onClick={handleSubmit}>
          Search
        </button>

        <div className="examples">
          <h3>Examples</h3>
          Gene: <Link to="gene/PAH">PAH</Link>
          <br />
            Variant: <Link to="/variant/2:47703538:C:T">2:47703538:C:T</Link>,  <Link to={"/variant/13:32953985:AGTAAA:"}>22:30035183:AGTAAA:</Link>,  <Link to="/variant/rs118092776 ">rs118092776 </Link>
        </div>
      </div>
    </div>
  );
};

export default AnnotationForm;
