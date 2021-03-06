import React, { Component } from 'react';
import { Redirect } from 'react-router'
import axios from 'axios';
import defines from '../../defines'
import CustomField from '../CustomField/CustomField';
import RUG, { DragArea, DropArea } from 'react-upload-gallery'
import CustomModal from '../Notifications/Modals/CustomModal';
import 'react-upload-gallery/dist/style.css'
import labels from '../../labels'

import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, FormText, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Row } from 'reactstrap';

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const inputParsers = {
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

function GenderRadioOption(props) {
  const gender = props.gender;

  return (
    <FormGroup check>
      <Input
        className="form-check-input"
        type="radio"
        id={"lvtGender_" + gender.idgender}
        name="lvtGender"
        value={gender.idgender}
        checked={gender.idgender === props.genderValue}
        onChange={props.onGenderFieldChange}
      />
      <Label className="form-check-label" check htmlFor={`lvtGender_` + gender.idgender}>{gender.name}</Label>
    </FormGroup>
  );
}

const RUG_RULES = { limit: 10, size: 20000 };
const RUG_ACCEPT = ['jpg', 'jpeg', 'png'];
const RUG_ACTION = defines.API_DOMAIN + '/uploadcastingimages';

class Create extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formFields: {
        lvt_person_id:'',
        module: defines.LVT_CASTING,
        lvtDNI: '',
        lvtFirstname: '',
        lvtLastname: '',
        lvtDateOfBirth: '',
        lvtGender: '',
        lvtHeight: '',
        lvtWeight: '',
        lvtRUC: '',
        lvtEmail: '',
        lvtCellphone: '',
        lvtPhone: '',
        lvtAddress: '',
        lvtVideo: '',
        lvtObservations: '',
      },
      loading: false,
      error: false,
      redirect: false,
      redirect_detail: false,
      genders: [],
      customFields: [],
      customFieldsData: [],
      lvtImages: [],
      lvtVideos: [],
      lvtDeletedImages: [],
      lvtDeletedVideos: [],
      modalVisible: false,
      modalData: {
        modalType: 'primary',
        modalTitle: labels.LVT_MODAL_DEFAULT_TITLE,
        modalBody: 'Body',
        modalOkButton: labels.LVT_MODAL_DEFAULT_BUTTON_OK,
        modalCancelButton: labels.LVT_MODAL_DEFAULT_BUTTON_CANCEL,
        okFunctionState: null
      },
      errorFields: {
        valid: [],
        invalid: []
      },
      editCustomValues: {}
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.inputRadioHandler = this.inputRadioHandler.bind(this);
    this.customInputChangeHandler = this.customInputChangeHandler.bind(this);
    this.parsePersonData = this.parsePersonData.bind(this);
    this.parsePersonField = this.parsePersonField.bind(this);
    this.parseCustomFields = this.parseCustomFields.bind(this);
    this.enableRedirect = this.enableRedirect.bind(this);

  }

  handleInitUpload() {
    //console.log("FilePond instance has initialised", this.pond);
    console.log("FilePond instance has initialised");
  }

  inputChangeHandler(e) {
    let formFields = { ...this.state.formFields };
    formFields[e.target.name] = e.target.value;
    this.setState({
      formFields: formFields
    });
  }

  inputRadioHandler(e) {
    let formFields = this.state.formFields;
    formFields[e.target.name] = parseInt(e.target.value);
    this.setState({ formFields });
  }

  customInputChangeHandler(e) {
    let customFieldsData = this.state.customFieldsData;
    const index = customFieldsData.findIndex(item => (item.name === e.target.name));
    if (index >= 0) {
      customFieldsData[index].value = e.target.value;
      this.setState({ editCustomValues: { [customFieldsData[index].name]: e.target.value } });
    }
    
    this.setState({ customFieldsData: customFieldsData });
  }

  addFormError(fieldError) {
    if (this.state.errorFields.invalid.indexOf(fieldError) <= -1) {
      let invalidErrorFields = this.state.errorFields.invalid;
      let validErrorFields = this.state.errorFields.valid;
      validErrorFields.splice(validErrorFields.indexOf(fieldError), 1)
      invalidErrorFields.push(fieldError);
      this.setState({
        errorFields: {
          valid: validErrorFields,
          invalid: invalidErrorFields,
        }
      });
    }
  }
  removeFormError(fieldError) {
    if (this.state.errorFields.invalid.indexOf(fieldError) > -1) {
      let invalidErrorFields = this.state.errorFields.invalid;
      let validErrorFields = this.state.errorFields.valid;
      invalidErrorFields.splice(invalidErrorFields.indexOf(fieldError), 1)
      validErrorFields.push(fieldError);
      this.setState({
        errorFields: {
          valid: validErrorFields,
          invalid: invalidErrorFields,
        }
      });
    }
  }

  checkFormFields() {
    // if (this.state.formFields.lvtDNI === '') {
    //   this.addFormError('lvtDNI');
    // } else {
    //   this.removeFormError('lvtDNI');
    // }
    if (this.state.formFields.lvtFirstname === '') {
      this.addFormError('lvtFirstname');
    } else {
      this.removeFormError('lvtFirstname');
    }
    if (this.state.formFields.lvtLastname === '') {
      this.addFormError('lvtLastname');
    } else {
      this.removeFormError('lvtLastname');
    }
    if (this.state.formFields.lvtDateOfBirth === '') {
      this.addFormError('lvtDateOfBirth');
    } else {
      this.removeFormError('lvtDateOfBirth');
    }
    if (this.state.formFields.lvtGender === '') {
      this.addFormError('lvtGender');
    } else {
      this.removeFormError('lvtGender');
    }
    if (this.state.formFields.lvtHeight === '') {
      this.addFormError('lvtHeight');
    } else {
      this.removeFormError('lvtHeight');
    }
    if (this.state.formFields.lvtWeight === '') {
      this.addFormError('lvtWeight');
    } else {
      this.removeFormError('lvtWeight');
    }
    // if (this.state.formFields.lvtRUC === '') {
    //   this.addFormError('lvtRUC');
    // } else {
    //   this.removeFormError('lvtRUC');
    // }
    if (this.state.formFields.lvtEmail === '') {
      this.addFormError('lvtEmail');
    } else {
      this.removeFormError('lvtEmail');
    }
    if (this.state.formFields.lvtCellphone === '') {
      this.addFormError('lvtCellphone');
    } else {
      this.removeFormError('lvtCellphone');
    }
    if (this.state.formFields.lvtAddress === '') {
      this.addFormError('lvtAddress');
    } else {
      this.removeFormError('lvtAddress');
    }
  }

  enableRedirect() {
    this.setState({ redirect: true })
  }
  cancelFunctionState = () => {
      this.setState({ modalVisible: false })
  }

  handleSubmit(event) {
    event.preventDefault();
    this.checkFormFields();

    // Get data from Custom field
    let customfields = this.state.customFieldsData.filter(function (customFieldData) {
      if (customFieldData.value === null || customFieldData.value === undefined || customFieldData.value === '') {
        return false; // skip
      }
      return true;
    }).map(function (customFieldData) {
      if (customFieldData.idfieldtype === defines.CUSTOM_FIELD_TEXT || customFieldData.idfieldtype === defines.CUSTOM_FIELD_TEXTAREA) {
        // If the fields are of text or textarea type
        return {
          idfield: customFieldData.idfield,
          idfieldop: '',
          value: customFieldData.value,
        }
      } else {
        // We build the options array
        let options_selected = customFieldData.value;
        if( typeof options_selected == 'object'){
          options_selected = options_selected.map(function (option) {
            return option.id;
          })
        }else{
          options_selected = options_selected.split(',')
        }

        let arrCustomOptions = options_selected.map(function (idCustomFieldOption) {
          return {
            idfield: customFieldData.idfield,
            idfieldop: parseInt(idCustomFieldOption),
            value: '',
          }
        });
        return arrCustomOptions;
      }
    }).flat();

    // Get images uploaded
    let imagesPerson = [];
    let temp_images_deletes = this.state.lvtDeletedImages;
    if(this.props.match.params && this.props.match.params.id){
      
      imagesPerson = {}
      imagesPerson['updated'] = this.state.lvtImages.filter(function (imagePerson) {
        if(imagePerson.idimage && temp_images_deletes.indexOf(imagePerson.idimage) < 0)
          return {
            idimage: imagePerson.idimage,
            thumbnail: imagePerson.imgThumbnail,
            optimized: imagePerson.imgOptimized,
            original: imagePerson.imgOriginal
          }
      });
      imagesPerson['new'] = this.state.lvtImages.filter(function (imagePerson) {
        if(imagePerson.idimage==undefined){
            return imagePerson;
        }
      });
      imagesPerson['new'] = imagesPerson['new'].map(function (imagePerson) {
        return {
          thumbnail: imagePerson.imgThumbnail,
          optimized: imagePerson.imgOptimized,
          original: imagePerson.imgOriginal
        }
      });


      if(this.state.lvtDeletedImages.length>0)
        imagesPerson['deleted'] = this.state.lvtDeletedImages

    }else{
      imagesPerson = this.state.lvtImages.map(function (imagePerson) {
        return {
          thumbnail: imagePerson.imgThumbnail,
          optimized: imagePerson.imgOptimized,
          original: imagePerson.imgOriginal
        }
      });
    }

    // Get video uploaded
    let videosPerson = []

    if (this.props.match.params && this.props.match.params.id) {
      videosPerson = {}
      videosPerson['updated'] = this.state.lvtVideos.filter((video)=>{
        if(video.idvideo)
          return {
            idvideo:video.idvideo,
            url: video.url
          }
      })
      videosPerson['new'] = this.state.lvtVideos.filter((video)=>{
        if(!video.idvideo)
          return video;
      })
      videosPerson['new'] = videosPerson['new'].map((video)=>{
        return{
          url: video.source
        }
      })

      if(this.state.lvtDeletedVideos.length>0)
        videosPerson['deleted'] = this.state.lvtDeletedVideos

    } else {
      videosPerson = this.state.lvtVideos.map(function (videoPerson) {
        return {
          url: videoPerson.filename,
        }
      });
    }

    console.log('================== videosPerson ----:  ', videosPerson);

    // return false;

    // Setting data to request
    const personData = {
      module: defines.LVT_CASTING,
      defaultfields: [{
        dni: this.state.formFields.lvtDNI,
        firstname: this.state.formFields.lvtFirstname,
        lastname: this.state.formFields.lvtLastname,
        dob: this.state.formFields.lvtDateOfBirth,
        idgender: this.state.formFields.lvtGender,
        height: parseInt(this.state.formFields.lvtHeight),
        weight: parseInt(this.state.formFields.lvtWeight),
        ruc: this.state.formFields.lvtRUC,
        email: this.state.formFields.lvtEmail,
        phone1: this.state.formFields.lvtCellphone,
        phone2: this.state.formFields.lvtPhone,
        address: this.state.formFields.lvtAddress,
        observations: this.state.formFields.lvtObservations,
        createdby: 1,
        idcity: 593, // 593 Guayaquil
      }],
      customfields: customfields,
      images: imagesPerson,
      videos: videosPerson,
    };

    console.log("---- personData ----");
    console.log(JSON.stringify(personData));

    if (this.state.errorFields.invalid.length === 0) {

      this.setState({ loading: true });
      let save_person;


      if (this.props.match.params && this.props.match.params.id) {

        save_person = axios.put(defines.API_DOMAIN + '/person/update/?id=' + this.props.match.params.id, personData);
        this.saveCall(save_person);


      }else{

        if(this.state.formFields.lvtDNI != '')
          axios.post(
              defines.API_DOMAIN + '/person/search',
              { dni: this.state.formFields.lvtDNI, limit: 5,
                offset: 0, }
          )
          .then((response) => {
            console.log('SEARCH DE PERSONA: ', response)

            if( response.data.length){ // there is a person with tha DNI
              
              this.setState({   
                modalData: {
                  modalType: 'danger',
                  modalBody: labels.LVT_LABEL_CEDULA_EXISTENTE,
                  modalTitle: labels.LVT_MODAL_DEFAULT_TITLE,
                  modalOkButton: labels.LVT_MODAL_DEFAULT_BUTTON_OK,
                  okFunctionState: this.cancelFunctionState
                },
                modalVisible: true,
                loading: false,
                error: false
              });
              
            }else{

              save_person = axios.post(defines.API_DOMAIN + '/person/', personData);
              this.saveCall(save_person);
            }

          })
          .catch((error) => {
            if (error.response) {
              if (error.response.data.sucess) {
                save_person = axios.post(defines.API_DOMAIN + '/person/', personData);
                this.saveCall(save_person);
              }
              console.log(error.response.data);
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log('Error', error.message);
            }
            this.setState({ loading: false, error: true });
          });


        else{
          save_person = axios.post(defines.API_DOMAIN + '/person/', personData);
                this.saveCall(save_person);
        }

      }
      
      

    } else {
      this.setState({
        modalData: {
          modalType: 'danger',
          modalTitle: labels.LVT_MODAL_DEFAULT_TITLE,
          modalBody: labels.LVT_ERROR_FIELDS_MESSAGE,
          modalOkButton: labels.LVT_MODAL_DEFAULT_BUTTON_OK,
          modalCancelButton: labels.LVT_MODAL_DEFAULT_BUTTON_CANCEL,
        }
      });
      this.setState({ loading: false, error: true, modalVisible: true });
    }
  }

  saveCall = (save_person) =>{
    axios.all([save_person])
        .then((response) => {
          let resp = response[0];
          // console.log('===== PERSONA GUARDADA :',resp );
          if (resp.status === 201 || resp.status === 200) {
            this.setState({
              
              modalData: {
                modalType: 'primary',
                modalTitle: labels.LVT_MODAL_DEFAULT_TITLE,
                modalBody: labels.LVT_LABEL_PERSON + ' ' + labels.LVT_LABEL_SAVED_SUCCESSFUL + (this.state.formFields.lvtDNI == '' ? labels.LVT_LABEL_DNI_PROPORCIONADO+ resp.data.data.dni : '' ),
                modalOkButton: labels.LVT_MODAL_DEFAULT_BUTTON_OK,
                okFunctionState: this.enableRedirect
              },
              error: false,
              loading: false,
              modalVisible: true,
              
            });
          } else {
            console.log('----- THROW ERROR create person -------')
            throw new Error(JSON.stringify({ status: resp.status, error: resp.data.data.msg }));
          }
        })
        .catch((error) => {
          if (error.response) {
            this.setState({
              modalVisible: true,
              modalData: {
                modalType: 'danger',
                modalBody: error.response.data.data ? error.response.data.data.msg : "Su requerimiento no pudo procesarse. Intente nuevamente",
                modalTitle: labels.LVT_MODAL_DEFAULT_TITLE,
                modalOkButton: labels.LVT_MODAL_DEFAULT_BUTTON_OK
              }
            });
            console.log(error.response.data);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log('Error', error.message);
          }
          this.setState({ loading: false, error: true });
        });
  }

  componentWillReceiveProps(np){
    console.log('np.match.params.module: ---- ',np.match.params.id)
    if(np.match.params.id && np.match.params.id!=this.state.lvt_person_id)
      this.fetchPersonDetail(np.match.params.id);
  }
  componentDidMount() {
    // Fetch Gender
    axios.get(defines.API_DOMAIN + '/gender')
      .then((response) => {
        if (response.status === 200) {
          this.setState({ genders: response.data.data })
        } else {
          throw new Error(JSON.stringify({ status: response.status, error: response.data.data.msg }));
        }
      })
      .catch((error) => {
        console.log("Error fetching genders.");
        if (error.response) {
          if (error.response.status === 404) {
            console.log(error.response.data.error);
          } else {
            console.log(error.response.data);
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
      });

    // Fetch custom fields
    axios.get(defines.API_DOMAIN + '/field?module=' + defines.LVT_CASTING)
      .then((response) => {
        if (response.status === 200) {
          let customFieldElements = response.data.data.map((responseCustomField) => {
            let customFieldElement = {
              name: defines.CUSTOM_FIELD_PREFIX + responseCustomField.idfield,
              value: '',
              idfield: responseCustomField.idfield,
              idfieldtype: responseCustomField.idfieldtype
            };
            return customFieldElement;
          });
          this.setState({
            customFields: response.data.data,
            customFieldsData: customFieldElements
          });


          if (this.props.match.params && this.props.match.params.id) {
            this.setState({lvt_person_id:this.props.match.params.id})
            this.fetchPersonDetail(this.props.match.params.id);
          }
          
        } else {
          throw new Error(JSON.stringify({ status: response.status, error: response.data.data.msg }));
        }
      })
      .catch((error) => {
        console.log("Error fetching Custom fields.");
        if (error.response) {
          if (error.response.status === 404) {
            console.log(error.response.data.error);
          } else {
            console.log(error.response.data);
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
      });


    // Fetch Person Data

   
  }

  fetchPersonDetail = (lvt_person_id) => {
    
    this.setState({ loading: true })

    axios.get(defines.API_DOMAIN + '/person?module=' + defines.LVT_CASTING + '&id=' + lvt_person_id)
        .then((response) => {
          if (response.status === 200) {
            const personaData = response.data.data;
            let f = '';
            let v = '';
            for (let field of Object.keys(personaData.defaultfields)) {

              let formFields = { ...this.state.formFields };
              f = this.parsePersonField(field);
              v = this.parsePersonData(field, personaData.defaultfields[field]);
              
              formFields[f] = v;
              this.setState({ formFields });
              f = ''; v = '';
            }
          
            this.parseCustomFields(personaData.customfield);
            this.setState({ ['lvtImages']: this.parsePhotos(personaData.images) });
            this.setState({ ['lvtVideos']: this.parseVideos(personaData.videos) });
            this.setState({ loading: false })
          
          } else {
            throw new Error(JSON.stringify({ status: response.status, error: response.data.data.msg }));
          }
        })
        .catch((error) => {
          console.log("Error fetching genders.");
          if (error.response) {
            if (error.response.status === 404) {
              console.log(error.response.data.error);
            } else {
              console.log(error.response.data);
            }
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log('Error', error.message);
          }
        });
  }


  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    const gendersList = this.state.genders;
    let customFieldList = this.state.customFields;
    let lvtVideos = this.state.lvtVideos;

    console.log('------lvtVideos:  ', lvtVideos)
    console.log('------lvtDeletedVideos:  ', this.state.lvtDeletedVideos)

    if (this.state.redirect) {
      return <Redirect to='/person/list' />;
    }
    if (this.state.redirect_detail) {
      return <Redirect to={'/person/'+this.props.match.params.id} />;
    }
    if (this.state.loading) {
      return (
        <div>
          <p> Loading... </p>
        </div>
      )
    }

    return (
      <div className="animated fadeIn">
        {
          (this.state.modalVisible) ?
            <CustomModal
              modalType={this.state.modalData.modalType}
              modalTitle={this.state.modalData.modalTitle}
              modalBody={this.state.modalData.modalBody}
              labelOkButton={this.state.modalData.modalOkButton}
              labelCancelButton={this.state.modalData.modalCancelButton}
              okFunction={this.state.modalData.okFunctionState}
            />
            : ''
        }
        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal" id="lvt-form-person" onSubmit={this.handleSubmit} >
          
          <Row>
            <Col xs="12" md="4">
              <Card>
                <CardHeader>
                  <strong>Multimedia</strong> Imágenes
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col xs="12" md="12">
                      {
                        this.state.lvtImages.length > 0 ?
                          <div>
                            <RUG
                              rules={RUG_RULES}
                              accept={RUG_ACCEPT}
                              action={RUG_ACTION}
                              // This propperty seems to be loaded once. It is not reactive to a state.
                              // so, the entire elemente must be loaded to make it work
                              initialState={this.state.lvtImages}

                              source={this.rugSource}
                              onWarning={this.rugOnWarning}
                              onSuccess={this.rugOnSuccess}
                              onConfirmDelete={this.rugOnConfirmDelete}
                              onDeleted={this.rugOnDeleted}
                            />
                          </div>
                          :
                          <RUG
                            rules={RUG_RULES}
                            accept={RUG_ACCEPT}
                            action={RUG_ACTION}

                            source={this.rugSource}
                            onWarning={this.rugOnWarning}
                            onSuccess={this.rugOnSuccess}
                            onConfirmDelete={this.rugOnConfirmDelete}
                            onDeleted={this.rugOnDeleted}
                          />
                      }

                    </Col>
                  </FormGroup>

                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <strong>Multimedia</strong> Video
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtVideo">Vídeo</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <FilePond
                        ref={ref => (this.pond = ref)}
                        files={this.state.lvtVideos}

                        allowMultiple={true}
                        allowDrop={false}
                        acceptedFileTypes={['video/*']}
                        server={{
                          process: defines.API_DOMAIN + '/uploadcastingvideos',
                          fetch: defines.API_DOMAIN + '/casting/videos/',
                          revert: null
                        }}
                        oninit={() => this.handleInitUpload()}
                        onprocessfile={(error, file) => {
                          
                          let processedFile = {video:''};
                          try {
                            processedFile = JSON.parse(file.serverId);
                          } catch (error) {
                            processedFile['video'] = file.serverId;
                          }

                          // console.log('file processed: ', processedFile)
                          let video_name = processedFile.video.split('casting/videos/');
                          video_name = video_name.length >= 2 ? video_name[1]: video_name[0];


                          let arrVideos = this.state.lvtVideos;
                          let video_found = false;

                          for (let i = 0; i < arrVideos.length; i++) {
                            const element = arrVideos[i];
                            if(element.filename == video_name){
                              video_found = true;
                              return;
                            }
                          }

                          if(!video_found){
                          
                            arrVideos.push({
                              "filename": video_name,
                              "source": processedFile.video,
                              "options": {
                                  type: 'limbo'
                              }
                            })
                            this.setState({ lvtVideos: arrVideos })
                          }
                        }}
                        onremovefile={(error, file) => {

                          // console.log('removing file', file.filename);

                          let arrVideos = this.state.lvtVideos;
                          let deleted_videos_list = this.state.lvtDeletedVideos;
                          let video_found_index = null;

                          for (let i = 0; i < arrVideos.length; i++) {
                            if(arrVideos[i].filename == file.filename)
                              video_found_index = i;
                          }

                          if( (video_found_index!=null && video_found_index > -1) ){

                            if(arrVideos[video_found_index].idvideo)
                              deleted_videos_list.push(arrVideos[video_found_index].idvideo)
                            
                            arrVideos.splice(video_found_index,1);
                            this.setState({
                              lvtVideos: arrVideos,
                              lvtDeletedVideos: deleted_videos_list
                            })
                          }
                        }}
                      />
                      <FormText color="muted">Vídeo a mostrar</FormText>
                    </Col>
                  </FormGroup>
                </CardBody>
              </Card>
            </Col>

            

            <Col xs="12" md="4">
              <Card>
                <CardHeader>
                  <strong>Información</strong> Datos personales
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtDNI">Cédula</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="text"
                        id="lvtDNI"
                        name="lvtDNI"
                        placeholder="09999999999"
                        autoComplete="nope"
                        value={this.state.formFields.lvtDNI}
                        onChange={(e) => this.inputChangeHandler.call(this, e)}
                        valid={this.state.errorFields.valid.indexOf("lvtDNI") > -1}
                        invalid={this.state.errorFields.invalid.indexOf("lvtDNI") > -1}
                      />
                      <FormText color="muted">Cédula/DNI/Pasaporte </FormText>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtFirstname">Nombres</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="text"
                        id="lvtFirstname"
                        name="lvtFirstname"
                        placeholder="Juan"
                        autoComplete="nope"
                        value={this.state.formFields.lvtFirstname}
                        onChange={(e) => this.inputChangeHandler.call(this, e)}
                        valid={this.state.errorFields.valid.indexOf("lvtFirstname") > -1}
                        invalid={this.state.errorFields.invalid.indexOf("lvtFirstname") > -1}
                      />
                      <FormText color="muted">Nombres de la persona</FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtLastname">Apellidos</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="text"
                        id="lvtLastname"
                        name="lvtLastname"
                        placeholder="Pérez"
                        autoComplete="nope"
                        value={this.state.formFields.lvtLastname}
                        onChange={(e) => this.inputChangeHandler.call(this, e)}
                        valid={this.state.errorFields.valid.indexOf("lvtLastname") > -1}
                        invalid={this.state.errorFields.invalid.indexOf("lvtLastname") > -1}
                      />
                      <FormText color="muted">Apellidos de la persona</FormText>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtDateOfBirth">Fecha de nacimiento </Label>
                    </Col>
                    <Col xs="12" md="9">
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-calendar"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="date"
                          id="lvtDateOfBirth"
                          name="lvtDateOfBirth"
                          placeholder=""
                          value={this.state.formFields.lvtDateOfBirth}
                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                          valid={this.state.errorFields.valid.indexOf("lvtDateOfBirth") > -1}
                          invalid={this.state.errorFields.invalid.indexOf("lvtDateOfBirth") > -1}
                        />
                      </InputGroup>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label>Género</Label>
                    </Col>
                    <Col md="9">
                      {gendersList.map((gender, index) =>
                        <GenderRadioOption
                          key={index}
                          gender={gender}
                          genderValue={this.state.formFields.lvtGender}
                          onGenderFieldChange={(e) => this.inputRadioHandler.call(this, e)}
                        />
                      )}
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtRUC">RUC</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="text"
                        id="lvtRUC"
                        name="lvtRUC"
                        placeholder="09999999999001"
                        autoComplete="nope"
                        value={this.state.formFields.lvtRUC}
                        onChange={(e) => this.inputChangeHandler.call(this, e)}
                        valid={this.state.errorFields.valid.indexOf("lvtRUC") > -1}
                        invalid={this.state.errorFields.invalid.indexOf("lvtRUC") > -1}
                      />
                      <FormText color="muted">Dato para facturación</FormText>
                    </Col>
                  </FormGroup>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <strong>Contacto</strong> Datos de contacto
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtEmail">Email</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="email"
                        id="lvtEmail"
                        name="lvtEmail"
                        placeholder="Ingrese email"
                        autoComplete="nope"
                        value={this.state.formFields.lvtEmail}
                        onChange={(e) => this.inputChangeHandler.call(this, e)}
                        valid={this.state.errorFields.valid.indexOf("lvtEmail") > -1}
                        invalid={this.state.errorFields.invalid.indexOf("lvtEmail") > -1}
                      />
                      <FormText className="help-block">Ingrese correo electrónico</FormText>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtCellphone">Celular</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-phone"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          id="lvtCellphone"
                          name="lvtCellphone"
                          placeholder="593987654321"
                          autoComplete="nope"
                          value={this.state.formFields.lvtCellphone}
                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                          valid={this.state.errorFields.valid.indexOf("lvtCellphone") > -1}
                          invalid={this.state.errorFields.invalid.indexOf("lvtCellphone") > -1}
                        />
                      </InputGroup>
                      <FormText color="muted">Teléfono celular</FormText>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtPhone">Teléfono</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-phone"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          id="lvtPhone"
                          name="lvtPhone"
                          placeholder="042999999"
                          autoComplete="nope"
                          value={this.state.formFields.lvtPhone}
                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                          valid={this.state.errorFields.valid.indexOf("lvtPhone") > -1}
                          invalid={this.state.errorFields.invalid.indexOf("lvtPhone") > -1}
                        />
                      </InputGroup>
                      <FormText color="muted">Teléfono fijo principal</FormText>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtAddress">Dirección</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="textarea"
                        name="lvtAddress"
                        id="lvtAddress"
                        rows="3"
                        placeholder="Urdesa Central, Cedros 215 y Victor Emilio Estrada"
                        onChange={(e) => this.inputChangeHandler.call(this, e)}
                        value={this.state.formFields.lvtAddress}
                        valid={this.state.errorFields.valid.indexOf("lvtAddress") > -1}
                        invalid={this.state.errorFields.invalid.indexOf("lvtAddress") > -1}
                      />
                      <FormText color="muted">Dirección de domicilio o de contacto principal</FormText>
                    </Col>
                  </FormGroup>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <strong>Complementarios</strong> Datos adicionales
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtObservations">Observaciones</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="textarea"
                        name="lvtObservations"
                        id="lvtObservations"
                        rows="4"
                        placeholder="Ingrese observaciones de la persona"
                        onChange={(e) => this.inputChangeHandler.call(this, e)}
                        value={this.state.formFields.lvtObservations}
                        valid={this.state.errorFields.valid.indexOf("lvtObservations") > -1}
                        invalid={this.state.errorFields.invalid.indexOf("lvtObservations") > -1}
                      />
                      <FormText color="muted">Comentarios y observaciones referentes a la ficha ingresada</FormText>
                    </Col>
                  </FormGroup>
                </CardBody>
              </Card>
            </Col>

            <Col xs="12" md="4">
              <Card>
                <CardHeader>
                  <strong>Otros</strong> Características adicionales
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtHeight">Estatura</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <InputGroup>
                        <Input
                          type="number"
                          id="lvtHeight"
                          name="lvtHeight"
                          placeholder="170"
                          value={this.state.formFields.lvtHeight}
                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                          valid={this.state.errorFields.valid.indexOf("lvtHeight") > -1}
                          invalid={this.state.errorFields.invalid.indexOf("lvtHeight") > -1}
                        />
                        <InputGroupAddon addonType="append">
                          <InputGroupText>
                            {defines.LVT_DISTANCE_UNIT}
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <FormText color="muted">Escribe cuánto mide la persona</FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtWeight">Peso</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <InputGroup>
                        <Input
                          type="number"
                          id="lvtWeight"
                          name="lvtWeight"
                          placeholder="63"
                          value={this.state.formFields.lvtWeight}
                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                          valid={this.state.errorFields.valid.indexOf("lvtWeight") > -1}
                          invalid={this.state.errorFields.invalid.indexOf("lvtWeight") > -1}
                        />
                        <InputGroupAddon addonType="append">
                          <InputGroupText>
                            {defines.LVT_WEIGHT_UNIT}
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <FormText color="muted">Escribe cuánto pesa la persona</FormText>
                    </Col>
                  </FormGroup>
                  {(customFieldList || []).map((customFieldObj, index) =>
                    <CustomField
                      key={index}
                      customFieldObj={customFieldObj}
                      defineas={defines.CUSTOM_FIELD_PREFIX}
                      customFieldsData={this.state.customFieldsData}
                      customFieldValue={this.state.editCustomValues[defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfield]}
                      onCustomFieldChange={(e) => this.customInputChangeHandler.call(this, e)}
                      errorFields={this.state.errorFields}
                    />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>


          <Card>
            <CardFooter>
                <Button type="submit" size="sm" color="primary" onClick={this.handleSubmit} ><i className="fa fa-dot-circle-o"></i> Guardar</Button>
              {' '}
              { this.props.match.params && this.props.match.params.id &&
                <Button color="dark" size="sm" onClick={this.handleVolverADetalle}> Volver al detalle </Button>
              }

            </CardFooter>
          </Card>
        </Form>
      </div>
    );
  }

  handleVolverADetalle = () => {

    this.setState({redirect_detail:true})
  }

  parsePersonField(field) {
    switch (field) {
      case 'dni':
        return 'lvtDNI'
        break;
      case 'firstname':
        return 'lvtFirstname'
        break;
      case 'lastname':
        return 'lvtLastname'
        break;
      case 'dob':
        return 'lvtDateOfBirth'
        break;
      case 'gender':
        return 'lvtGender'
        break;
      case 'height':
        return 'lvtHeight'
        break;
      case 'weight':
        return 'lvtWeight'
        break;
      case 'ruc':
        return 'lvtRUC'
        break;
      case 'email':
        return 'lvtEmail'
        break;
      case 'phone1':
        return 'lvtCellphone'
        break;
      case 'phone2':
        return 'lvtPhone'
        break;
      case 'address':
        return 'lvtAddress'
        break;
      case 'observations':
        return 'lvtObservations'
        break;
      case 'photo':
        return 'lvtImages'
        break;
      case 'videos':
        return 'lvtVideos'
        break;
      default:
        break;
    }
    return field;
  }

  parsePersonData(field, value) {
    switch (field) {
      case 'dob':
        console.log('value:', value);
        let temp_date = new Date(value)
        let y = temp_date.getFullYear();
        let d = temp_date.getDate() + 1;
        d = d < 10 ? ("0" + d).slice(-2) : d;
        let m = temp_date.getMonth() + 1;
        m = m < 10 ? ("0" + m).slice(-2) : m;
        let date = y + '-' + m + '-' + d;
        return date
        break;
      case 'gender':
        if (value === 'Femenino')
          return 2;
        else if (value === 'Masculino')
          return 1;
        else if (value === 'Otros')
          return 3;
        break;
      default:
        return value
        break;
    }
    return field;
  }

  parseCustomFields(customData) {
    let formCustoms = this.state.customFieldsData;
    let editCustomValues = this.state.editCustomValues;
    customData.map((f) => {
      formCustoms.map((obj) => {
        if (f.idfield === obj.idfield) {
          if(f.options)
            obj.value = f.options;
          else if( f.value)
            obj.value = f.value;

          
          editCustomValues[defines.CUSTOM_FIELD_PREFIX + f.idfield] = obj.value;
          // console.log('--- PARSIND DATA: ', editCustomValues[defines.CUSTOM_FIELD_PREFIX + f.idfield]  );
        }
      })
    });
    this.setState({ editCustomValues });
  }

  parsePhotos = (photos) => {
    photos.map((photo) => {
      photo['name'] = photo.idimage;
      photo['source'] = photo.thumbnail;
      return photo;
    })
    return photos;
  }

  parseVideos = (videos) => {
    
    videos.map((video) => {
      let video_name = video.url.split('casting/videos/');
      if(video_name.length > 1){
        video_name = video_name[1]
      }else{
        video_name = video_name[0]
      }
      video['filename'] = video_name
      video['source'] = video_name
      video['options'] = {type:'limbo'}
    })
    return videos;
  }


  /**
   * RUG CUSTOM FUNCTIOLITY
   */

  rugSource = (response) => {
    return response.images;
  }

  rugOnWarning = (type, rules) => {
    switch (type) {
      case 'accept':
        console.log(`Only ${rules.accept.join(', ')}`)
        break;

      case 'limit':
        console.log('limit <= ', rules.limit)
        break;

      case 'size':
        console.log('max size <= ', rules.size)
        break;

      case 'minWidth': case 'minHeight':
        console.log('Dimensions > ', `${rules.width.min}x${rules.height.min}`)
        break;

      case 'maxWidth': case 'maxHeight':
        console.log('Dimensions < ', `${rules.width.max}x${rules.height.max}`)
        break;

      default:
        break;
    }
  }

  rugOnSuccess = (imageUploaded) => {
    console.log('======: on success: ', imageUploaded)
    let arrImages = this.state.lvtImages
    arrImages.push({
      "uid": imageUploaded.uid,
      "name": imageUploaded.name,
      "source": imageUploaded.source.imgThumbnail,
      "imgThumbnail": imageUploaded.source.imgThumbnail,
      "imgOptimized": imageUploaded.source.imgOptimized,
      "imgOriginal": imageUploaded.source.imgOriginal
    })
    this.setState({ lvtImages: arrImages })
  }

  rugOnConfirmDelete = (currentImage, images) => {
    console.log(' currentImage: ', currentImage)
    console.log(' currentImage to delete : ', currentImage.source)
    return window.confirm(`¿Seguro que desea eliminar '${currentImage.name}'?`)
  }

  rugOnDeleted = (deletedImage, images) => {
    console.log(' deletedImage: ', deletedImage)
    let temp_images_deletes = this.state.lvtDeletedImages;
    let arrImages = this.state.lvtImages.filter(function (item) {
      if (item.imgThumbnail !== deletedImage.imgThumbnail || item.thumbnail != deletedImage.imgThumbnail) {
        return true
      }
      return false;
    })

    if (deletedImage.selected && images.length) {
      images[0].select()
    }
    temp_images_deletes.push(deletedImage.idimage);
    this.setState({ lvtImages: arrImages, lvtDeletedImages: temp_images_deletes })
  }
}

export default Create;
