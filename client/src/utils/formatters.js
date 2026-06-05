import dayjs from 'dayjs';

export const formatCurrency = (amount) => {
  if (amount == null) return '0 UZS';
  return `${Number(amount).toLocaleString('uz-UZ')} UZS`;
};

export const formatDate = (date) => {
  if (!date) return '-';
  return dayjs(date).format('DD.MM.YYYY');
};

export const formatMonth = (month) => {
  if (!month) return '-';
  const [year, m] = month.split('-');
  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
  ];
  return `${months[parseInt(m, 10) - 1]} ${year}`;
};

export const statusLabels = {
  active: 'Faol',
  inactive: 'Nofaol',
  graduated: 'Bitirgan',
  archived: 'Arxiv',
  paid: 'To\'langan',
  unpaid: 'To\'lanmagan',
  partial: 'Qisman',
  present: 'Kelgan',
  absent: 'Kelmagan',
  late: 'Kechikkan',
  excused: 'Sababli',
  completed: 'Yakunlangan',
  paused: 'To\'xtatilgan',
  cash: 'Naqd',
  card: 'Karta',
  transfer: 'O\'tkazma',
  male: 'Erkak',
  female: 'Ayol',
  test: 'Test',
  homework: 'Uy vazifasi',
  oral: 'Og\'zaki',
  midterm: 'Oraliq',
  final: 'Yakuniy',
};

export const statusColors = {
  active: 'green',
  inactive: 'default',
  graduated: 'blue',
  archived: 'default',
  paid: 'green',
  unpaid: 'red',
  partial: 'orange',
  present: 'green',
  absent: 'red',
  late: 'orange',
  excused: 'blue',
  completed: 'default',
  paused: 'gold',
};

export const languageColors = {
  English: '#1677ff',
  Russian: '#52c41a',
  Chinese: '#fa8c16',
};
