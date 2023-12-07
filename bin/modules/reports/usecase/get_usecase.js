/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const wrapper = require('../../../utils/wrapper');
const {decryptDataAES256Cbc} = require('../../../utils/crypsi');

class GetClass {
  async getFinancialChartByDate(payload) {
    try {
      const {phone} = payload.auth.credentials;
      const collection = payload.mongo.db.collection('financials');

      const pipeline = [];

      const startOfMonth = new Date();
      startOfMonth.setDate(1); // Set to the first day of the month
      startOfMonth.setHours(0, 1, 0, 0); // Set to 00:01

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(startOfMonth.getMonth() + 1); // Set to the first day of the next month
      endOfMonth.setHours(0, 0, 0, 0); // Set to 00:00

      pipeline.push(
          {
            $match: {
              phone,
              created_at: {
                $gte: startOfMonth,
                $lt: endOfMonth,
              },
            },
          },
          {
            $match: {type: 'outcome'},
          },
          {
            $addFields: {
              adjustedDate: {
                $add: ['$created_at', 7 * 60 * 60 * 1000], // Menambahkan 7 jam dalam milidetik
              },
            },
          },
          {
            $project: {
              _id: 0,
              date: {$dateToString: {format: '%Y-%m-%d', date: '$adjustedDate'}},
              price: '$price',
            },
          },
      );

      const data = await collection.aggregate(pipeline).toArray();

      if (data.length < 1) {
        return wrapper.data({
          status: false,
          message: 'Chart data not available',
          data: {
            id: 'upss',
            color: 'hsl(150, 70%, 50%)',
            data: [],
          },
        }, 'success get financials', 404);
      }

      const groupedData = {};

      // Loop melalui dokumen dan melakukan pengelompokkan
      data.forEach((doc) => {
        let {date, price} = doc;

        // date = formatDateToID(date);
        price = decryptDataAES256Cbc(price);
        price = parseInt(price);

        if (!groupedData[date]) {
          groupedData[date] = {
            totalOutcomePerDay: 0,
            totalQuantityPerDay: 0,
          };
        }

        groupedData[date].totalOutcomePerDay += price;
        groupedData[date].totalQuantityPerDay += 1;
      });

      // Mengonversi objek hasil pengelompokkan menjadi array
      const finalResult = Object.entries(groupedData).map(([date, {totalOutcomePerDay, totalQuantityPerDay}]) => ({
        x: date,
        y: totalOutcomePerDay,
        z: totalQuantityPerDay,
      }));

      finalResult.sort((a, b) => new Date(b.x) - new Date(a.x));

      return wrapper.data(finalResult, 'success get financials', 200);
    } catch (error) {
      console.log(error);
      return wrapper.data(error, 'Gagal mengambil data buku', 500);
    }
  }

  async getFinancialChartByType(payload) {
    try {
      const {phone} = payload.auth.credentials;
      const collection = payload.mongo.db.collection('financials');

      const pipeline = [];

      const startOfMonth = new Date();
      startOfMonth.setDate(1); // Set to the first day of the month
      startOfMonth.setHours(0, 1, 0, 0); // Set to 00:01

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(startOfMonth.getMonth() + 1); // Set to the first day of the next month
      endOfMonth.setHours(0, 0, 0, 0); // Set to 00:00

      pipeline.push(
          {
            $match: {
              phone,
              created_at: {
                $gte: startOfMonth,
                $lt: endOfMonth,
              },
            },
          },
          {
            $addFields: {
              adjustedDate: {
                $add: ['$created_at', 7 * 60 * 60 * 1000], // Menambahkan 7 jam dalam milidetik
              },
            },
          },
          {
            $project: {
              _id: 0,
              date: {$dateToString: {format: '%Y-%m-%d', date: '$adjustedDate'}},
              price: '$price',
              type: '$type',
            },
          },
      );

      const data = await collection.aggregate(pipeline).toArray();

      if (data.length < 1) {
        return wrapper.data({
          status: false,
          message: 'Chart data not available',
          data: {
            id: 'upss',
            color: 'hsl(150, 70%, 50%)',
            data: [],
          },
        }, 'success get financials', 404);
      }

      const result = [];

      // Group the data by date and type
      const groupedData = data.reduce((acc, entry) => {
        const key = entry.type;
        acc[key] = acc[key] || {x: entry.type, y: 0, z: 0};
        acc[key].z += 1; // Increment count
        acc[key].y += parseInt(decryptDataAES256Cbc(entry.price)); // Add price (assuming it's hexadecimal)
        return acc;
      }, {});

      // Convert the grouped data into the desired format
      for (const key in groupedData) {
        result.push(groupedData[key]);
      }

      // return result;


      return wrapper.data(result, 'success get financials', 200);
    } catch (error) {
      console.log(error);
      return wrapper.data(error, 'Gagal mengambil data buku', 500);
    }
  }
}

module.exports = GetClass;
