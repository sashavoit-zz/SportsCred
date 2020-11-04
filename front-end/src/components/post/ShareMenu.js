import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ShareIcon from '@material-ui/icons/Share';
import { makeStyles } from '@material-ui/core/styles';
//import { Button, Comment, Form, Header } from 'semantic-ui-react'
import {
    EmailShareButton,
    FacebookShareButton,
    RedditShareButton,
    TwitterShareButton,
    TumblrShareButton,
} from "react-share";


import {
    FacebookIcon,
    RedditIcon,
    TwitterIcon,
    TumblrIcon,
} from "react-share";

const useStyles = makeStyles({
    button: {
        display: 'flex',
        alignItems: 'center'
    },
});

export default function ShareMenu({data}) {
    const [url,content,hashtag] = data
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const classes = useStyles();
    return (
        <div>
            <ShareIcon aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className={classes.button}/>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>
                    <FacebookShareButton url={url} quote={content} hashtag={hashtag} className={classes.button}>
                        <FacebookIcon size={28} round={true} />
                        <p> &nbsp; Post to FaceBook</p>
                    </FacebookShareButton>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <TwitterShareButton url={url} title={content} hashtag={hashtag} className={classes.button}>
                        <TwitterIcon size={28} round={true} />
                        <p> &nbsp; Post a Tweet</p>
                    </TwitterShareButton>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <RedditShareButton url={url} title={content} className={classes.button}>
                        <RedditIcon size={28} round={true} />
                        <p> &nbsp; Post to Reddit</p>
                    </RedditShareButton>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <TumblrShareButton url={url} title={content} tags={[{hashtag}]} className={classes.button}>
                        <TumblrIcon size={28} round={true} />
                        <p> &nbsp; Post to Tumblr</p>
                    </TumblrShareButton>
                </MenuItem>
            </Menu>
        </div>
    );
}

// /* /* /* /* {/* <Card className={classes.root}>
//           <CardContent className={classes.content}>
//             <CardHeader
//               title={this.state.content}
//               subheader={this.state.content}
//             >
//             </CardHeader>
//           </CardContent>
//           <CardActions>

//             <FacebookShareButton url={this.state.url} quote={this.state.content} hashtag="#SportCred">
//               <FacebookIcon size={32} round={true} />
//             </FacebookShareButton>

//             <TwitterShareButton url={this.state.url} title={this.state.content} hashtag="#SportCred">
//               <TwitterIcon size={32} round={true} />
//             </TwitterShareButton>

//             <RedditShareButton url={this.state.url} title={this.state.content}>
//               <RedditIcon size={32} round={true} />
//             </RedditShareButton>

//             <TumblrShareButton url={this.state.url} title={this.state.content} tags={["SportCred"]}>
//               <TumblrIcon size={32} round={true} />
//             </TumblrShareButton>
//           </CardActions>
//         </Card> */} */ */ */ */