import { Box, styled } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import Iconify from 'src/components/iconify';

function DatePickerIcon() {
  return <Iconify icon="lets-icons:date-today-duotone" width={24} />;
}

export default function OrderTableDate({ handleToDay, handleFromDay }) {
  return (
    <Box p="12px 24px" display="flex" gap={2}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DemoContainer components={['DatePicker']}>
          <StyledDatePicker
            onChange={(date) => handleFromDay(date)}
            slots={{
              openPickerIcon: DatePickerIcon,
            }}
            sx={{ width: '100%' }}
            label="Ngày bắt đầu"
            name="from_day"
          />
        </DemoContainer>
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DemoContainer components={['DatePicker']}>
          <StyledDatePicker
            onChange={(date) => handleToDay(date)}
            slots={{
              openPickerIcon: DatePickerIcon,
            }}
            sx={{ width: '100%' }}
            label="Ngày kết thúc"
            name="to_day"
          />
        </DemoContainer>
      </LocalizationProvider>
    </Box>
  );
}
const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  '& .MuiInputBase-root': {
    fontSize: 13,
  },
  '& .MuiFormLabel-root': {
    fontSize: 13,
  },
}));
