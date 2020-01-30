import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
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

const Header = props => {
  const history = useHistory();
  const { id } = useParams();
  const [searchToken, setSearchToken] = useState(undefined);

  // When the search token changes, redirect to the either the gene viwer or variant viewer page depending on what the token is
  const handleSubmit = () => {
    // Check if the token is a gene
    if (geneRegex.reduce((a, r) => a || r.test(searchToken), false)) {
      history.push(`/gene/${searchToken}`);
    }
    // Check if the token is a variant
    else if (variantRegex.reduce((a, r) => a || r.test(searchToken), false)) {
      history.push(`/variant/${searchToken}`);
    } else {
      message.error(
        "The search token is not recognized. Make sure it is a valid token."
      );
    }
  };

  return (
    <div className="horizontal header">
      <img src={logo} className="logo" />
      <h1 onClick={() => history.push("/")}>Mozi</h1>
      <input
        defaultValue={id}
        className="search-input"
        style={{ marginLeft: 60 }}
        onChange={e => setSearchToken(e.target.value)}
        onKeyUp={e =>
          searchToken && event.keyCode === 13 ? handleSubmit() : null
        }
      />
    </div>
  );
};

export default Header;
