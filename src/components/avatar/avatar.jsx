import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import { primary } from 'src/theme/palette';

const CustomAvatar = ({ fileInputAvatarRef, handleFileChanges, selectedAvatar }) => {
  return (
    <Stack
      sx={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid #d2d2d3',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        maxHeight: '250px',
        flex: 1,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-block',
          borderRadius: '50%',
          width: 150,
          height: 150,
        }}
      >
        <input
          id="avatar_file"
          name="avatar_file"
          type="file"
          ref={fileInputAvatarRef}
          style={{ display: 'none' }}
          onChange={handleFileChanges}
        />

        <Avatar
          variant="circular"
          src={selectedAvatar}
          alt=""
          sx={{
            width: 1,
            height: 1,
            objectFit: 'cover',
          }}
        />
        <Button
          type="button"
          variant="contained"
          sx={{
            position: 'absolute',
            backgroundColor: selectedAvatar ? 'transparent' : primary.main,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            width: 1,
            height: 1,
            fontSize: 32,
            '&:hover': {
              backgroundColor: selectedAvatar ? 'transparent' : primary.main,
            },
          }}
          onClick={() => fileInputAvatarRef.current.click()}
        >
          {selectedAvatar ? ' ' : <i className="bi bi-camera-fill" />}
        </Button>
      </Box>
      <Typography sx={{ textAlign: 'center', fontSize: '12px' }}>
        Allowed *.jpeg, *.jpg, *.png, *.gif max size of 3.1 MB
      </Typography>
    </Stack>
  );
};

export default CustomAvatar;
