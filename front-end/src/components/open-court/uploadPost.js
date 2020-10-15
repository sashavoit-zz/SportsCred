import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {TextField, Button, Avatar, Container, Grid, Typography} from '@material-ui/core'
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
    /* TODO:the posts in the state should fetch from the db, here are some dummy data */
    state = {
        uploadInput:""
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
            /**TODO: need to check if the user inputed or not. */
            const posts = component.state.posts;
            const today = new Date();
            const date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
            console.log(date);
            const newPost = {
                content:this.state.uploadInput,
                postTime:date,
                author:component.state.currentUser.userName,
                authorProfile:component.state.currentUser.profilePic,
                likes:0,
                dislikes:0
            }
            posts.push(newPost);
            component.setState({
                posts:posts
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
                            id = "standard-multiline-static"
                            multiline
                            name = "uploadInput"
                            // value={value}
                            onChange={e => handleInput(this,e.target)}
                            variant="outlined"
                            placeholder="What's in your mind?"
                            InputProps={
                                {className: classes.input}
                            }
                            />
                        </Grid>
                    
                    </Grid>
                    <Button 
                    className ={classes.button}
                    variant="contained" 
                    color="primary"
                    onClick={e=>handleSubmit()}
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