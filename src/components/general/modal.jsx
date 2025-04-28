import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
  borderRadius: 2,
  width: {xs:'100%', lg: 'auto'}
};

const CustomModal = ({openModal, onClose, title, children, ...props}) => {
  return(
    <Modal open={openModal} onClose={onClose} {...props}>
      <Box sx={modalStyle}>
        <Typography variant="h6">{title}</Typography>
        {children}
      </Box>
    </Modal>
  )
}

export default CustomModal;