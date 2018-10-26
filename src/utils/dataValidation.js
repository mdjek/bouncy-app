import { isString } from './stringExtension';

/**
 * Валидация на использование только чисел
 * @param {string} value
 * @returns {boolean}
 */
export const isNumeric = (value) => {
    if (isString(value)) {
        return false;
    }

    return (/^\d+$/).test(value);
};