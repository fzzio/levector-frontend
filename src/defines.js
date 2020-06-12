/*
    On this file are the config defines
*/
exports.API_DOMAIN = 'http://ec2-52-202-112-113.compute-1.amazonaws.com:3000';
// exports.API_DOMAIN = 'http://localhost:3009';

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
exports.LVT_NUM_DIGITS = 4;
exports.LVT_PAD_CHARACTER = 0;
exports.PERSON_PATH_IMG_THUMBNAIL = '/person/img/thumbnail/';
exports.PERSON_PATH_IMG_OPTIMIZED = '/person/img/optimized/';
exports.PERSON_PATH_IMG_ORIGINAL = '/person/img/original/';
exports.PERSON_PATH_VID = '/person/vid/';
exports.LVT_STATUS_ACTIVE = 1;
exports.LVT_STATUS_INACTIVE = 2;
exports.LVT_STATUS_REMOVED = 3;
exports.LVT_AGE_UNIT = 'año';
exports.LVT_AGE_MIN = 0;
exports.LVT_AGE_ADULT = 18;
exports.LVT_AGE_ELDER = 65;
exports.LVT_AGE_MAX = 100;
exports.LVT_WIDTH_MIN = 0;
exports.LVT_WIDTH_MAX = 240;
exports.LVT_HEIGHT_MIN = 0;
exports.LVT_HEIGHT_MAX = 240;
exports.LVT_DISTANCE_UNIT = 'cm';
exports.LVT_WEIGHT_MIN = 0;
exports.LVT_WEIGHT_MAX = 150;
exports.LVT_WEIGHT_UNIT = 'kg';
exports.LVT_PAGINATION_OFFSET = 4;
exports.STATUS_UPDATE_CUSTOM_FIELD_OP = 1;
exports.STATUS_CREATE_CUSTOM_FIELD_OP = 2;
exports.STATUS_DELETE_CUSTOM_FIELD_OP = 3;
