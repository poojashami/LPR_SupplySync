const formatNumber = (num) => {
  const noDecimalNo = num.toString().split('.');
  if (noDecimalNo.length > 1) {
    return `${noDecimalNo[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${noDecimalNo[1]}`;
  } else return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export default formatNumber;
