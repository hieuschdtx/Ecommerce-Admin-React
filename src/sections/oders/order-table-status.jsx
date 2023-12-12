import { Tab, Tabs } from '@mui/material';
import { common } from '@mui/material/colors';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Label from 'src/components/label';
import { statusDefaultValues } from 'src/resources/order';
import { filterCount } from './filter-order';

const RenderNumberOrder = ({ color, isSelected, count }) => {
  return (
    <Label
      variant="filled"
      color={color}
      sx={{
        fontSize: '11px',
        pl: 1.5,
        pr: 1.5,
        width: '10px',
        marginLeft: 1,
        backgroundColor: isSelected ? color : '',
        color: isSelected ? common.white : '',
      }}
    >
      {count}
    </Label>
  );
};

const OrderTableStatus = ({ handleGetStatus }) => {
  const [value, setValue] = useState(0);
  const { orders } = useSelector((x) => x.rootReducer.orders);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    handleGetStatus(newValue);
  };

  const dataRenderStatus = statusDefaultValues.map((item) => {
    let count = filterCount({ data: orders, status: item.value });
    return { ...item, count };
  });

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      sx={{ padding: '12px 24px' }}
      scrollButtons="auto"
      variant="scrollable"
      allowScrollButtonsMobile
      aria-label="scrollable"
    >
      {dataRenderStatus.map((item) => {
        return (
          <Tab
            icon={
              <RenderNumberOrder
                color={item.color}
                isSelected={value === item.value}
                count={item.count}
              />
            }
            sx={{ padding: 0, minHeight: 50, marginRight: '30px' }}
            key={item.value}
            label={item.label}
            value={item.value}
            iconPosition="end"
          />
        );
      })}
    </Tabs>
  );
};

export default OrderTableStatus;
