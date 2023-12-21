import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import { styled, useTheme } from '@mui/material/styles';
import { fNumber } from 'src/utils/format-number';
import Chart, { useChart } from 'src/components/chart';
import { useEffect, useState } from 'react';
import { statistiqueService } from 'src/apis/statistique-service';
import { customShadows } from 'src/theme/custom-shadows';

const CHART_HEIGHT = 400;
const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

export default function AppCurrentVisits({ title, subheader, chart, ...other }) {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const shadow = customShadows();

  const { colors, options } = chart;
  const chartSeries = data.map((i) => i.product_count);
  const handleGetCountOrderProduct = async () => {
    const { data } = await statistiqueService.getCountOrderProductByProcategory();
    if (data.data) {
      setData(data.data);
    }
  };

  useEffect(() => {
    handleGetCountOrderProduct();
  }, []);

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors,
    labels: data.map((i) => i.category_name),
    stroke: {
      colors: [theme.palette.background.paper],
    },
    legend: {
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: () => `Số lượng đặt hàng: `,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other} sx={{ boxShadow: shadow.cards }}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 5 }} />

      <StyledChart
        dir="ltr"
        type="pie"
        series={chartSeries}
        options={chartOptions}
        width="100%"
        height={280}
      />
    </Card>
  );
}

AppCurrentVisits.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
