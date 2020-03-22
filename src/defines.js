/*
    On this file are the config defines
*/
exports.API_DOMAIN = 'http://ec2-3-86-160-83.compute-1.amazonaws.com:3000';
// exports.API_DOMAIN = 'http://localhost:3000';

// MODULE IDENTIFIERS
exports.LVT_CASTING = 1;
exports.LVT_PROPS = 2;
exports.LVT_VESTRY = 3;
exports.LVT_LOCATIONS = 4;

exports.CUSTOM_FIELD_TEXT = 1;
exports.CUSTOM_FIELD_TEXTAREA = 2;
exports.CUSTOM_FIELD_COMBOBOX = 3;
exports.CUSTOM_FIELD_RADIO = 4;
exports.CUSTOM_FIELD_CHECKBOX = 5;
exports.CUSTOM_FIELD_PREFIX = 'lvtCustomField_';
exports.GL_HEAD = {
  headers: {
    'Content-Type': 'application/json'
  }
};
exports.PERSON_ID_DIGITS = 4;
exports.PERSON_PAD_CHARACTER = 0;
exports.PERSON_PATH_IMG_THUMBNAIL = '/person/img/thumbnail/';
exports.PERSON_PATH_IMG_OPTIMIZED = '/person/img/optimized/';
exports.PERSON_PATH_IMG_ORIGINAL = '/person/img/original/';
exports.PERSON_PATH_VID = '/person/vid/';
exports.LVT_STATUS_ACTIVE = 1;
exports.LVT_STATUS_INACTIVE = 0;
exports.LVT_STATUS_REMOVED = -1;
exports.LVT_AGE_UNIT = 'año';
exports.LVT_AGE_MIN = 0;
exports.LVT_AGE_ADULT = 18;
exports.LVT_AGE_ELDER = 65;
exports.LVT_AGE_MAX = 100;
exports.LVT_HEIGHT_MIN = 0;
exports.LVT_HEIGHT_MAX = 240;
exports.LVT_HEIGHT_UNIT = 'cm';
exports.LVT_WEIGHT_MIN = 0;
exports.LVT_WEIGHT_MAX = 150;
exports.LVT_WEIGHT_UNIT = 'kg';
exports.LVT_PAGINATION_OFFSET = 4;
exports.STATUS_UPDATE_CUSTOM_FIELD_OP = 1;
exports.STATUS_CREATE_CUSTOM_FIELD_OP = 2;
exports.STATUS_DELETE_CUSTOM_FIELD_OP = 3;
exports.UTILERIA_TYPE = [{name:'Utilería', value:1}, {name: 'Vestuario', value:2}]
exports.UTILERIA_CATEGORIES = [{name:'Casa', value:1}, {name: 'Escolar', value:2}, {name: 'Exterior', value:3}, {name: 'Oficina', value:4}]
exports.VESTUARIO_CATEGORIES = [{name:'Hombre', value:1}, {name: 'Mujer', value:2}, {name: 'Niña', value:3}, {name: 'Niño', value:4}]