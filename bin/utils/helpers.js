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

const wordingTotalExpensesInWeek = (startDate, endDate, total) => {
  const data = [
    {
      'title': 'Uang Jebol Minggu Ini 💸',
      'description': `Eh, bro! Total pengeluaran kita minggu ini, mulai dari ${startDate}, sampe ${endDate}, udah mencapai ${total}! Kereenn! 💸`,
    },
    {
      'title': 'Total Pengeluaran Minggu Ini 💸',
      'description': `Jadi nih, total pengeluaran lo dari ${startDate} sampe ${endDate} segede ${total}. Ciee yang boros! 😅`,
    },
    {
      'title': 'Aduh! Total Uang Melayang Minggu Ini 💸',
      'description': `Bro, total uang yang kamu keluar dari ${startDate} sampe ${endDate} itu sebanyak ${total}! 💰`,
    },
    {
      'title': 'Uang Jajan Melejit! 🚀',
      'description': `Ciee yang lagi jajan-jajan nih! Total pengeluaran buat jajan dari minggu lalu sampe sekarang udah nyampe ${total}! 💸`,
    },
    {
      'title': 'Abis Ngebooming Banget Minggu Ini! 💸',
      'description': `Bro, total pengeluaran lo dari ${startDate} sampe ${endDate} itu lho, ngeri juga, gak nyadar abis ${total}! 😱`,
    },
  ];

  return data[Math.floor(Math.random()*data.length)];
};

const wordingMostCategories = (category, total) => {
  const data = [];

  switch (category.toLowerCase()) {
    case 'food' || 'makanan':
      data.push(
          {
            title: 'Makan Terus Bro! 🍔',
            description: `Gila, pengeluaran terbanyak kita di kategori makanan (${category}) nih, tembus ${total}! Kayaknya kita doyan makan ya, ga nahan godaan kuliner! 🍕🍟`,
          },
          {
            title: 'Borosnya di Kategori Makanan! 🍔',
            description: `Eh, lo tau ga? Pengeluaran terbanyak lo ada di kategori Makanan nih, abisnya ${total}. Ga bisa nahan godaan nasi goreng kali ya! 🤤`,
          },
          {
            title: 'Makanan Jadi Kunci Kategori 🍔',
            description: `Gokil, nih! Pengeluaran terbanyak kamu ada di kategori makanan dan Minuman, Habis ${total} buat makan-makan nich! 🍽️💸.`,
          },
          {
            title: 'Goyang Lidah! 🍜🤑',
            description: `Ngiler abis liat tagihan, duit terbanyak terbang buat makanan! Total abis ${category} 😋💸`,
          },
      );
      break;
    case 'belanja':
      data.push(
          {
            title: 'Belanja terusss 💸',
            description: `Kamu udah mengeluarkan sejumlah Rp. 178.500 buat Belanja selama seminggu terakhir 😅`,
          },
          {
            title: 'Gila Shopping Banget! 🛍️',
            description: `Nih loh, uang terbanyak habis di mana? Yap, di belanjaan! Kamu ngeluarin ${total} buat shopping! 💳`,
          },
          {
            title: 'Ngeborong Banget! 💸💳',
            description: `Uang jajan abis gara-gara belanja! Total boros di kategori Belanja nih, abis ${total} 😱🛍️`,
          },
          {
            title: 'Gaspol Belanja Teruss! 🚀',
            description: `Lu abis ngeluarin duit banyak banget nih, mostly buat belanja. Total damage di kategori Belanja sampe ${total}, padahal udah niat hemat! 😅💸`,
          },
          {
            title: 'Ampun Dah! 💸🔥',
            description: `Gak nyangka, paling banyak ngeluarin duit buat belanja! Total abis ${total}, uangnya nyusut kayak es krim di terik matahari. 😱🛍️ #ShopaholicLife`,
          },
      );
      break;
    case 'hiburan':
      data.push(
          {
            title: 'Nge-Booming di Kategori Hiburan! 🚀',
            description: `Cuy, total pengeluaran lo di kategori Hiburan tuh capai ${total}! 😲 Sumpah, seru banget nih! Jalan-jalan terusss 🌴🏔️💸`,
          },
          {
            title: 'Liburan teruss nihhhh 💸💸',
            description: `Nih loh, uang terbanyak habis di mana? Yap, di hiburan! Kamu ngeluarin ${total} buat kategori hiburan! 💳`,
          },
          {
            title: 'Ampun Dah! 💸🔥',
            description: `Gak nyangka, paling banyak ngeluarin duit buat hiburan! Total abis ${total}, uangnya nyusut kayak es krim di terik matahari. 😱🛍️`,
          },
      );
      break;
    default:
      return;
  }

  return data[Math.floor(Math.random()*data.length)];
};

