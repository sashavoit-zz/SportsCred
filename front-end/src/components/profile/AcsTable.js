import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import NativeSelect from '@material-ui/core/NativeSelect';
//import { makeStyles, useTheme } from '@material-ui/core/styles';


const log = console.log
const styles = theme => ({
    tableHeader:{
        fontSize: "20px"
    },
    tableCell:{
        fontSize: "24px"
    },
    tableTime: {
        fontSize: "20px"
    }
});


function timeConverter(UNIX_timestamp, timeUnit) {
    if(!UNIX_timestamp){
        return null
    }
    const a = new Date(parseInt(UNIX_timestamp))//.toLocaleDateString("en-US");
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    // var hour = a.getHours();
    // var min = a.getMinutes();
    // var sec = a.getSeconds();
    //const time = date + ' ' + month + ' ' + year// + ' ' + hour + ':' + min + ':' + sec;
    if(timeUnit == 'year'){
        return year
    } else if (timeUnit == 'month'){
        return month+' '+year
    } else{
        return date + ' ' + month + ' ' + year
    }
}





function TablePaginationActions(props) {
    const { count, page, rowsPerPage, onChangePage } = props;
    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div style={{flexShrink: 0}}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {/* {classes.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />} */}
                <FirstPageIcon />
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {/* {classes.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />} */}
                <KeyboardArrowLeft />
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {/* {classes.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />} */}
                <KeyboardArrowRight />
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {/* {classes.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />} */}
                <LastPageIcon />
            </IconButton>
        </div>
    );
}
TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};


function createData(acs, time) {
    return { acs, time };
}

function parseAcs(acsDataStr) {

    const result = acsDataStr.map(row => {
        const line = row.split("@")
        return createData(line[0], line[1])
    })
    return result
}

function groupAcsList(currAcsList) {
    var result = {}

    for (let i = 0; i < currAcsList.length; i++) {
        if (currAcsList[i].time){
            const currTime = new Date(parseInt(currAcsList[i].time))
            const year = currTime.getFullYear();
            const month = currTime.getMonth();
            const date = currTime.getDate();

            // result[year].month[date] = currAcsList[i];
            if(!result[year]){
                result[year]={[month]:{[date]:currAcsList[i]}} //add first entry in this year
            }else{
                if(!result[year][month]){
                    result[year][month] = {[date]: currAcsList[i] }  //add first entry in this month
                }else{
                    result[year][month][date] = currAcsList[i]      // month exist, add or update acs on the date
                }
            }
        }
    }
    //log(result)
    return result
}

function switchTimeUnit(timeUnit, acsListGroup){
    let result = []
    if (timeUnit == "day"){
        Object.keys(acsListGroup).map(function (yearKey, index) { //year
            Object.keys(acsListGroup[yearKey]).map(function (monthKey, index) { //month
                Object.keys(acsListGroup[yearKey][monthKey]).map(function (dayKey, index) { //date
                    result.push(acsListGroup[yearKey][monthKey][dayKey])
                })
            })
        });
    }else if(timeUnit == 'month'){
        Object.keys(acsListGroup).map(function (yearKey, index) { //year
            Object.keys(acsListGroup[yearKey]).map(function (monthKey, index) { //month
                const lastDay = Object.keys(acsListGroup[yearKey][monthKey]).slice(-1)[0] // get last day's key
                result.push(acsListGroup[yearKey][monthKey][lastDay])
            })
        });
    }else if(timeUnit == 'year'){
        Object.keys(acsListGroup).map(function (yearKey, index) { //year
            const lastMon = Object.keys(acsListGroup[yearKey]).slice(-1)[0]     // get last month's key
            const lastDay = Object.keys(acsListGroup[yearKey][lastMon]).slice(-1)[0] // get last day's key
            result.push(acsListGroup[yearKey][lastMon][lastDay])
        });
    }
    return result
}

