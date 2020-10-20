import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {TextField, Button, Avatar, Container, Grid, Typography} from '@material-ui/core'
function addPost(content, author, authorProfile, postTime) {
    const response = fetch("http://localhost:3001/addPost/hashasdasd", {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify({
            "content":content,
            "author": author,
            "authorProfile":authorProfile,
            "likes":0,
            "dislikes":0,
            "postTime":postTime
        })
    });
      }


const styles = theme =>({
    root: {
        '& .MuiTextField-root': {
             width:'100%',
             margin:"auto",
             display:"flex",
         },

      },
      container:{
          margin:'auto',
          width:'60vw'
      },
      grid:{
          flexGrow:1,
      },
      avatar:{
          margin:'auto',
      },
      input:{
          color:"white"
      },
      button:{
          float:"right",
          marginTop:`10px`,
          margin: theme.spacing(3, 0, 2),
      }

});



export class UploadPost extends React.Component{
    state = {
        uploadInput:"",
        errorText:""
    };

    render(){
        const {component} = this.props;
        const {classes} = this.props;
        const handleInput=(component, field)=>{
            const value = field.value;
            const name = field.name;
            component.setState({
                [name]:value
            })
        }
        const handleSubmit = (component) =>{
            if(this.state.uploadInput.length === 0){
                /*handling if user uploading post with empty content, will occur error message*/
                handleInputEmpty();
            }
            else{
                const posts = component.state.posts;
                const today = new Date();
                const date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
                addPost(this.state.uploadInput,component.state.currentUser.userName, component.state.currentUser.profilePic,date)
                reset()
            }
        }
        const reset = () =>{
            this.setState({
                uploadInput:"",
                errorText:""
            })
        }
        const handleInputEmpty = ()=>{
           this.setState({
               errorText:"Could not upload post with empty content"
           })
        }
        return(
            <Container className = {classes.container}>
                <div>
                <form  className = {classes.root} noValidate autoComplete = "off">
                <div>
                    <Grid className = {classes.grid} container spacing={1}>
                        <Grid item >
                            <Avatar className={classes.avatar} alt="user profile" src={component.state.currentUser.profilePic}/>
                            <Typography>{component.state.currentUser.userName}</Typography>                        
                        </Grid>
                        <Grid item xs>
                            <TextField 
                            error ={this.state.errorText.length === 0 ? false : true }
                            id = "standard-multiline-static"
                            multiline
                            name = "uploadInput"
                            value={this.state.uploadInput}
                            onChange={e => handleInput(this,e.target)}
                            variant="outlined"
                            placeholder="What's in your mind?"
                            InputProps={
                                {className: classes.input}
                            }
                            helperText={this.state.errorText}
                            />
                        </Grid>
                    
                    </Grid>
                    <Button 
                    className ={classes.button}
                    variant="contained" 
                    color="primary"
                    onClick={e=>handleSubmit(component)}
                    >
                        Submit
                    </Button>
                </div>
            </form>
                </div>
                
            </Container>
        );
    }
}
export default withStyles(styles)(UploadPost);
