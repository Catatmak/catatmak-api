/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
function formatToRupiah(angka) {
  const formattedAngka = parseInt(angka).toLocaleString('id-ID');

  return `Rp. ${formattedAngka}`;
}

function formatDateToID(dateString) {
  console.log(dateString);
  const weekday = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const objDate = new Date(dateString);
  const dayInDate = weekday[objDate.getDay()];

  const [year, month, day] = dateString.split('-');

  return `${dayInDate}, ${day}-${month}-${year}`;
}

module.exports = {
  formatToRupiah,
  formatDateToID,
};
