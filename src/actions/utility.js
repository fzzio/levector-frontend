import axios from 'axios';
import defines from '../defines';

export const _inputParsers = {
    date(input) {
      const [month, day, year] = input.split('/');
      return `${year}-${month}-${day}`;
    },
    uppercase(input) {
      return input.toUpperCase();
    },
    number(input) {
      return parseFloat(input);
    },
};

export function _getGenderList(dispatch){
  axios.get( defines.API_DOMAIN + '/gender')
  .then( (response) =>{
    if(response.status == 200){
      if(dispatch){
        dispatch({type:"SET_GENDER_LIST",payload:response.data.data});
      }
    }else{
      throw new Error( JSON.stringify( {status: response.status, error: response.data.data.msg} ) );
    }
  })
  .catch( (err)=>{
  });
}