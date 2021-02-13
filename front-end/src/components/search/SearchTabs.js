import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import SearchAll from "./AllResults";

import { useHistory } from "react-router-dom";

const url = "";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
      <Box p={3}>
        <Typography component={'span'}>{children}</Typography>
      </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    //backgroundColor: theme.palette.background.paper,
    backgroundColor: "#333333",
   maxWidth: "100%", 
   //left: '50%',
   width: '95%',
  //  position: 'absolute',
  //   transform: 'translate(-50%, -50%)',


  },
  indicator: {
    backgroundColor: 'white',
  },
  tabs: {
      position:'relative',
  }
}));

function getFriends(){
  let req = new Request(url, {
    method:'GET'
  });
}

export default function SearchTabs({user, query}) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const history = useHistory()

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  function viewPosts() {
    history.push(`/search/posts/?search=`+query);
  }
  function viewUsers() {
      history.push(`/search/users/?search=`+query);
  }
  function viewAll() {
    history.push(`/search/all/?search=`+query);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs className={classes.tabs} value={value} onChange={handleChange}
          classes={{
            indicator: classes.indicator
          }}
        >
          <Tab label="All" {...a11yProps(0)} onClick={viewAll}/>
          <Tab label="People" {...a11yProps(1)} onClick={viewUsers}/>
          <Tab label="Posts" {...a11yProps(2)} onClick={viewPosts}/>
        </Tabs>
      </AppBar>
          

      <TabPanel value={value} index={0}>
        <SearchAll query={query} user={user} type={'all'}></SearchAll>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SearchAll query={query} user={user} type={'user'}></SearchAll>
          

      </TabPanel>
      <TabPanel value={value} index={2}>
        <SearchAll query={query} user={user} type={'post'}></SearchAll>
      </TabPanel>
    </div>
  );
}