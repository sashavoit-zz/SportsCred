import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import Notifications from "@material-ui/icons/Notifications";
import IconButton from "@material-ui/core/IconButton";
import Badge from '@material-ui/core/Badge';
import {CardActions,Card, CardHeader,CardContent, Typography} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    paper: {
        marginRight: theme.spacing(2),
        maxHeight: 50
    },
}));

export default function NotifBar() {

    const classes = useStyles();
    const [upding, setUpding] = React.useState(false);
    const [invisible, setInvisible] = React.useState(true);
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [notifs, setNotifs] = React.useState({upds: []});

    const handleBadgeVisibility = () => {
        setInvisible(!invisible);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
        setInvisible(true)
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    React.useEffect(() => {
        if (!upding){
            setUpding(true)
            updResults()
        }
    }, [upding])    

    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);


    async function updResults(){
        console.log("called")
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Token": localStorage.getItem("Token"),
            },
        };

        await fetch('/picks/newResults', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data != null) {
                    setNotifs(prevState => ({upds: data.concat(prevState.upds)}))
                }
                console.log(data)
                console.log(notifs)
            })
            .then(() => setUpding(false))
            .then(() => setInvisible(false))
    }

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);

    return (
        <div className={classes.root}>
            <div>
                <IconButton
                    ref={anchorRef}
                    aria-controls={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                >
                    <Badge color="secondary" variant="dot" invisible={invisible}>
                        <Notifications/>
                    </Badge>
                </IconButton>
                <Popper open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                        {notifs.upds.map(upd =>
                                            <MenuItem>
                                                <Card>
                                                    <CardContent>
                                                        <Typography variant="h8" component="h8">
                                                            {upd.team1_init} vs. {upd.team2_init}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary" component="p">
                                                            Your prediction was {upd.correct ? "correct" : "incorrect"}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </MenuItem>
                                        )}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        </div>
    );
}