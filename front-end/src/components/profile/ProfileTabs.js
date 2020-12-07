import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import FriendsList from './FriendsList';
import AcsTable from './AcsTable';
import PostsTable from './PostsTable';
import DebateTable from './DebateTable';

const url = "localhost:3001/";
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
  },
  indicator: {
    backgroundColor: 'white',
  },
}));

function getFriends(){
  let req = new Request(url, {
    method:'GET'
  });
}

export default function SimpleTabs({user, profile}) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
 
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example"
          classes={{
            indicator: classes.indicator
          }}
        >
          <Tab label="Posts" {...a11yProps(0)} />
          <Tab label="Debate" {...a11yProps(1)} />
          <Tab label="ACS Chart" {...a11yProps(2)} />
          <Tab label="Radar" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <PostsTable user={profile}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DebateTable user={profile} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AcsTable user={profile}/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <FriendsList user={user} profile={profile}></FriendsList>
      </TabPanel>
    </div>
  );
}