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
import {CardActions,Card, CardHeader,CardContent, Typography} from '@material-ui/core';

import axios from 'axios';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    paper: {
        marginRight: theme.spacing(2),
    },
}));

export default function NotifBar() {

    const mockState = [{team1_init: "SOMETHING",
        team2_init: "SOMETHING ELSE",
        date: "djfhkdsj",
        correct: "false"}]

    const classes = useStyles();
    const [upding, setUpding] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [notifs, setNotifs] = React.useState({upds: mockState});

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    /*
    React.useEffect(() => {
        if (!upding){
            setUpding(true)
            updResults()
        }
    }, [upding])
    */

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
                    setNotifs({upds: data})
                }
                console.log(data)
                console.log(notifs)
            })
            .then(setUpding(false))
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
                    <Notifications/>
                </IconButton>
                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
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
                                                        <Typography variant ="body1" color="textSecondary">
                                                            Your prediction is {upd.correct.toString()}, {upd.team1_init}, {upd.team2_init}, {upd.date}
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