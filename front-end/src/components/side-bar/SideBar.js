import React from "react";
import {
  AppBar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  makeStyles,
  Menu,
  MenuItem,
  IconButton
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import SportsBasketballIcon from "@material-ui/icons/SportsBasketball";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import NotifBell from "./NotifBell";
import SearchBar from './SearchBar'

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    color: "white",
    backgroundColor: "#393939",
  },
  content: {
    flexGrow: 1,
    marginTop: theme.spacing(10),
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    padding: theme.spacing(3),
  },
  grow: {
    flexGrow: 1,
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
}));

function SideBar(props) {
  const { children: component } = props;
  const { page } = props;
  const classes = useStyles();

  let history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (doIt) => {
    setAnchorEl(null);
    if (doIt) {
      // log out user
      localStorage.removeItem('Token');
      history.push('/login')
    }
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => handleMenuClose('do it')}>Logout</MenuItem>
    </Menu>
  );

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
        <ListItem
          button
          key={"OpenCourt"}
          onClick={() => history.push("/the-zone")}
        >
          <ListItemIcon>
            <SportsBasketballIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="The Zone" />
        </ListItem>

        <ListItem
          button
          key={"OpenCourt"}
          onClick={() => history.push("/trivia")}
        >
          <ListItemIcon>
            <SportsBasketballIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Trivia" />
        </ListItem>

        <ListItem
            button
            key={"Picks & Predictions"}
            onClick={() => history.push("/predictions")}
        >
          <ListItemIcon>
            <SportsBasketballIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Predictions" />
        </ListItem>

        <ListItem
          button
          key={"OpenCourt"}
          onClick={() => history.push("/profile")}
        >
          <ListItemIcon>
            <SportsBasketballIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>

        <ListItem
          button
          key={"OpenCourt"}
          onClick={() => history.push("/debate")}
        >
          <ListItemIcon>
            <SportsBasketballIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Debate & Analysis" />
        </ListItem>

        <ListItem
          button
          key={"OpenCourt"}
          onClick={() => history.push("/leaderboards")}
        >
          <ListItemIcon>
            <SportsBasketballIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Leaderboards" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar style={{ paddingLeft: 0 }}>
          <SearchBar/>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <NotifBell/>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      {renderMenu}
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}

        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </nav>
      <main className={classes.content}>{component}</main>
    </div>
  );
}

export default SideBar;
