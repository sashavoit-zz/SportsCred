// TODO: scrap this whole file

import React from "react";
import SideBar from "../SideBar/SideBar";


function Dashboard(props) {
  const { children } = props;
  

  return (
  <SideBar page = "Dashboard">{children}</SideBar>
  );
}

export default Dashboard;
