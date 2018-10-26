/**
 * Проверяет на строку
 * @param {string} input
 * @returns {boolean}
 */
export const isString = (input) => (typeof input === 'string' || input instanceof String);

/**
 * Преобразует строку в число
 * @param {string} value
 * @returns {number}
 */
export const stringToNumber = value => parseInt(value, 10);