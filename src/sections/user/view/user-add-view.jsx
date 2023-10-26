import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { FormInfoUser } from '../form-add-user';

export default function AddUserPage() {
  return (
    <Container>
      <Typography variant="h4">Add New User</Typography>
      <FormInfoUser />
    </Container>
  );
}
