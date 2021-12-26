import React from "react";
import MainApp from "./component/Main";
import * as customerActions from './redux/action/customer.actions';
import { bindActionCreators } from 'redux';

import MessengerCustomerChat from 'react-messenger-customer-chat';

import { connect } from "react-redux";

function App(props) {

  <div>
     <MessengerCustomerChat
    pageId="<102906258937008>"
    appId="<496748328328301>"
   
  />,
  </div>
  return (
    <MainApp {...props} />
    
  );
}

const mapStateToProps = state => {
  return {
    searchValue: state.customerReducer.searchValue,
    searchCategory: state.customerReducer.searchCategory,
  }
}

const Actions = {
  ...customerActions,
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
