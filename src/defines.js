/*
    On this file are the config defines
*/
exports.API_DOMAIN = 'http://localhost:3009';
exports.CUSTOM_FIELD_CHECKBOX = 1;
exports.CUSTOM_FIELD_TEXTAREA = 2;
exports.CUSTOM_FIELD_RADIO = 3;
exports.CUSTOM_FIELD_COMBOBOX = 4;
exports.CUSTOM_FIELD_TEXT = 5;
exports.CUSTOM_FIELD_PREFIX = 'lvtCustomField_'
exports.GL_HEAD = {
    headers: {
        "Content-Type": "application/json",
    }
}
exports.PERSON_ID_DIGITS = 5;
exports.PERSON_PAD_CHARACTER = 0;
exports.PERSON_PATH_IMG = '/person/img';
exports.PERSON_PATH_VID = '/person/vid';
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