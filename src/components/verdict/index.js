import React from "react";
import { Tag } from "antd";

const ColorProfile = {
  pathogenic: "#cf1322",
  "likely pathogenic": "#fa541c",
  "uncertain significance": "#777",
  "likely benign": "#a0d911",
  benign: "#389e0d"
};

const Verdict = ({ verdict }) => (
  <Tag color={ColorProfile[verdict.toLowerCase()]}>{verdict}</Tag>
);

export default Verdict;
