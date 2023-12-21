import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chart, { useChart } from 'src/components/chart';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { GenerateDayInMonth, getDateTime, getListMonth, getListYear } from 'src/utils/format-time';
import { useEffect, useState } from 'react';
import { statistiqueService } from 'src/apis/statistique-service';
import { customShadows } from 'src/theme/custom-shadows';

export default function AppConversionRates({ title, subheader, chart, ...other }) {
  const { colors, options } = chart;
  const listYear = getListYear();
  const listMonth = getListMonth();
  const [year, setYear] = useState(getDateTime.currentYear);
  const [month, setMonth] = useState(getDateTime.currentMonth);
  const [data, setData] = useState([]);
  const shadow = customShadows();

  const chartSeries = data.map((i) => i.count_orders);
  const totalOrder = data.reduce((acc, cur) => {
    return acc + Number(cur.count_orders);
  }, 0);

  const handleChangeSelectYear = (event) => {
    setYear(event.target.value);
  };

  const handleChangeSelectMonth = (event) => {
    setMonth(event.target.value);
  };

  const handleCountOrder = async () => {
    const { data } = await statistiqueService.CountOrderMonthOfYear({ year, month });
    if (data.data) {
      setData(data.data);
    }
  };

  useEffect(() => {
    handleCountOrder();
  }, [year, month]);

  const chartOptions = useChart({
    colors,
    tooltip: {
      shared: true,
      intersect: false,
      x: {
        formatter: (value) => `Ngày ${value}`,
      },
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return `${value} đơn hàng`;
          }
          return value;
        },
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: ['transparent'],
    },
    fill: {
      type: [{ fill: 'line' }],
    },
    yaxis: {
      title: {
        text: `Số lượng đơn hàng trong tháng ${month}`,
      },
    },
    plotOptions: {
      chart: {
        type: 'line',
        height: 350,
      },
    },
    markers: {
      size: 3,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      categories: GenerateDayInMonth(),
    },
    ...options,
  });

  return (
    <Card {...other} sx={{ boxShadow: shadow.cards }}>
      <CardHeader title={`${title}${month}`} subheader={`Đơn hàng đã được đặt: ${totalOrder}`} />

      <Box sx={{ mx: 3 }}>
        <Box width={1} display="flex" justifyContent="flex-end" pr={3} gap={3}>
          <FormControl size="small" sx={{ width: 100 }}>
            <InputLabel sx={{ fontSize: 13 }}>Tháng</InputLabel>
            <Select
              value={month}
              label="Tháng"
              sx={{ fontSize: 13 }}
              onChange={handleChangeSelectMonth}
            >
              {listMonth.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ width: 100 }}>
            <InputLabel sx={{ fontSize: 13 }}>Năm</InputLabel>
            <Select
              value={year}
              label="Năm"
              sx={{ fontSize: 13 }}
              onChange={handleChangeSelectYear}
            >
              {listYear.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Chart
          dir="ltr"
          type="line"
          series={[
            {
              data: chartSeries,
              name: `Tháng ${month}`,
              type: 'line',
              fill: 'solid',
              color: '#212b36',
            },
          ]}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}

AppConversionRates.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