class AcsTable extends Component{
    constructor(props) {
        super(props);
        this.state = {
            acsList: [],
            acsListGroup: {},
            page: 0,
            rowsPerPage: 5,
            timeUnit:"date",
        }
    }
    //const classes = useStyles();
    componentDidMount(){
        //const postId
        const url = '/acsHistory/' + this.props.user; //http://localhost:3001
        const comment_request = new Request(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Token': localStorage.getItem("Token") // move whole function to ApiCalls.js later
            }
        });
        fetch(comment_request)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    console.log('could not get user acs');
                }
            })
            .then(res => {
                // log("acs--------")
                // //log(email)
                // log(res)
                // log([1,2,3])
                // const ress = '[20@584067600000 21@584107200000 22@584118000000 25@584204400000 27@586450800000 40@986137200000 46@1243522800000 56@1262358000000 57@1270083600000 58@1270134000000 70@1270220400000]'
                // log("")
                // log(res)
                const groupList = groupAcsList(parseAcs(res.slice(1, -1).split(" ")))

                this.setState({ 
                    acsList: switchTimeUnit('day', groupList),
                    acsListGroup: groupList
                })
            })
            .catch((error) => {
                console.log(error)
            });
    }
    // log("nnv")
    // log(this.props.user.email)
    
    render(){
        //getAcsHistory();
        const { classes } = this.props;
        const emptyRows = this.state.rowsPerPage - Math.min(this.state.rowsPerPage, this.state.acsList.length - this.state.page * this.state.rowsPerPage);
        const handleChangePage = (event, newPage) => {
            this.setState({page:newPage})
        };
        const handleChangeRowsPerPage = (event) => {
            this.setState({ 
                rowsPerPage: parseInt(event.target.value, 10),
                page: 0,
            })
        };

        const handleTimeUnitChange = (event) => {
            // log('timeunit event ------')
            // log(event)
            // log(event.target)
            // log(switchTimeUnit("day", this.state.acsListGroup))
            this.setState({
                timeUnit:event.target.value,
                acsList: switchTimeUnit(event.target.value, this.state.acsListGroup),
                page: 0,
            })
            //this.setState({ acsList: parseAcs(res.slice(1, -1).split(" ")) })
        }
        return (
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHeader}>ACS</TableCell>
                            <TableCell align="right">
                                <NativeSelect
                                    className={classes.tableTime}
                                    //className={classes.selectEmpty}
                                    value={this.state.timeUnit}
                                    // name="timeUnit"
                                    onChange={handleTimeUnitChange}
                                    //inputProps={{ 'aria-label': 'timeUnit' }}
                                >
                                    <option value={'day'}>day</option>
                                    <option value={'month'}>month</option>
                                    <option value={'year'}>year</option>
                                </NativeSelect>
                            </TableCell>
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(this.state.rowsPerPage > 0
                            ? this.state.acsList.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                            : this.state.acsList // []
                        ).map((row) => (
                            <TableRow>
                                <TableCell className={classes.tableCell} component="th" scope="row">
                                    {row.acs}
                                </TableCell>
                                <TableCell className={classes.tableTime} align="right">{
                                    timeConverter(row.time, this.state.timeUnit)
                                }</TableCell>
                            </TableRow>
                        ))}
                        {/* {emptyRows > 0 && (
                            <TableRow style={{ height: 49 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )} */}
                        {emptyRows > 0 && (
                                // <TableRow style={{ height: 53 * emptyRows }}>
                            Array(emptyRows).fill(null).map((row) => (
                                <TableRow>
                                    <TableCell className={classes.tableCell} component="th" scope="row">
                                        &nbsp;
                                    </TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            {/* <select style={{}} name="acsTime" id="acsTime">
                                <option value="year">year</option>
                                <option value="month">month</option>
                                <option value="date">date</option>
                            </select> */}
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={this.state.acsList.length}
                                rowsPerPage={this.state.rowsPerPage}
                                page={this.state.page}
                                SelectProps={{
                                    inputProps: { 'aria-label': 'rows per page' },
                                    native: true,
                                }}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        );
    }
}
//<TableRow key={row.name}></TableRow>
AcsTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AcsTable);