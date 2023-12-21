import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import Chart, { useChart } from 'src/components/chart';
import { customShadows } from 'src/theme/custom-shadows';
import { getDateTime, getListYear, months } from 'src/utils/format-time';
import { fNumber } from 'src/utils/format-number';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { statistiqueService } from 'src/apis/statistique-service';

const series = [
  {
    name: 'Doanh thu',
    type: 'column',
    fill: 'gradient',
  },
];

export default function AppWebsiteVisits({ title, subheader, chart, ...other }) {
  const { labels, colors, options } = chart;
  const shadow = customShadows();
  const listYear = getListYear();
  const [year, setYear] = useState(getDateTime.currentYear);
  const [totalAmountRevenue, setTotalAmountRevenue] = useState([]);

  const getTotalAmountRevenue = async (value, setValue) => {
    try {
      const { data } = await statistiqueService.getTotalAmountRevenue(value);
      setValue(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeSelectYear = (event) => {
    setYear(event.target.value);
  };

  useEffect(() => {
    getTotalAmountRevenue({ year }, setTotalAmountRevenue);
  }, [year]);

  const chartOptions = useChart({
    colors,
    plotOptions: {
      bar: {
        columnWidth: '60%',
        endingShape: 'rounded',
        horizontal: false,
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    yaxis: {
      title: {
        text: 'VNĐ (Việt Nam đồng)',
      },
    },
    fill: {
      type: series.map((i) => i.fill),
    },
    labels,
    xaxis: {
      categories: months,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return `${fNumber(value)} đ`;
          }
          return value;
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other} sx={{ boxShadow: shadow.cards, width: 1 }}>
      <CardHeader title={`${title}${year}`} subheader={subheader} />
      <Box width={1} display="flex" justifyContent="flex-end" pr={3}>
        <FormControl size="small" sx={{ width: 100 }}>
          <InputLabel sx={{ fontSize: 13 }}>Năm</InputLabel>
          <Select value={year} label="Năm" sx={{ fontSize: 13 }} onChange={handleChangeSelectYear}>
            {listYear.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          dir="ltr"
          type="line"
          series={series.map((item) => ({ ...item, data: totalAmountRevenue }))}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}

AppWebsiteVisits.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
