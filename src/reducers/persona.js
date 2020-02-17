const default_persona = {
  lvtDNI : '',
  lvtFirstname : '',
  lvtLastname : '',
  lvtDateOfBirth : '',
  lvtGender : '',
  lvtHeight : '',
  lvtWeight : '',
  lvtRUC : '',
  lvtEmail : '',
  lvtCellphone : '',
  lvtPhone : '',
  lvtAddress : '',
  lvtVideo : '',
  lvtObservations : '',
};
const ONLY_NUMBERS= new RegExp('^[0-9]*$');
const ONLY_LETTERS= new RegExp('^[a-zA-ZÀ-ÿ\ ]*$');
const persona = (state = default_persona, action) => {
    
  switch (action.type) {

    case 'UPDATE_PERSONA_ATTRIBUTE':
      
      let v = action.payload.value;

      console.log('---- attr: ', action.payload.attr)
      if( action.payload.attr == 'lvtDNI' ||  action.payload.attr == 'lvtRUC' ||  
          action.payload.attr == 'lvtCellphone'  ||  action.payload.attr == 'lvtPhone'){
            if( !ONLY_NUMBERS.exec(v) ) // validating that only numbers are entered for these fields
              v = ''; // if it is not a number, the incoming value will be empty

      }
      else if( action.payload.attr == 'lvtFirstname' || action.payload.attr == 'lvtLastname' ){
        console.log('---- regex: ', ONLY_LETTERS.exec(v))
          if( !ONLY_LETTERS.exec(v) ){ // validating that only letters, space are entered for these fields
            console.log('v:', v)
            v = ''; 
          }
      }

      if(v != '' || action.payload.value == '') // only update if value is empty or matches regex
        state[action.payload.attr] = action.payload.value;

      return state;
    case 'ADD_PERSONA':
      // console.log('adding persona---')
      return {persona: 'added'}
    case 'SET_PERSONA_NAME':
      // console.log('SET_PERSONA_NAME---', action.payload)
        state.lvtDNI = action.payload;
      return  state;
    case 'GET_PERSONA':
      return state;
    case 'SET_ID_PERSONA':
      state['lvtDNI'] = '1452154';
      return state;
    default:
      return state
  }
}
export default persona