const wordingDayMostExpenses = (day, total) => {
  const data = [
    {
      'title': 'Rekor Terpecahkan! 💥',
      'description': `Bro, minggu ini kita bikin rekor baru, nih! Pada tanggal ${day}, pengeluaran kita mencapai ${total}! Rekor terpecahkan, jangan sampe minggu depan lebih gila lagi! 🚀`,
    },
    {
      'title': 'Rekor Boros Minggu Ini 📆',
      'description': `Puncaknya, lo banget nih! Pengeluaran terbanyak dalam sejarah minggu ini terjadi pada tanggal ${day}, dan totalnya mencapai ${total}. Ada apa tuh pas tanggal segitu? 🤔`,
    },
    {
      'title': 'Rekor Pecah! 💥',
      'description': `Hari ${day}, jadi hari paling boros buat kamu. Duit yang habis cuma buat tanggal segitu, sebesar ${total}. 😱`,
    },
    {
      'title': `Pecah Rekor Abis di Tanggal${day}! 📅`,
      'description': `Eh, tanggal ${day} lo sampe keluarin duit segede itu, ${total}! Ada apa sih hari itu? 🤨`,
    },
  ];

  return data[Math.floor(Math.random()*data.length)];
};

const wordingPrediction = (predict, total) => {
  const data = [];
  switch (predict.toLowerCase()) {
    case 'naik':
      data.push(
          {
            'title': 'Prediksi Masa Depan 💭',
            'description': `Nih, prediksi buat minggu depan: kabar baiknya atau mungkin juga buruk, kita bakal lebih ngabisin uang. Prediksinya sih sekitar ${total}. Siap-siap nabung ekstra buat menghadapi badai pengeluaran! 💰😅`,
          },
          {
            'title': 'Prediksi Boros Minggu Depan! 🚀',
            'description': `Nih prediksi buat minggu depan, katanya lo bakal makin boros. Prediksi total pengeluaran sekitar ${total}! Hemat dikit dong, ntar kantong bolong nih! 😜💸`,
          },
          {
            'title': 'Prediksi Boros Minggu Depan! 🚀',
            'description': `Nih prediksi buat minggu depan, katanya lo bakal makin boros. Prediksi total pengeluaran sekitar ${total}! Hemat dikit dong, ntar kantong bolong nih! 😜💸`,
          },
          {
            'title': 'Prediksi Nabrak Lagi! 💸',
            'description': `Minggu depan diprediksi total pengeluaran lu bakal naik, sekitar ${total}. Get ready! 💪`,
          },
          {
            'title': 'Nabung? Apa Itu? 🚀💸',
            'description': `Buat minggu depan, prediksinya lo bakal naik lagi, bro! Total pengeluaran prediksi sampe ${total}! Mending mulai nabung atau terusin jadi pemboros? 😂💰`,
          },
      );
      break;
    case 'turun':
      data.push(
          {
            'title': 'Kabar Gembira! Prediksi Turun, Bro! 🎉🔽',
            'description': `Gengs, minggu depan sepertinya ada harapan pengeluaran kamu bakal turun nih! Prediksinya sekitar ${total}. Wah, mungkin bisa lebih hemat buat yang lain deh! 💪🤑, Tapiii Jangan Lupa tetep Nabung yachh!!`,
          },
          {
            'title': 'Good News, Bro! 🎉🔽',
            'description': `Kabar gembira nih! Minggu depan sepertinya ada harapan pengeluaran kamu bakal turun, prediksinya sekitar ${total}. Mantap kan! Bisa lebih hemat buat yang lain, tapi tetep jangan lupa nabung yachh! 🔥🚀`,
          },
          {
            'title': 'Yeay, Kabar Baik, Bro! 🎉🔽',
            'description': `Brosis, minggu depan prediksinya pengeluaran lo turun nih, sekitar ${total}. Hemat buat yang lain, tapi tetep jangan lupa nabung yach! 💪🤑 `,
          },
      );
      break;

    default:
      return;
  }

  return data[Math.floor(Math.random()*data.length)];
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

module.exports = {
  formatToRupiah,
  formatDateToID,
  wordingTotalExpensesInWeek,
  wordingMostCategories,
  wordingDayMostExpenses,
  wordingPrediction,
  shuffle,
};
