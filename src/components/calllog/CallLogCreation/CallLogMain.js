import { useState, useEffect } from "react";
import CallLogDashboard from "./CallLogDashboard";
import CallLogMainList from "./CallLogMainList";
import CallLogCreation from "./CallLogCreation";

import "./../../logoicon.css";
const CallLogMain = () => {
  return (
    <div>
      <CallLogDashboard />
      <div className="card">
        <div className="row col-lg-12 mt-2">
          <CallLogMainList />
          {/* <CallLogCreation /> */}
        </div>
      </div>
    </div>
  );
};

export default CallLogMain;
