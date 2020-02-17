import React from "react";
import { Tag } from "antd";

const ColorProfile = {
  pathogenic: "#cf1322",
  "likely pathogenic": "#fa541c",
  "uncertain significance": "#777",
  "likely benign": "#a0d911",
  benign: "#389e0d"
};

const style = {
  large: {
    fontSize: "1.2rem",
    padding: "5px 10px"
  },
  small: {}
};

const Verdict = ({ verdict, size = "small" }) => (
  <Tag style={style[size]} color={ColorProfile[verdict.toLowerCase()]}>
    {verdict}
  </Tag>
);

export default Verdict;
