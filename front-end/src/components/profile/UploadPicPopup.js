import React from 'react'
import { Dialog, DialogTitle, DialogContent, makeStyles,Grid, Button, Avatar, IconButton, DialogActions, Typography} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
    dialogWrapper: {
        padding: theme.spacing(2),
        position: 'absolute',
        top: theme.spacing(5)
    },
    dialogTitle: {
        paddingRight: '0px'
    },
    avatar:{
        height:"40vh",
        width:"40vh"
    }
}))

export default function UploadPicPopup(props) {

    const { profilePage, email} = props;
    const [previewSrc, setPreviewSrc] = React.useState({...props.src});
    React.useEffect(() => {
        setPreviewSrc(props.src);
    }, [props.src])
    const [image, setImage] = React.useState([]);
    const classes = useStyles();
    
    const uploadProfile = (file,email)=>{
        const formData = new FormData();
        formData.append("file",file)
        formData.append("email",email) 
        const requestOptions = {
            mode: 'cors',
            method: 'POST',
            headers: {
                "Token": localStorage.getItem("Token"),
            },
            body:formData
        };
        fetch("/uploadProfilePic", requestOptions)
            .then(response => response.json())
            .then((result) => {
                profilePage.setState({profileLink:result.link})
              })
        setPreviewSrc(profilePage.state.profileLink)
      
    }


    const fileSelectHandler = (event) =>{
        setImage(event.target.files[0]);
        const reader = new FileReader();
        reader.onload = () =>{
            if(reader.readyState === 2){
                setPreviewSrc(reader.result)
                
            }
        }
        reader.readAsDataURL(event.target.files[0])
    }

    const cancleUpload = () => {
        setImage(null);
        setPreviewSrc(profilePage.state.profileLink)
        profilePage.setState({openPopup:false})
    }

    const u = !profilePage.state.uploaded
    return (
        <Dialog open={profilePage.state.openPopup} maxWidth="md" classes={{ paper: classes.dialogWrapper }}>
            <DialogTitle className={classes.dialogTitle}>
                <div style={{ display: 'flex' }}>
                    <Grid container justify="flex-end">
                        <Button
                            color="secondary"
                            onClick = {cancleUpload}
                            className={classes.closeIcon}>
                            <CloseIcon />
                        </Button>
                    </Grid>
                </div>
            </DialogTitle>
            <DialogContent >
                <input
                    accept="image/*"
                    hidden
                    id="icon-button-file"
                    type="file"
                    onChange={fileSelectHandler}
                />
                <label htmlFor="icon-button-file">
                    <IconButton aria-label="upload picture" component="span">
                        <Avatar src={previewSrc} className={classes.avatar} />
                    </IconButton>
                </label>
                <DialogActions>
                <Button
                    variant="contained" 
                    color = "primary"
                    size = "medium"
                    onClick = {() =>{
                                        uploadProfile(image, email);
                                        profilePage.setState({openPopup:false});
                                    }           
                              }
                              
                >
                    Upload
                </Button>
                <Button
                    variant="contained" 
                    color = "secondary"
                    size = "medium"
                    onClick = {cancleUpload}
                >
                    Cancel
                </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    ) 
}
