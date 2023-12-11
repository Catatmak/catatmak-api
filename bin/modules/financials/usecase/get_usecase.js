/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const wrapper = require('../../../utils/wrapper');
const {decryptDataAES256Cbc} = require('../../../utils/crypsi');
const helpers = require('../../../utils/helpers');
const {ObjectId} = require('mongodb');
const {format, parse, isValid, startOfWeek, endOfWeek, isBefore, isAfter, startOfMonth} = require('date-fns');
const idLocale = require('date-fns/locale/id');

class GetClass {
  async getAllFinancials(payload) {
    try {
      const {startDate, endDate, date, type} = payload;
      const {phone} = payload.auth.credentials;
      const collection = payload.mongo.db.collection('financials');

      const pipeline = [];

      const matchStage = {
        $match: {
          phone,
        },
      };

      if (date === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        matchStage.$match.created_at = {
          $gte: today,
          $lt: endOfToday,
        };
      } else if (date === 'weekly' || date === 'daily') {
        const startOfMonth = new Date();
        startOfMonth.setDate(1); // Set to the first day of the month
        startOfMonth.setHours(0, 1, 0, 0); // Set to 00:01

        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(startOfMonth.getMonth() + 1); // Set to the first day of the next month
        endOfMonth.setHours(0, 0, 0, 0); // Set to 00:00

        matchStage.$match.type = type;
        matchStage.$match.created_at = {
          $gte: startOfMonth,
          $lt: endOfMonth,
        };
      } else if (date === 'monthly') {
        const startOfYear = new Date(new Date().getFullYear(), 0, 1); // Set to the first day of the year
        startOfYear.setHours(0, 0, 0, 0);

        const endOfYear = new Date(new Date().getFullYear() + 1, 0, 0); // Set to the last day of the year
        endOfYear.setHours(0, 0, 0, 0);

        matchStage.$match.type = type;
        matchStage.$match.created_at = {
          $gte: startOfYear,
          $lt: endOfYear,
        };
      } else if (date === 'custom' && (startDate || endDate)) {
        const parseDate = (dateString) => {
          const parsedDate = parse(dateString, 'dd-MM-yyyy', new Date());
          return isValid(parsedDate) ? parsedDate : null;
        };

        if (startDate && endDate) {
          pipeline.push({
            $match: {created_at: {$gte: parseDate(startDate), $lt: parseDate(endDate)}},
          });
        }
        matchStage.$match.type = type;
      }

      pipeline.push(matchStage, {
        $sort: {
          created_at: -1,
        },
      });

      const data = await collection.aggregate(pipeline).toArray();

      if (data.length < 1) {
        return wrapper.data([], 'data not found', 200);
      }

      if (date === 'today' || date === 'custom') {
        const result = [];
        let totalOutcomeToday = 0;

        data.map((item) => {
          result.push({
            id: item._id,
            title: decryptDataAES256Cbc(item.title),
            price: helpers.formatToRupiah(decryptDataAES256Cbc(item.price)),
            type: item.type,
            category: item.category ? item.category : 'Tidak Terkategori',
            created_at: item.created_at,
          });

          if (item.type == 'outcome') {
            totalOutcomeToday += parseInt(decryptDataAES256Cbc(item.price));
          }
        });

        const metaData = {
          totalOutcomeToday: helpers.formatToRupiah(totalOutcomeToday),
        };

        return wrapper.data(result, 'success get financials', 200, metaData);
      }

      if (date === 'weekly') {
        const weeklyResults = [];

        data.forEach((transaction) => {
          const transactionDate = new Date(transaction.created_at);

          // Calculate the start and end of the week
          const weekStartDate = startOfWeek(transactionDate, {weekStartsOn: 0}); // Assuming Monday is the first day of the week
          const weekEndDate = endOfWeek(weekStartDate);

          // Format the week start and end dates using date-fns
          const formattedWeekStartDate = format(weekStartDate, 'dd MMMM yyyy', {locale: idLocale});
          const formattedWeekEndDate = format(weekEndDate, 'dd MMMM yyyy', {locale: idLocale});
          const formattedWeekDateRange = `${formattedWeekStartDate} - ${formattedWeekEndDate}`;

          // Find the corresponding week in the results array
          let weekResult = weeklyResults.find((week) => week.title === formattedWeekDateRange);

          // If the week is not in the results array, initialize it
          if (!weekResult) {
            weekResult = {
              title: formattedWeekDateRange,
              sum: 0,
              count: 0,
              startDate: format(weekStartDate, 'dd-MM-yyyy', {locale: idLocale}),
              endDate: format(weekEndDate, 'dd-MM-yyyy', {locale: idLocale}),
            };
            weeklyResults.push(weekResult);
          }

          // Update the sum and count for the corresponding week
          weekResult.sum += parseInt(decryptDataAES256Cbc(transaction.price));
          weekResult.count += 1;
        });

        weeklyResults.pop();

        return wrapper.data(weeklyResults, 'success get financials', 200);
      }

      if (date === 'monthly') {
        const monthlyResults = [];

        // Iterate through each transaction in the data
        data.forEach((transaction) => {
          const transactionDate = new Date(transaction.created_at);
          const monthStartDate = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), 1);
          const monthEndDate = new Date(transactionDate.getFullYear(), transactionDate.getMonth() + 1, 0); // Set to the last day of the month

          // Set the start date to the first day of the month
          monthStartDate.setDate(1);

          // Format the month start and end dates using date-fns
          const formattedMonthStartDate = format(monthStartDate, 'MMMM yyyy', {locale: require('date-fns/locale/id')});
          const formattedMonthDateRange = `${formattedMonthStartDate}`;

          // Find the corresponding month in the results array
          let monthResult = monthlyResults.find((month) => month.title === formattedMonthDateRange);

          // If the month is not in the results array, initialize it
          if (!monthResult) {
            monthResult = {
              title: formattedMonthDateRange,
              sum: 0,
              count: 0,
              startDate: format(monthStartDate, 'dd-MM-yyyy', {locale: require('date-fns/locale/id')}),
              endDate: format(monthEndDate, 'dd-MM-yyyy', {locale: require('date-fns/locale/id')}),
            };
            monthlyResults.push(monthResult);
          }

          // Update the sum and count for the corresponding month
          monthResult.sum += parseFloat(decryptDataAES256Cbc(transaction.price));
          monthResult.count += 1;
        });
        return wrapper.data(monthlyResults, 'success get financials', 200);
      }

