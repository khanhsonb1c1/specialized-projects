import React from "react";
import MainApp from "./component/Main";
import * as customerActions from './redux/action/customer.actions';
import { bindActionCreators } from 'redux';

import { connect } from "react-redux";

function App(props) {
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
