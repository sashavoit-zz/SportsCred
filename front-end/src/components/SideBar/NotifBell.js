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
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    paper: {
        marginRight: theme.spacing(2),
    },
    notification: {
        width: '100%',
        maxWidth: 400
    },
    title: {
        htmlFontSize: 12,
    },
    content: {
        htmlFontSize: 10,
    }
}));

export default function NotifBell() {

    const classes = useStyles();
    const [invisible, setInvisible] = React.useState(true);
    const upding = React.useRef(false)
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [notifs, setNotifs] = React.useState({upds: []});

    const handleBadgeVisibility = () => {
        setInvisible(!invisible);
    };

    const handleToggle = () => {
        if (notifs.upds.length){
            setOpen((prevOpen) => !prevOpen);
            setInvisible(true)
        }
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    React.useEffect(() => {
        if (!upding.current){
            upding.current = true
            updNotifs()
        }
    }, [])

    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    async function updNotifs(){
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Token": localStorage.getItem("Token"),
            },
        };

        await fetch('/notifs/ifNewNotifs', requestOptions)
            .then(response => (response == null) ? null : response.json())
            .then(data => {
                setInvisible(!data)
            })

        await fetch('/notifs/getNotifs', requestOptions)
            .then(response => (response == null) ? null : response.json())
            .then(data => {
                if (data!=null && Array.isArray(data) && data.length){
                    setNotifs(prevState => ({upds: data}))
                }
            })

        awaitNotifs()
    }

    async function awaitNotifs(){
        console.log("called")
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Token": localStorage.getItem("Token"),
            },
        };

        await fetch('/notifs/updNotifs', requestOptions)
            .then(response => (response == null) ? null : response.json())
            .then(data => {
                if (data!=null && Array.isArray(data) && data.length){
                    setNotifs(prevState => ({upds: data}))
                    setInvisible(false)
                }
            })

        awaitNotifs()
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
                            <Paper style={{maxHeight: 400, overflow: 'auto'}}>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                        {notifs.upds.map(upd =>
                                            <MenuItem>
                                                <div className={classes.notification}>
                                                    <Alert
                                                        severity = {upd.type}
                                                        action={
                                                            <IconButton
                                                                aria-label="close"
                                                                color="inherit"
                                                                size="small"
                                                                onClick={() => {
                                                                    setNotifs(prevState => (
                                                                        {upds: prevState.upds.filter(update => (update.id != upd.id))}
                                                                        ));

                                                                    const requestOptionsDelete = {
                                                                        method: "DELETE",
                                                                        headers: {
                                                                            "Content-Type": "application/json",
                                                                            "Token": localStorage.getItem("Token")
                                                                        },
                                                                        body: JSON.stringify({
                                                                            id: upd.id
                                                                        }),
                                                                    };

                                                                    fetch('/notifs/removeNotif', requestOptionsDelete);
                                                                }}
                                                            >
                                                                <CloseIcon fontSize="inherit" />
                                                            </IconButton>
                                                        }
                                                    >
                                                        <AlertTitle>
                                                            <Typography style={{ width:250, fontSize:14, wordWrap: 'break-word', whiteSpace: 'pre-line' }}>
                                                                {upd.title}
                                                            </Typography>
                                                        </AlertTitle>
                                                        <Typography style={{ width:250, fontSize:12, wordWrap: 'break-word', whiteSpace: 'pre-line' }}>
                                                            {upd.content}
                                                        </Typography>
                                                    </Alert>
                                                </div>
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