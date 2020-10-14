// TODO: scrap this whole file

import React from "react";
import SideBar from "../SideBar/SideBar";


function Dashboard(props) {
  const { children: component } = props;
  

  return (
    <SideBar page = "Dashboard"></SideBar>
  );
}

export default Dashboard;
