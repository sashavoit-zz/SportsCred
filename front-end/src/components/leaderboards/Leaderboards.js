import React from "react";
import { Button, Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = theme => ({
    root: {
      marginTop: '100px'
    },
    button1: {
        backgroundColor: 'green',
        marginBottom: '10px',
        marginRight: '15px',
    },
    button2: {
        backgroundColor: '#6666ff',
        marginBottom: '10px',
        marginRight: '15px'
    },
    button3: {
        backgroundColor: '#6666ff',
        marginBottom: '10px',
        marginRight: '15px'
    },
    button4: {
        backgroundColor: '#6666ff',
        marginBottom: '10px',
        marginRight: '15px'
    },
    button5: {
        backgroundColor: '#6666ff',
        marginBottom: '10px',
        marginRight: '15px'
    },
    table: {
        textAlign: 'center',
        justifyContent: 'center'
    },
    rank: {
        fontWeight: 'bold'
    },
    userRow: {
        backgroundColor: '#009999'
    },
});

class Leaderboards extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      columns: [
          {
           label: 'Name',
           field: 'name',
           sort: 'asc',
           width: 150
          },
          {
            label: 'ACS Score',
            field: 'score',
            sort: 'desc',
            width: 90
          }
      ],
      rows: [],
      paginate: 10,
      rank: 'N/A',
      fullName: '',
      acs: 0
    };

    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Token": localStorage.getItem("Token"), 
        },
    };
    fetch("/getUserName/"+localStorage.getItem("User"),requestOptions)
        .then(response => response.json())
        .then((data) => {
            this.setState({
                    fullName: data.firstName + ' ' + data.lastName
            })
        })
        .catch(err => console.log(err))

    fetch("/getGlobalLeaderboard/hashsadasd", {
        mode: 'cors',
        headers: {
            'Token': localStorage.getItem("Token")
        }
    })
    .then(response => {
        if (response.ok) {
            response.json().then(json => {

                this.setState({
                    rank: 'N/A'
                })

                var data = [];
                for (let x in json) {
                    data.push({name: x, score: json[x]});
                }
                data.sort((a, b) => b.score - a.score);

                var newData = [];
                var i = 1;
                for (let key in data) {
                    if (i != data.length || i == data.length) {
                        newData.push({rank: i, name: data[key].name, score: data[key].score});
                        if (data[key].name == this.state.fullName) {
                            this.setState({
                                rank: i,
                                acs: data[key].score
                            })
                        }
                        i = i + 1;
                    }
                }

                this.setState({
                    rows: newData
                })
            })
        }
    });
  }

  handleViewgl = (event) => {
    event.preventDefault()
    document.getElementById("gl").style.backgroundColor = "green";
    document.getElementById("fl").style.backgroundColor = "#6666ff";
    document.getElementById("al").style.backgroundColor = "#6666ff";
    document.getElementById("pal").style.backgroundColor = "#6666ff";
    document.getElementById("eal").style.backgroundColor = "#6666ff";

    const response = fetch("/getGlobalLeaderboard/hashsadasd", {
        mode: 'cors',
        headers: {
            'Token': localStorage.getItem("Token")
        }
    })
    .then(response => {
        if (response.ok) {
            response.json().then(json => {

                this.setState({
                    rank: 'N/A'
                })

                var data = [];
                for (let x in json) {
                    data.push({name: x, score: json[x]});
                }
                data.sort((a, b) => b.score - a.score);

                var newData = [];
                var i = 1;
                for (let key in data) {
                    if (i != data.length || i == data.length) {
                        newData.push({rank: i, name: data[key].name, score: data[key].score});
                        if (data[key].name == this.state.fullName) {
                            this.setState({
                                rank: i,
                                acs: data[key].score
                            })
                        }
                        i = i + 1;
                    }
                }

                this.setState({
                    rows: newData
                })
            })
        }
    });
  }

  handleViewfl = (event) => {
    event.preventDefault()
    document.getElementById("gl").style.backgroundColor = "#6666ff";
    document.getElementById("fl").style.backgroundColor = "green";
    document.getElementById("al").style.backgroundColor = "#6666ff";
    document.getElementById("pal").style.backgroundColor = "#6666ff";
    document.getElementById("eal").style.backgroundColor = "#6666ff";

    const response = fetch("/getFanalystLeaderboard/hashsadasd", {
        mode: 'cors',
        headers: {
            'Token': localStorage.getItem("Token")
        }
    })
    .then(response => {
        if (response.ok) {
            response.json().then(json => {

                this.setState({
                    rank: 'N/A'
                })

                var data = [];
                for (let x in json) {
                    data.push({name: x, score: json[x]});
                }
                data.sort((a, b) => b.score - a.score);

                var newData = [];
                var i = 1;
                for (let key in data) {

                    if (i != data.length || i == data.length) {
                        newData.push({rank: i, name: data[key].name, score: data[key].score});
                        if (data[key].name == this.state.fullName) {
                            this.setState({
                                rank: i,
                                acs: data[key].score
                            })
                        }
                        i = i + 1;
                    }
                }

                this.setState({
                    rows: newData
                })
            })
        }
    });
  }

  handleViewal = (event) => {
    event.preventDefault()
    document.getElementById("gl").style.backgroundColor = "#6666ff";
    document.getElementById("fl").style.backgroundColor = "#6666ff";
    document.getElementById("al").style.backgroundColor = "green";
    document.getElementById("pal").style.backgroundColor = "#6666ff";
    document.getElementById("eal").style.backgroundColor = "#6666ff";

    const response = fetch("/getAnalystLeaderboard/hashsadasd", {
        mode: 'cors',
        headers: {
            'Token': localStorage.getItem("Token")
        }
    })
    .then(response => {
        if (response.ok) {
            response.json().then(json => {

                this.setState({
                    rank: 'N/A'
                })

                var data = [];
                for (let x in json) {
                    data.push({name: x, score: json[x]});
                }
                data.sort((a, b) => b.score - a.score);

                var newData = [];
                var i = 1;
                for (let key in data) {

                    if (i != data.length || i == data.length) {
                        newData.push({rank: i, name: data[key].name, score: data[key].score});
                        if (data[key].name == this.state.fullName) {
                            this.setState({
                                rank: i,
                                acs: data[key].score
                            })
                        }
                        i = i + 1;
                    }
                }

                this.setState({
                    rows: newData
                })
            })
        }
    });
  }

  handleViewpal = (event) => {
    event.preventDefault()
    document.getElementById("gl").style.backgroundColor = "#6666ff";
    document.getElementById("fl").style.backgroundColor = "#6666ff";
    document.getElementById("al").style.backgroundColor = "#6666ff";
    document.getElementById("pal").style.backgroundColor = "green";
    document.getElementById("eal").style.backgroundColor = "#6666ff";

    const response = fetch("/getProAnalystLeaderboard/hashsadasd", {
        mode: 'cors',
        headers: {
            'Token': localStorage.getItem("Token")
        }
    })
    .then(response => {
        if (response.ok) {
            response.json().then(json => {

                this.setState({
                    rank: 'N/A'
                })

                var data = [];
                for (let x in json) {
                    data.push({name: x, score: json[x]});
                }
                data.sort((a, b) => b.score - a.score);

                var newData = [];
                var i = 1;
                for (let key in data) {

                    if (i != data.length || i == data.length) {
                        newData.push({rank: i, name: data[key].name, score: data[key].score});
                        if (data[key].name == this.state.fullName) {
                            this.setState({
                                rank: i,
                                acs: data[key].score
                            })
                        }
                        i = i + 1;
                    }
                }

                this.setState({
                    rows: newData
                })
            })
        }
    });
  }

  handleVieweal = (event) => {
    event.preventDefault()
    document.getElementById("gl").style.backgroundColor = "#6666ff";
    document.getElementById("fl").style.backgroundColor = "#6666ff";
    document.getElementById("al").style.backgroundColor = "#6666ff";
    document.getElementById("pal").style.backgroundColor = "#6666ff";
    document.getElementById("eal").style.backgroundColor = "green";

    const response = fetch("/getExpertAnalystLeaderboard/hashsadasd", {
        mode: 'cors',
        headers: {
            'Token': localStorage.getItem("Token")
        }
    })
    .then(response => {
        if (response.ok) {
            response.json().then(json => {

                this.setState({
                    rank: 'N/A'
                })

                var data = [];
                for (let x in json) {
                    data.push({name: x, score: json[x]});
                }
                data.sort((a, b) => b.score - a.score);

                var newData = [];
                var i = 1;
                for (let key in data) {

                    if (i != data.length || i == data.length) {
                        newData.push({rank: i, name: data[key].name, score: data[key].score});
                        if (data[key].name == this.state.fullName) {
                            this.setState({
                                rank: i,
                                acs: data[key].score
                            })
                        }
                        i = i + 1;
                    }
                }

                this.setState({
                    rows: newData
                })
            })
        }
    });
  }

  compare( a, b ) {
    if ( a.score < b.score ){
      return -1;
    }
    if ( a.score > b.score ){
      return 1;
    }
    return 0;
  }

    render() {
      const { classes } = this.props;
      const StyledTableCell = withStyles((theme) => ({
        head: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
          textAlign: "center",
        },
        body: {
          fontSize: 14,
          backgroundColor: theme.palette.common.white,
          color: theme.palette.common.black,
          textAlign: "center",
        },
      }))(TableCell);
      
      const StyledTableRow = withStyles((theme) => ({
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
            color: theme.palette.common.black,
          },
        },
      }))(TableRow);
      return (
        <>
        <div className={classes.table}>
        <Button id="gl" variant="contained" color="primary" size="large" className={classes.button1} onClick={this.handleViewgl}>
            Global leaderboards
          </Button>
          <Button id="fl" variant="contained" color="primary" size="large" className={classes.button2} onClick={this.handleViewfl}>
            Fanalyst Leaderboards
          </Button>
          <Button id="al" variant="contained" color="primary" size="large" className={classes.button3} onClick={this.handleViewal}>
            Analyst leaderboards
          </Button>
          <Button id="pal" variant="contained" color="primary" size="large" className={classes.button4} onClick={this.handleViewpal}>
            Pro Analyst leaderboards
          </Button>
          <Button id="eal" variant="contained" color="primary" size="large" className={classes.button5} onClick={this.handleVieweal}>
            Expert Analyst leaderboards
          </Button>
        </div>
        <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table" >
        <TableHead>
          <TableRow>
            <StyledTableCell>Your rank: {this.state.rank}</StyledTableCell>
            <StyledTableCell align="right">ACS Score: {this.state.acs}</StyledTableCell>
          </TableRow>
        </TableHead>
      </Table>
    </TableContainer>
        <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table" >
        <TableHead>
          <TableRow>
            <StyledTableCell>Rank</StyledTableCell>
            <StyledTableCell align="right">Name</StyledTableCell>
            <StyledTableCell align="right">ACS Score</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.rows.map((row) => (
            <StyledTableRow key={row.rank}>
              <StyledTableCell className={classes.rank} component="th" scope="row">
                {row.rank}
              </StyledTableCell>
              <StyledTableCell align="right">{row.name}</StyledTableCell>
              <StyledTableCell align="right">{row.score}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
      );
    }
}

export default withStyles(useStyles)(Leaderboards);