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

const RUG_RULES = { limit: 10, size: 20000 };
const RUG_ACCEPT = ['jpg', 'jpeg', 'png'];
const RUG_ACTION = defines.API_DOMAIN + '/uploadpropimages';

class Create extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formFields: {
        lvt_prop_id:'',
        module: defines.LVT_PROPS,
        lvtName: '',
        lvtWidth: '',
        lvtHeight: '',
        lvtLength: '',
        lvtWeight: '',
        lvtObservations: '',
      },
      loading: false,
      error: false,
      redirect: false,
      redirect_detail: false,
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
    this.parsePropData = this.parsePropData.bind(this);
    this.parsePropField = this.parsePropField.bind(this);
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
    if (this.state.formFields.lvtName === '') {
      this.addFormError('lvtName');
    } else {
      this.removeFormError('lvtName');
    }
    if (this.state.formFields.lvtWidth === '') {
      this.addFormError('lvtWidth');
    } else {
      this.removeFormError('lvtWidth');
    }
    if (this.state.formFields.lvtHeight === '') {
      this.addFormError('lvtHeight');
    } else {
      this.removeFormError('lvtHeight');
    }
    if (this.state.formFields.lvtLength === '') {
      this.addFormError('lvtLength');
    } else {
      this.removeFormError('lvtLength');
    }
    if (this.state.formFields.lvtWeight === '') {
      this.addFormError('lvtWeight');
    } else {
      this.removeFormError('lvtWeight');
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
    let imagesProp = [];
    let temp_images_deletes = this.state.lvtDeletedImages;
    if(this.props.match.params && this.props.match.params.id){
      
      imagesProp = {}
      imagesProp['updated'] = this.state.lvtImages.filter(function (imageProp) {
        if(imageProp.idimage && temp_images_deletes.indexOf(imageProp.idimage) < 0)
          return {
            idimage: imageProp.idimage,
            thumbnail: imageProp.imgThumbnail,
            optimized: imageProp.imgOptimized,
            original: imageProp.imgOriginal
          }
      });
      imagesProp['new'] = this.state.lvtImages.filter(function (imageProp) {
        if(imageProp.idimage === undefined){
            return imageProp;
        }
      });
      imagesProp['new'] = imagesProp['new'].map(function (imageProp) {
        return {
          thumbnail: imageProp.imgThumbnail,
          optimized: imageProp.imgOptimized,
          original: imageProp.imgOriginal
        }
      });

      if(this.state.lvtDeletedImages.length>0){
        imagesProp['deleted'] = this.state.lvtDeletedImages
      }
    }else{
      imagesProp = this.state.lvtImages.map(function (imageProp) {
        return {
          thumbnail: imageProp.imgThumbnail,
          optimized: imageProp.imgOptimized,
          original: imageProp.imgOriginal
        }
      });
    }

    console.log('================== imagesProp ----:  ', imagesProp);

    // return false;

    // Get video uploaded
    let videosProp = this.state.lvtVideos.map(function (videoProp) {
      return {
        url: videoProp.filename,
      }
    });

    // Setting data to request
    const propData = {
      module: defines.LVT_PROPS,
      defaultfields: [{
        name: this.state.formFields.lvtName,
        width: parseInt(this.state.formFields.lvtWidth),
        height: parseInt(this.state.formFields.lvtHeight),
        length: parseInt(this.state.formFields.lvtLength),
        weight: parseInt(this.state.formFields.lvtWeight),
        observations: this.state.formFields.lvtObservations,
        createdby: 1,
      }],
      customfields: customfields,
      images: imagesProp,
      videos: videosProp,
    };

    console.log("---- propData ----");
    console.log(JSON.stringify(propData));

    if (this.state.errorFields.invalid.length === 0) {

      this.setState({ loading: true });
      let save_prop;

      if (this.props.match.params && this.props.match.params.id) {
        save_prop = axios.put(defines.API_DOMAIN + '/prop/update/?id=' + this.props.match.params.id, propData);
        this.saveCall(save_prop);
      }else{
        // if(this.state.formFields.lvtDNI !== ''){
        //   axios.post(
        //       defines.API_DOMAIN + '/searchprop/',
        //       { dni: this.state.formFields.lvtDNI, limit: 5,
        //         offset: 0, }
        //   )
        //   .then((response) => {
        //     console.log('SEARCH DE PROP: ', response)
        //     let resp = response[0];
            
        //     this.setState({
              
        //       modalData: {
        //         modalType: 'danger',
        //         modalBody: labels.LVT_LABEL_CEDULA_EXISTENTE,
        //         modalTitle: labels.LVT_MODAL_DEFAULT_TITLE,
        //         modalOkButton: labels.LVT_MODAL_DEFAULT_BUTTON_OK,
        //         okFunctionState: this.cancelFunctionState
        //       },
        //       modalVisible: true,
        //       loading: false,
        //       error: false

        //     });

        //   })
        //   .catch((error) => {
        //     if (error.response) {
        //       if (error.response.data.sucess) {
        //         save_prop = axios.post(defines.API_DOMAIN + '/prop/', propData);
        //         this.saveCall(save_prop);
        //       }
        //       console.log(error.response.data);
        //     } else if (error.request) {
        //       console.log(error.request);
        //     } else {
        //       console.log('Error', error.message);
        //     }
        //     this.setState({ loading: false, error: true });
        //   });
        // }else{
          save_prop = axios.post(defines.API_DOMAIN + '/prop/', propData);
          this.saveCall(save_prop);
        //}
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

  saveCall = (save_prop) =>{
    axios.all([save_prop])
        .then((response) => {
          let resp = response[0];
          // console.log('===== PROP GUARDADA :',resp );
          if (resp.status === 201 || resp.status === 200) {
            this.setState({
              
              modalData: {
                modalType: 'primary',
                modalTitle: labels.LVT_MODAL_DEFAULT_TITLE,
                modalBody: labels.LVT_LABEL_PROPS_GUARDADA_EXITOSAMENTE,
                modalOkButton: labels.LVT_MODAL_DEFAULT_BUTTON_OK,
                okFunctionState: this.enableRedirect
              },
              error: false,
              loading: false,
              modalVisible: true,
            });
          } else {
            console.log('----- THROW ERROR create prop -------')
            throw new Error(JSON.stringify({ status: resp.status, error: resp.data.data.msg }));
          }
        })
        .catch((error) => {
          if (error.response) {
            this.setState({
              modalVisible: true,
              modalData: {
                modalType: 'danger',
                modalBody: error.response.data.data ? error.response.data.data.msg : labels.LVT_ERROR_UNPROCCESS_REQUEST,
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
    if(np.match.params.id && np.match.params.id !== this.state.lvt_prop_id){
      this.fetchPropDetail(np.match.params.id);
    }
  }
  componentDidMount() {
    // Fetch custom fields
    axios.get(defines.API_DOMAIN + '/field?module=' + defines.LVT_PROPS)
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
            this.setState({lvt_prop_id:this.props.match.params.id})
            this.fetchPropDetail(this.props.match.params.id);
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
  }

  fetchPropDetail = (lvt_prop_id) => {
    this.setState({ loading: true })

    axios.get(defines.API_DOMAIN + '/prop?module=' + defines.LVT_PROPS + '&id=' + lvt_prop_id)
        .then((response) => {
          if (response.status === 200) {
            const propData = response.data.data;
            let f = '';
            let v = '';
            for (let field of Object.keys(propData.defaultfields)) {

              let formFields = { ...this.state.formFields };
              f = this.parsePropField(field);
              v = this.parsePropData(field, propData.defaultfields[field]);
              
              formFields[f] = v;
              this.setState({ formFields });
              f = ''; v = '';
            }
          
            this.parseCustomFields(propData.customfield);
            this.setState({ ['lvtImages']: this.parsePhotos(propData.images) });
            this.setState({ ['lvtVideos']: this.parseVideos(propData.videos) });
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
    let customFieldList = this.state.customFields;
    let lvtVideos = this.state.lvtVideos;

    // console.log('-------this.state.modalData:  ', this.state.modalData)

    if (this.state.redirect) {
      return <Redirect to='/prop/list' />;
    }
    if (this.state.redirect_detail) {
      return <Redirect to={'/prop/'+this.props.match.params.id} />;
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
        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal" id="lvt-form-prop" onSubmit={this.handleSubmit} >
          <Row>
            <Col xs="12" md="6">
              <Card>
                <CardHeader>
                  <strong>Información</strong> Básica
                </CardHeader>
                <CardBody>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtName">Nombre</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="text"
                        id="lvtName"
                        name="lvtName"
                        placeholder="Cosa"
                        autoComplete="nope"
                        value={this.state.formFields.lvtName}
                        onChange={(e) => this.inputChangeHandler.call(this, e)}
                        valid={this.state.errorFields.valid.indexOf("lvtName") > -1}
                        invalid={this.state.errorFields.invalid.indexOf("lvtName") > -1}
                      />
                      <FormText color="muted">Nombres de la ficha ingresada</FormText>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtWidth">Ancho</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <InputGroup>
                        <Input
                          type="number"
                          id="lvtWidth"
                          name="lvtWidth"
                          placeholder="170"
                          value={this.state.formFields.lvtWidth}
                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                          valid={this.state.errorFields.valid.indexOf("lvtWidth") > -1}
                          invalid={this.state.errorFields.invalid.indexOf("lvtWidth") > -1}
                        />
                        <InputGroupAddon addonType="append">
                          <InputGroupText>
                            {defines.LVT_DISTANCE_UNIT}
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <FormText color="muted">Escribe cuánto mide de ancho</FormText>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtHeight">Alto</Label>
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
                      <FormText color="muted">Escribe cuánto mide de altura</FormText>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtLength">Largo</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <InputGroup>
                        <Input
                          type="number"
                          id="lvtLength"
                          name="lvtLength"
                          placeholder="170"
                          value={this.state.formFields.lvtLength}
                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                          valid={this.state.errorFields.valid.indexOf("lvtLength") > -1}
                          invalid={this.state.errorFields.invalid.indexOf("lvtLength") > -1}
                        />
                        <InputGroupAddon addonType="append">
                          <InputGroupText>
                            {defines.LVT_DISTANCE_UNIT}
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <FormText color="muted">Escribe el largo</FormText>
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
                      <FormText color="muted">Escribe cuánto pesa.</FormText>
                    </Col>
                  </FormGroup>
                  
                </CardBody>
              </Card>
            </Col>

            <Col xs="12" md="6">
              <Card>
                <CardHeader>
                  <strong>Otros</strong> Características adicionales
                </CardHeader>
                <CardBody>
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

            <Col xs="12" md="6">
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
                        placeholder="Ingrese observaciones."
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
          </Row>

          <Row>
            <Col xs="12" md="12">
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
            </Col>
          </Row>

          <Row>
            <Col xs="12" md="6">
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
                        // files={this.state.lvtVideos}
                        // files={
                        //   [{source:defines.API_DOMAIN + '/uploadvideo/1582595290262-video2020-02-2420-35-35.mp4'}]
                        // }
                        allowMultiple={true}
                        allowDrop={false}
                        acceptedFileTypes={['video/*']}
                        server={defines.API_DOMAIN + '/uploadpropsvideos'}
                        oninit={() => this.handleInitUpload()}
                        onprocessfile={(error, file) => {
                          console.log('file processed: ', file)
                          let processedFile = JSON.parse(file.serverId);
                          let arrVideos = this.state.lvtVideos;
                          arrVideos.push({
                            "filename": processedFile.video,
                            "source": processedFile.video,
                            "options": {
                                type: 'limbo'
                            }
                          })
                          this.setState({ lvtVideos: arrVideos })
                        }}

                      // onupdatefiles={(fileItems) => {
                      //   this.setState({
                      //     lvtVideos: fileItems.map(fileItem => fileItem.filename)
                      //   });
                      //   console.log(this.state.lvtVideos);
                      // }}
                      />
                      <FormText color="muted">Vídeo a mostrar</FormText>
                    </Col>
                  </FormGroup>
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

  parsePropField(field) {
    switch (field) {
      case 'name':
        return 'lvtName'
        break;
      case 'width':
        return 'lvtWidth'
        break;
      case 'height':
        return 'lvtHeight'
        break;
      case 'length':
        return 'lvtLength'
        break;
      case 'weight':
        return 'lvtWeight'
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

  parsePropData(field, value) {
    switch (field) {
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
          if(f.options){
            obj.value = f.options;
          }else if( f.value){
            obj.value = f.value;
          }
          
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
      video['filename'] = video.url
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
