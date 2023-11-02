import { Box, Button, Container, Grid, IconButton, Modal, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from '../iconify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius: '16px',
  p: 3,
  width: '25%',
};

export default function ModalDelete({ open, handleClose, handleAccept }) {
  const handleCloseModal = () => {
    handleClose();
  };
  const handleAcceptModal = () => {
    handleClose();
    handleAccept();
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container sx={style}>
        <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 4, right: 4 }}>
          <Iconify icon="iconamoon:close" width={24} height={24} />
        </IconButton>
        <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
          Bạn chắc chắn muốn xóa?
        </Typography>
        <Box>
          <Grid direction="row" container spacing={2}>
            <Grid item xs={12} sm={6} sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="error"
                type="button"
                sx={{ width: '100px' }}
                onClick={handleAcceptModal}
              >
                Ok
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="info"
                type="button"
                sx={{ width: '100px' }}
                onClick={handleCloseModal}
              >
                Cancle
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Modal>
  );
}
ModalDelete.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleAccept: PropTypes.func,
};
