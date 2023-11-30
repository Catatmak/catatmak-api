/* eslint-disable require-jsdoc */
function formatToRupiah(angka) {
  const formattedAngka = parseInt(angka).toLocaleString('id-ID');

  return `Rp. ${formattedAngka}`;
}

module.exports = {
  formatToRupiah,
};
