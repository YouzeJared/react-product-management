import React, { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/core/Alert';

const Snackbars = () => {
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleSuccess = () => {
    setOpen(true);
  };

  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
      <MuiAlert onClose={handleClose} severity="success" elevation={6} variant="filled">
        Data edited successfully!
      </MuiAlert>
    </Snackbar>
  );
};

export default Snackbars;
