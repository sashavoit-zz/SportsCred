import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';


export default function FormDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Typography onClick={handleClickOpen} variant="h5">
        Change Password
      </Typography>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Change Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the password? by doing this you will be logout.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="currPassword"
            label="Current Password"
            type="password"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="newPassword"
            label="New Passowrd"
            type="password"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="reNewPassword"
            label="Repeat New Passowrd"
            type="password"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Conform
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
