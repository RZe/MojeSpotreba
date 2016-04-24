/**
 *      __  __      _     ___           _           _
 *     |  \/  |___ (_)___/ __|_ __  ___| |_ _ _ ___| |__  __ _
 *     | |\/| / _ \| / -_)__ \ '_ \/ _ \  _| '_/ -_) '_ \/ _` |
 *     |_|  |_\___// \___|___/ .__/\___/\__|_| \___|_.__/\__,_|
 *               |__/        |_|
 *
 *  (c) 2016 Zdenek Rindt (zdenek.rindt at tul.cz)
 */

'use strict';

// Moment.js for date formatting
import moment from 'moment';
// There is a bug that prevents moment.locale from being loaded. Use workaround:
require('moment/locale/cs');

/**
 *  Processes readings and calculates consumption per reading.
 *
 *  @param readings
 *  @returns {*|Object|Array|OrderedMap}
 */
function getReadingsConsumption(readings) {
  return readings.map((reading, readingIndex) => {

    // Use the same set of attributes in first iteration to produce zero consumption
    let newerReading = readingIndex == 0 ? reading : readings[readingIndex - 1];

    const attributes = reading.attributes.map((currentAttribute, currentAttributeIndex) => {

      // Get same attribute of previous reading, if not found, zero is assigned as consumption
      const newerAttribute = newerReading.attributes.find(a => (a.attribute == currentAttribute.attribute));
      const consumptionValue = newerAttribute ? (newerAttribute.value - currentAttribute.value) : 0;

      return Object.assign({}, currentAttribute, {
        consumption: consumptionValue
      });
    });

    // Assign modified attributes to the reading
    return Object.assign({}, reading, {
      attributes
    });
  });
}

/**
 *  Processes readings with consumption attribute already calculated and calculates trending.
 *
 *  @param readings
 *  @returns {*|OrderedMap|Object|Array}
 */
function getReadingsTrending(readings) {
  return readings.map((reading, readingIndex) => {

    // Use the same set of attributes in last iteration to produce zero consumption trending
    // Also trending must be zero in first iteration
    let olderReading = (readingIndex == readings.length - 1 || readingIndex == 0)
        ? reading
        : readings[readingIndex + 1];

    const attributes = reading.attributes.map((currentAttribute, currentAttributeIndex) => {

      // Trending is computed for attribute by looking at previous attribute consumption and subtracting it from current
      // consumption
      const olderAttribute = olderReading.attributes.find(a => (a.attribute == currentAttribute.attribute));
      const trendingValue = olderAttribute ? (currentAttribute.consumption - olderAttribute.consumption) : 0;

      return Object.assign({}, currentAttribute, {
        trending: trendingValue
      });
    });

    // Assign modified attributes to the reading
    return Object.assign({}, reading, {
      attributes
    });
  });
}

/**
 *  From readings, attribute identifier and year create an array of consumption per months for given attribute and year.
 *
 *  @param readings
 *  @param attributeId
 *  @param cbField      Callback taking attribute as a parameter returning field to be summed
 *  @param year
 *  @returns {number[]}
 */
function getReadingsOfYear(readings, attributeId, cbField, year) {
  let months = [];
  for (let i = 0; i < 12; ++i) {
    months[i] = 0;
  }

  readings.forEach(reading => {
    let date = moment.utc(reading.date);

    if (date.year() === year) {
      const attribute = reading.attributes.find(a => (a.attribute == attributeId));
      if (attribute) {
        const monthIndex = date.month();

        months[monthIndex] += cbField(attribute);
      }
    }
  });

  return months;
}


function getSumOfYear(readings, attributeId, fieldCallback, year) {

}

/*function getMonthsReadings(readings) {

  readings.forEach(reading => {
    let date = moment.utc(reading.date);


  });
}*/


function toFixedFormatted(number, precision) {
  const thousandsSep = '.';
  const decimalPoint = ',';

  // Limit number of decimals and split number by decimal point
  let parts = number.toFixed(precision).toString().split('.');

  // Add point at every third number of the integer part
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);

  return parts.join(decimalPoint);
}

/**
 * Formats values to given units as a string.
 * 
 * @param value     Value to be formatted
 * @param attribute Array of units
 * @param precision Number of decimals after decimal point, defaults to 3
 * @returns {string}
 */
function formatAttributeUnits(value, attribute, precision) {
  value = Number(value);
  precision = precision === 0 ? 0 : 3;

  if (value === 0) {
    // Do not fall down to smallest available units for zero values, use base (i.e. prefix with base equal to 1) prefix
    const onePrefix = attribute.prefixes.find(p => p.base == 1);
    return toFixedFormatted(value, precision) + ' ' + (onePrefix ? onePrefix.prefix : '') + attribute.units;
  }

  for (var i = attribute.prefixes.length - 1; i >= 0; i--) {
    let factor = attribute.prefixes[i].base;
    let prefix = attribute.prefixes[i].prefix;

    if (Math.abs(value) >= factor || i == 0) {
      // TODO Use smallest precision available to cover the remainder after decimal point

      // Force first units to be used when there is no lower option
      return toFixedFormatted(value / factor, precision) + ' ' + prefix + attribute.units;
    }
  }
}

export default {
  getReadingsConsumption,
  getReadingsTrending,
  getReadingsOfYear,
  toFixedFormatted,
  formatAttributeUnits
};
