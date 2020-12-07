import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {TextField, Button, Avatar, Container, Grid, Typography, Card, CardContent, IconButton, CardActions, CardMedia,GridList,GridListTile,GridListTileBar} from '@material-ui/core'
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import CloseIcon from '@material-ui/icons/Close';
async function addPost(content, author, postTime) {
    addAcs(author)
    const requestOptions = {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify({
            "content":content,
            "email": author,
            "likes":0,
            "dislikes":0,
            "postTime":postTime
        }),
        headers: {
            "Content-Type": "application/json",
            "Token": localStorage.getItem("Token"),
          },
    };
    let newPost = await fetch("/addPost/hashasdasd", requestOptions)
    .then(response => response.json())
    .then((result) => {
        return result[0]
      })
      return newPost
      }
async function addAcs(email){
    const url = '/acs'; //http://localhost:3001
    const data = {
        email: email,
        offset: 1
    }
    const profile_request = new Request(url, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Token': localStorage.getItem("Token") // move whole function to ApiCalls.js later
        }
    });
    fetch(profile_request)
    .then(res => {
        
    })
    .catch((error) => {
        console.log(error)
    });
}
  async function reloadPost() {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Token": localStorage.getItem("Token"),
            },
        };
        let posts = await fetch("/allPosts", requestOptions)
            .then(response => response.json())
            .then((data) => {return data})
            .catch(err => console.log(err))
            return posts
      }

async function addHashTags(tags, postId) {
    const requestOptions = {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify({
            "tags":tags,
        }),
        headers: {
            "Content-Type": "application/json",
            "Token": localStorage.getItem("Token"),
            },
        };
        let hashTags = await fetch("/addHashTags/"+postId, requestOptions)
            .then(response => response.json())
            .then((result) => {
                return result
            })
            .catch((error)=>{
                console.log(error)
            })
            return hashTags
    }
async function uploadPic(file,postId){
        const formData = new FormData();
        formData.append("file",file) 
        const requestOptions = {
            mode: 'cors',
            method: 'PUT',
            headers: {
                "Token": localStorage.getItem("Token"),
            },
            body:formData
        };
        let link = await fetch("/uploadPostPic/"+postId, requestOptions)
            .then(response => response.json())
            .then((result) => {
                return result.pics
              })
        return link
      
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
          marginLeft:'auto',
          marginTop:'60px',
          width:'60vw'
      },
      grid:{
          flexGrow:1,
      },
      avatar:{
          display:"block",
          margin: "auto",
      },
      input:{
          color:"white",
          fontSize:`20px`
      },
      button:{
          float:"right",
          marginTop:`-3px`,
          margin: theme.spacing(3, 0, 2),
          marginRight:`10px`
      },
      imageUploadIcon:{
        marginTop:`-10px`,
      },
      imageGrid:{
        maxHeight:"100%",
        maxWidth:"100%"
    },
      cover: {
        width: 151,
      },
      center:{
        margin:"auto",
        width: theme.spacing(7),
        height: theme.spacing(7),
      },
      hashTags:{
        color:"blue"
      },
      gridList: {
        maxHeight: 500,
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
      },
      titleBar: {
        background:
          'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
          'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
      },
      icon: {
        color: 'white',
      },
      uploadingArea:{
          marginLeft:`10px`,
          marginRight:`10px`
      }

});

const hash = /(?:\s|^)?#[A-Za-z0-9\-\.\_]+(?:\s|$)/g

