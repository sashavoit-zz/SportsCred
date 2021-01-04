import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Modal from 'react-modal';
import DualTrivia from './DualTrivia';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
}));

const customStyles = {
    content : {
      marginLeft: '215px',
      marginTop: '64px'
    }
  };

export default function InviteButton(props){
    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    };
    
    function closeModal() {
        setIsOpen(false);

        const requestOptionsLeaveRoom = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Token": localStorage.getItem("Token")
            }
        };

        fetch('multiplayerTrivia/left', requestOptionsLeaveRoom);
    };

    function handleClick(email) {
        //TODO: CREATE A POPUP WINDOW HERE
        openModal();

        const requestOptionsJoinRoom = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Token": localStorage.getItem("Token")
            },
            body: JSON.stringify({
                anotherPlayer: email
            }),
        };

        fetch('multiplayerTrivia/joined', requestOptionsJoinRoom);

        console.log("BOO")
        const requestOptionsInvite = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Token": localStorage.getItem("Token")
            },
            body: JSON.stringify({
                to: email
            }),
        };
    
        fetch('/notifs/addInvitation', requestOptionsInvite);
    };

    return (
        <>
            <IconButton onClick={() => {handleClick(props.email)}}>
                <SportsEsportsIcon />
            </IconButton>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel="Example modal" overlayClassName="Overlay">
                <button onClick={closeModal}>Exit game</button>
                <DualTrivia userType="0" opponentName = {props.email}></DualTrivia>
            </Modal>
        </>
    )
}