import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row 
} from 'reactstrap';
import labels from '../../../labels'

class CustomModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      modalType : ( this.props.modalType !== '' ) ? this.props.modalType : 'primary',
      modalTitle: ( this.props.modalTitle !== '' ) ? this.props.modalTitle : labels.LVT_MODAL_DEFAULT_TITLE,
      modalBody: ( this.props.modalBody !== '' ) ? this.props.modalBody : '',
      labelOkButton: ( this.props.labelOkButton !== '' ) ? this.props.labelOkButton : 'Ok',
      labelCancelButton: ( this.props.labelCancelButton !== '' ) ? this.props.labelCancelButton : 'Cancel',
    };
    
    this.toggleCustomModal = this.toggleCustomModal.bind(this);
  }

  toggleCustomModal() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  // this.props.onCustomFieldChange(e);

  render() {
    return (
      <Modal isOpen={this.state.visible} toggle={this.toggleCustomModal} className={`modal-${this.state.modalType} ` + this.props.className}>
        <ModalHeader toggle={this.toggleCustomModal}>{ this.state.modalTitle }</ModalHeader>
        <ModalBody>
          { this.state.modalBody }
        </ModalBody>
        <ModalFooter>
          <Button color={`${this.state.modalType}`} onClick={this.toggleCustomModal}>
            { this.state.labelOkButton }
          </Button>{' '}
          <Button color="secondary" onClick={this.toggleCustomModal}>
            { this.state.labelCancelButton }
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default CustomModal;
