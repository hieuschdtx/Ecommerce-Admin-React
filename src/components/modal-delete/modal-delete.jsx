import { Box, Button, Container, Grid, IconButton, Modal, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from '../iconify';
import { CustomButton } from 'src/theme/styled';
import { info, primary } from 'src/theme/palette';
import { useResponsive } from 'src/hooks/use-responsive';

export default function ModalDelete({ open, handleClose, handleAccept }) {
  const mdUp = useResponsive('up', 'md');

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: '16px',
    p: 3,
    width: mdUp ? '30%' : '40%',
  };

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
        <Typography variant="subtitle2" fontSize={18} mb={2}>
          Bạn chắc chắn muốn xóa?
        </Typography>
        <Box>
          <Stack direction="column" spacing={2}>
            <Stack direction={mdUp ? 'row' : 'column'} spacing={2} justifyContent={'space-between'}>
              <CustomButton
                variant="contained"
                colors={primary.primary}
                type="button"
                padding="8px 32px"
                onClick={handleAcceptModal}
              >
                Đồng ý
              </CustomButton>
              <CustomButton
                colors={info.main}
                type="button"
                padding="8px 32px"
                onClick={handleCloseModal}
              >
                Trở lại
              </CustomButton>
            </Stack>
          </Stack>
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