      if (date === 'daily') {
        const dailyResults = [];

        // Iterate through each transaction in the data
        data.forEach((transaction) => {
          const transactionDate = new Date(transaction.created_at);
          const dayStartDate = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate());
          const dayEndDate = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate() + 1); // Set to the next day

          // Manually concatenate the day name and date
          const dayName = transactionDate.toLocaleDateString('id-ID', {weekday: 'long'}); // Get the day name in Indonesian
          const formattedDayDate = `${dayName}, ${format(dayStartDate, 'dd MMMM yyyy', {locale: require('date-fns/locale/id')})}`;

          // Find the corresponding day in the results array
          let dayResult = dailyResults.find((day) => day.title === formattedDayDate);

          // If the day is not in the results array, initialize it
          if (!dayResult) {
            dayResult = {
              title: formattedDayDate,
              sum: 0,
              count: 0,
              startDate: format(dayStartDate, 'dd-MM-yyyy', {locale: require('date-fns/locale/id')}),
              endDate: format(dayEndDate, 'dd-MM-yyyy', {locale: require('date-fns/locale/id')}),
            };
            dailyResults.push(dayResult);
          }

          // Update the sum and count for the corresponding day
          dayResult.sum += parseFloat(decryptDataAES256Cbc(transaction.price));
          dayResult.count += 1;
        });


        return wrapper.data(dailyResults, 'success get financials', 200);
      }

      return wrapper.data(data, 'success get financials', 200);
    } catch (error) {
      console.log(error);
      return wrapper.data(error, 'Gagal mengambil data buku', 500);
    }
  }

  async getFinancialsTotal(payload) {
    try {
      const {phone} = payload.auth.credentials;
      const collection = payload.mongo.db.collection('financials');

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const dataOfMonth = await collection.aggregate([
        {
          $match: {
            phone: phone,
            created_at: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          },
        },
      ]).toArray();

      const result = dataOfMonth.reduce((accumulator, item) => {
        const decryptedPrice = decryptDataAES256Cbc(item.price);

        if (item.type === 'income') {
          accumulator.total_income += parseInt(decryptedPrice);
        } else if (item.type === 'outcome') {
          accumulator.total_outcome += parseInt(decryptedPrice);
        }

        return accumulator;
      }, {total_income: 0, total_outcome: 0});

      result.total_income = helpers.formatToRupiah(result.total_income).toString();
      result.total_outcome = helpers.formatToRupiah(result.total_outcome).toString();

      return wrapper.data(result, 'success get financials total', 200);
    } catch (error) {
      console.log(error);
      return wrapper.data(error, 'failed get financials total', 500);
    }
  }

  async getFinancialById(payload) {
    try {
      const {id} = payload;
      const collection = payload.mongo.db.collection('financials');
      // eslint-disable-next-line new-cap
      const data = await collection.findOne({_id: ObjectId(id)});

      if (!data) {
        return wrapper.error(true, 'failed get detail financial', 500);
      }

      return wrapper.data(data, 'success get detail financial', 200);
    } catch (error) {
      console.log(error);
      return wrapper.data(error, 'failed get detail financial', 500);
    }
  }

  async getFinancialsSummary(payload) {
    const {phone} = payload.auth.credentials;
    const {type} = payload;
    const collection = payload.mongo.db.collection('financials');

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);

    const data = await collection.aggregate([
      {
        $match: {
          phone: phone,
          type: type,
          created_at: {
            $gte: startOfYear,
            $lte: endOfYear,
          },
        },
      },
    ]).toArray();

    for (let index = 0; index < data.length; index++) {
      data[index].price = decryptDataAES256Cbc(data[index].price);
    }

    if (type === 'outcome') {
      const response = {
        total_today: 0,
        total_weekly: 0,
        total_monthly: 0,
        count_today: 0,
        count_weekly: 0,
        count_monthly: 0,
      };

      // Calculate totals
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      data.forEach((item) => {
        const itemDate = new Date(item.created_at);
        // Check if the item is from today
        if (itemDate.toDateString() === today.toDateString()) {
          response.total_today += parseInt(item.price);
          response.count_today += 1;
        }

        // Check if the item is from this week
        if (itemDate >= startOfWeek) {
          response.total_weekly += parseInt(item.price);
          response.count_weekly += 1;
        }

        // Check if the item is from this month
        if (itemDate >= startOfMonth) {
          response.total_monthly += parseInt(item.price);
          response.count_monthly += 1;
        }
      });

      const result = [
        {
          title: 'Harian',
          total: helpers.formatToRupiah(response.total_today),
          count: response.count_today,
        },
        {
          title: 'Mingguan',
          total: helpers.formatToRupiah(response.total_weekly),
          count: response.count_weekly,
        },
        {
          title: 'Bulanan',
          total: helpers.formatToRupiah(response.total_monthly),
          count: response.count_monthly,
        },
      ];

      return wrapper.data(result, `success get financials ${type} summary`, 200);
    }

    if (type === 'income') {
      const response = {
        total_monthly_now: 0,
        total_monthly_before: 0,
        count_monthly_now: 0,
        count_monthly_before: 0,
      };

      // Calculate totals
      const today = new Date();

      // Start of the current month
      const startOfMonthDate = startOfMonth(today);

      data.forEach((item) => {
        const itemDate = item.created_at;

        // Check if the item is from this month
        if (isAfter(itemDate, startOfMonthDate)) {
          response.total_monthly_now += parseInt(item.price);
          response.count_monthly_now += 1;
        }

        // Check if the item is from last month
        if (isBefore(itemDate, startOfMonthDate)) {
          response.total_monthly_before += parseInt(item.price);
          response.count_monthly_before += 1;
        }
      });

      const result = [
        {
          title: 'Bulan Ini',
          total: helpers.formatToRupiah(response.total_monthly_now),
          count: response.count_monthly_now,
        },
        {
          title: 'Bulan Kemarin',
          total: helpers.formatToRupiah(response.total_monthly_before),
          count: response.count_monthly_before,
        },
      ];

      return wrapper.data(result, `success get financials ${type} summary`, 200);
    }
  }
}

module.exports = GetClass;
