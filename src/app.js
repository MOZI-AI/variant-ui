import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";
import AnnotationForm from "./pages/form";
import VariantViewer from "./pages/variant-viewer";
import GeneViewer from "./pages/gene-viewer";
import PageNotFound from "./pages/404";
import "antd/dist/antd.min.css";
import "./global-style.css";

function App(props) {
  axios.defaults.baseURL = process.env.SERVER_ADDR || "http://localhost:3200";

  return (
    <Router>
      <Switch>
        <Route path="/" exact component={() => <AnnotationForm />} />
        <Route path="/variant/:id" render={() => <VariantViewer />} />
        <Route path="/gene/:id" component={() => <GeneViewer />} />
        <Route component={PageNotFound} />
      </Switch>
    </Router>
  );
}

export default App;
