/**
 * Customized decorator
 * wrap a Promise, unify the loading effect
 */
import React from 'react'
import ReactDOM from 'react-dom'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function closeLoading() {
  ReactDOM.render(
    <></>,
    document.getElementById('loading')
  );
}

function openLoading(classes) {
  ReactDOM.render(
    <Backdrop className={classes.backdrop} open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>,
    document.getElementById('loading')
  );
}

export default (...config) => (target, name, descriptor) => {
  const origin = descriptor.value
  const classes = useStyles();

  descriptor.value = async (...args) => {
    openLoading(classes)
    await origin(...args)
    closeLoading()
  }

  return descriptor
}