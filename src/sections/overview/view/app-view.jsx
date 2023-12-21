import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppConversionRates from '../app-conversion-rates';
import { useDispatch, useSelector } from 'react-redux';
import { statistiqueService } from 'src/apis/statistique-service';
import { GenerateDateTimeInYear, getDateTime } from 'src/utils/format-time';
import { useEffect, useState } from 'react';
import { filterCount } from 'src/sections/oders/filter-order';
import { orderActionThunk } from 'src/redux/actions/order-action';
import { Stack } from '@mui/material';
import AppCurrentVisits from '../app-current-visits';
import { useResponsive } from 'src/hooks/use-responsive';

export default function AppView() {
  const { user } = useSelector((x) => x.rootReducer.user);
  const { orders } = useSelector((x) => x.rootReducer.orders);
  const dispatch = useDispatch();
  const [totalPrevious, setTotalPrevious] = useState(0);
  const [totalCurrent, setTotalCurrent] = useState(0);
  const labels = GenerateDateTimeInYear(new Date().getFullYear());
  const getCountOrder = filterCount({ data: orders, status: 0 });
  const mdUp = useResponsive('up', 'md');

  const getMonthlyRevenue = async (value, setValue) => {
    try {
      const { data } = await statistiqueService.getMonthlyRevenue(value);
      const { totalAmount } = data.data;
      setValue(totalAmount);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(orderActionThunk.GetAllOrder());
  }, []);

  useEffect(() => {
    getMonthlyRevenue(
      {
        month: getDateTime.currentMonth,
        year: getDateTime.currentYear,
      },

      setTotalCurrent
    );

    getMonthlyRevenue(
      {
        month: getDateTime.previousMonth,
        year: getDateTime.previousYear,
      },
      setTotalPrevious
    );
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        {`Xin chào, ${user.full_name}👋`}
      </Typography>

      <Grid container spacing={3}>
        <Stack
          width={1}
          display={'flex'}
          flexDirection={mdUp ? 'row' : 'column'}
          justifyContent="space-between"
          gap={2}
        >
          <AppWidgetSummary
            title={`Doanh thu tháng trước (${getDateTime.previousMonth}/${getDateTime.previousYear})`}
            total={totalPrevious}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />

          <AppWidgetSummary
            title={`Doanh thu tháng hiện tại (${getDateTime.currentMonth}/${getDateTime.currentYear})`}
            total={totalCurrent}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />

          <AppWidgetSummary
            title="Tổng số đơn hàng"
            total={getCountOrder}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Stack>

        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title={`Doanh thu bán hàng trong năm `}
            chart={{
              labels: labels,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits title="Danh mục khách hàng quan tâm" chart={{}} />
        </Grid>

        <Stack width={1}>
          <AppConversionRates
            title="Tỉ lệ đơn hàng trong tháng "
            subheader="(+43%) than last year"
            chart={{}}
          />
        </Stack>
      </Grid>
    </Container>
  );
}
