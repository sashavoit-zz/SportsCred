import React from "react";
import { Box, Typography, Card, CardContent, Slider, withStyles, Avatar, Button, } from "@material-ui/core";
import { addRating, } from "../../service/ApiCalls";

const HotSlider = withStyles({
    root: {
        color: "red",
        height: 8
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: "red",
        border: "2px solid currentColor",
        marginTop: -8,
        marginLeft: -12,
        "&:focus, &:hover, &$active": {
            boxShadow: "inherit"
        }
    },
    active: {},
    valueLabel: {
        left: "calc(-50% + 4px)"
    },
    track: {
        height: 8,
        borderRadius: 4
    },
    rail: {
        height: 8,
        borderRadius: 4
    },
    mark: {
        height: 15,
        width: 3,
        marginTop: -3,
    },
    markActive: {
        opacity: 1,
        backgroundColor: 'currentColor',
    },
})(Slider);

export class UserPost extends React.Component {

    componentDidMount() {
        this.setState({ marks: this.props.marks, didSendRating: false, shouldRevealIdentity: false })
    }

    async sendRating(rate) {
        var dateOfMonth = new Date().getDate() % 10;
        const rating = await addRating("fanalyst" + dateOfMonth.toString(), this.props.posterEmail, this.props.raterEmail, rate);
        this.setState({ marks:[{ value: rating, label: 'Avg: '+Math.round(rating) +'%'}] })
    }

    render() {
        const showUser = this.state ? this.state.shouldRevealIdentity : false;
        let identityBox;

        const handleChangeCommitted = (event, newValue) => {
            this.sendRating(newValue);
            this.setState({ didSendRating: true })
        };

        if(!showUser) {
            identityBox = <CardContent>
                            <Box display="flex">
                                <Box p={1}>
                                    <Avatar src={""} width="60" height="60" />
                                </Box>
                                <Box p={1} flexGrow={1}>
                                    <Typography style={{opacity:.5}} color="textSecondary" gutterBottom variant="h6">
                                        Anonymous
                                    </Typography>
                                    <Typography color="textSecondary" gutterBottom>
                                        {this.props.answer}
                                    </Typography>
                                </Box>
                            </Box>
                                <Box display="flex">
                                    <Box p={1}>
                                        <Typography color="textSecondary" gutterBottom>
                                            Disagree
                                    </Typography>
                                    </Box>
                                    <Box p={1} flexGrow={1}>
                                        <HotSlider
                                            aria-label="hot-slider"
                                            valueLabelDisplay="auto"
                                            onChangeCommitted={handleChangeCommitted}
                                            disabled={showUser}
                                        />
                                    </Box>
                                    <Box p={1}>
                                        <Typography color="textSecondary" gutterBottom>
                                            Agree{"\t"}<Button
                                                variant="contained"
                                                color="secondary"
                                                disabled={this.state ? !this.state.didSendRating : true}
                                                onClick={() => this.setState({ shouldRevealIdentity: true })}
                                            >
                                                Finalize
                                             </Button>
                                    </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        ;
        } else {
            identityBox = <CardContent>
                            <Box display="flex">
                                <Box p={1}>
                                    <a href={"user/" + this.props.posterEmail}>
                                        <Avatar src={this.props.dpLink} width="60" height="60" />
                                    </a>
                                </Box>
                                <Box p={1} flexGrow={1}>
                                    <a href={"user/" + this.props.posterEmail}>
                                        <Typography display="inline" color="textSecondary" gutterBottom variant="h6">
                                            {this.props.name}
                                        </Typography>
                                    </a>
                                    <Typography style={{opacity:.7}} display="inline" color="textSecondary" gutterBottom variant="h7" >
                                        {"\tACS: "}{this.props.acs}
                                    </Typography>
                                    <Typography color="textSecondary" gutterBottom>
                                        {this.props.answer}
                                    </Typography>
                                </Box>
                            </Box>
                                <Box display="flex">
                                    <Box p={1}>
                                        <Typography color="textSecondary" gutterBottom>
                                            Disagree
                                    </Typography>
                                    </Box>
                                    <Box p={1} flexGrow={1}>
                                        <HotSlider
                                            aria-label="hot-slider"
                                            marks={this.state ? this.state.marks : this.props.marks}
                                            valueLabelDisplay="auto"
                                            onChangeCommitted={handleChangeCommitted}
                                            disabled={showUser}
                                        />
                                    </Box>
                                    <Box p={1}>
                                        <Typography color="textSecondary" gutterBottom>
                                            Agree
                                    </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                    ;
        }

        return (
            <div>
                <Card>
                    {identityBox}
                </Card>
            </div>
        );
    }
}

export default UserPost;
