import React from 'react';
import {withStyles} from "@material-ui/core/styles";

const styles = theme =>({
    root:{
        minWidth:800,
        maxWidth:1000,
    },
});

export class uploadPost extends React.Component{
    render(){
        const {currentUser} = this.props;
        return(
            <div></div>
        );    
    }

}
export default withStyles(styles)(uploadPost);