export class UploadPost extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            uploadInput:"",
            errorText:"",
            profileLink:"",
            newPost:null,
            tags:[],
            images:[],
            imageSrc:[],
    
        }

    }
    

    render(){
        const {user,firstName,lastName, profileLink, component} = this.props;
        const {classes} = this.props;

        const handleInput=(field)=>{
            const value = field.value;
            const name = field.name;
            this.setState({
                [name]:value
            })
        }
        const handleHashTag = (content) =>{
            if(content.match(hash) !== null){
                const tags = content.match(hash).map((tag) => tag.split("#")[1])
                this.setState({
                tags:tags
            })
            }
            
        }
        const handleSubmit = async () =>{
            if(this.state.uploadInput.length === 0){
                /*handling if user uploading post with empty content, will occur error message*/
                handleInputEmpty();
            }
            else{
                component.setState({
                    loading:true
                })
                const today = new Date();
                const date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
                handleHashTag(this.state.uploadInput)
                const newPost = await addPost(this.state.uploadInput,user.email,date)
                const tags = await addHashTags(this.state.tags, newPost.postId)
                this.setState({
                    tags:tags,
                })
                await Promise.all(this.state.images.map(async(img)=>{
                    const link = await uploadPic(img, newPost.postId)
                }))
                const posts = await reloadPost()
                component.setState({
                    loading:false,
                    posts:posts
                })
                reset()
                
                
            }
        }
        const reset = () =>{
            this.setState({
                uploadInput:"",
                errorText:"",
                tags:[],
                images:[],
                imageSrc:[]
            })
        }
        const handleInputEmpty = ()=>{
           this.setState({
               errorText:"Could not upload post with empty content"
           })
        }

    const fileSelectHandler = (e) =>{
        if (e.target.files) {
            const files = Array.from(e.target.files);
            this.setState({images: [
                ...this.state.images,
                ...files
              ]});
            Promise.all(files.map(file => {
                return (new Promise((resolve,reject) => {
                    const reader = new FileReader();
                    reader.addEventListener('load', (ev) => {
                        resolve(ev.target.result);
                    });
                    reader.addEventListener('error', reject);
                    reader.readAsDataURL(file);
                }));
            }))
            .then(images => {
                this.setState({ imageSrc :[
                    ...this.state.imageSrc,
                    ...images
                  ]})
    
            }, error => {        
                console.error(error);
            });
        }
    }
    const handleDeleteImg = (index,imageURL, e)=>{
        const imageFile = this.state.images[index]
        const filteredSrc = this.state.imageSrc.filter(url =>{
            return url !== imageURL;
        });
        const filtered = this.state.images.filter(img =>{
            return img !== imageFile;
        });

        this.setState({
            images:filtered,
            imageSrc:filteredSrc
        })
    }
        return(
            <Container className = {classes.container}>
                <div>
                <form  className = {classes.root} noValidate autoComplete = "off">
                <div>
                    <Grid className = {classes.grid} container spacing={1}>
                        <Grid item >
                            <a href="/profile">
                                <Avatar className={classes.center} alt="user profile" src={profileLink} />
                                <Typography align='center' className={classes.center} >{firstName + " " + lastName}</Typography>
                            </a>                      
                        </Grid>
                        <Grid item xs>
                            <Card>
                                <CardContent>
                                <TextField 
                                error ={this.state.errorText.length === 0 ? false : true }
                                id = "standard-multiline-static"
                                multiline
                                name = "uploadInput"
                                value={this.state.uploadInput}
                                onChange={e => handleInput(e.target)}
                                placeholder="What's in your mind?"
                                InputProps={
                                    {className: classes.input}
                                }
                                helperText={this.state.errorText}
                                >
                                </TextField>
                                </CardContent>
                                <div className = {classes.uploadingArea}>
                                {this.state.imageSrc.length == 0
                                ?<div></div>
                                : 
                                    <GridList cellHeight={200} spacing={2} className={classes.gridList} cols={2}>
                                    {this.state.imageSrc.map((imageURL, index) => (
                                    <GridListTile cols={1} >
                                        <img  src={imageURL} className = {classes.imageGrid}/>
                                    <GridListTileBar
                                        titlePosition="top"
                                        actionIcon={
                                            <IconButton className={classes.icon} onClick = {e => handleDeleteImg(index, imageURL,e)}>
                                            <CloseIcon />
                                            </IconButton>
                                        }
                                        actionPosition="right"
                                        className={classes.titleBar}
                                        />
                                    </GridListTile>
                                ))}
                                  </GridList>
                                }                           
                                
                                    <input
                                        accept="image/*"
                                        hidden
                                        id="icon-button-file"
                                        multiple
                                        type="file"
                                        onChange={e=>fileSelectHandler(e)}
                                    />
                                    <label htmlFor="icon-button-file">
                                        <IconButton className = {classes.imageUploadIcon}  component="span">
                                            <ImageOutlinedIcon
                                            color="primary"
                                            fontSize="large"
                                            />
                                        </IconButton>
                                    </label>
                                    
                                
                                <Button 
                                        className ={classes.button}
                                        variant="contained" 
                                        color="primary"
                                        onClick={e=>handleSubmit()}
                                    >
                                        Submit
                                </Button>
                                </div>
                            </Card>
                        </Grid>
                    
                    </Grid>
                    
                </div>
            </form>
                </div>
                
            </Container>
        );
    }
}
export default withStyles(styles)(UploadPost);
