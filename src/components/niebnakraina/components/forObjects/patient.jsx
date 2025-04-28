import { useState, useEffect, use, forwardRef, useRef, useCallback } from "react";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import NiebnaButtons from "../buttons";
import CustomForm from "../../../general/form";
import validation from "../../../form/schema";
import Input from "../../../form/input";

import Patient from "../../../functionality/objects/patient";

import AlertManager from "../../../general/alert";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

const AddPatientDialog = ({ownerId=null, isAdult=null}) => {

  const [open, setOpen] = useState(false);
  const { setAlert } = use(AlertManager.Context)

  const formikManagerRef = useRef(null);

  const handleSubmit = () => {
    if (formikManagerRef.current) {
      formikManagerRef.current.handleSubmit();
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const initialValues = {
    ownerId: ownerId != null ? ownerId : '',
    isAdult: isAdult != null ? isAdult : false,
    name: '',
    age: ''
  }

  const validationSchema = {
    name: validation.name(),
    age: validation.age()
  }

  const addPatient = async (values, resetForm) => {
    try {
      const newPatient = new Patient(values.ownerId, values.name, values.age, values.isAdult);
      const docRef = await newPatient.add(); // Ensure this returns a docRef

      resetForm();
      handleClose();
  
      setAlert('success', 'Poprawnie dodano pacjenta');
    } catch (error) {
      console.error('Błąd podczas dodawania pacjenta:', error);
      setAlert('error', 'Nie udało się dodać pacjenta. Spróbuj ponownie');
    }
  };

  return (
    <>
      <NiebnaButtons.AddPatient variant="outlined" onClick={handleClickOpen}/>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Dodaj nowego pacjenta</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText>
              Wypełnij poniższy formularz, aby dodać nowego pacjenta
            </DialogContentText>
            <CustomForm
              initialValues={initialValues}
              validationObject={validationSchema}
              onSubmitFunc={addPatient}
              sx={{
                display:'flex',
                flexDirection: 'column'
              }}
            >
              {
                (formik) => {

                  useEffect(() => {
                    formikManagerRef.current = formik;
                  }, []); // Run only once when formik is initialized
                 
                  return(
                    <>
                      <Input.Name formik={formik} />
                      <Input.Age formik={formik} />
                    </>
                  );
                }
              }
            </CustomForm>  
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Anuluj</Button>
          <Button onClick={handleSubmit}>Dodaj</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const PatientComponents = {
  AddPatientDialog: AddPatientDialog
}

export default PatientComponents;