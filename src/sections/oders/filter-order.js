import { isAfter, isBefore } from 'date-fns';
import { fDateTime } from 'src/utils/format-time';

export function applyFilter({ inputData, comparator, code, selectStatus, fromDay, today }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (selectStatus !== 0) {
    inputData = inputData.filter((order) => order.status === selectStatus);
  }

  if (fromDay && today) {
    inputData = inputData.filter((order) => {
      const targetDate = new Date(order.delivery_date);
      console.log('targetDate', targetDate);
      console.log('fromDay', fromDay);
      console.log(isBefore(today, targetDate));
      if (isAfter(targetDate, fromDay) && isBefore(targetDate, today)) {
        return order;
      }
    });
  }

  if (code) {
    inputData = inputData.filter(
      (order) =>
        order.code.toLowerCase().indexOf(code.toLowerCase()) !== -1 ||
        order.customer_name.toLowerCase().indexOf(code.toLowerCase()) !== -1
    );
  }

  return inputData;
}

export function filterCount({ data, status }) {
  if (status !== 0) {
    const dataFilter = data.filter((item) => item.status === status);
    return dataFilter.length;
  }
  return data.length;
}
