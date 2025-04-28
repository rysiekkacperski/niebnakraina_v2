import Box from "@mui/material/Box";

import { useFormik } from "formik";
import * as Yup from 'yup';
import Text from "./text";

function CustomForm({ 
  children, 
  sx,
  gdprMessage, 
  initialValues, 
  validationObject, 
  onSubmitFunc, 
}){

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object(validationObject),
    onSubmit: async (values, { resetForm }) => {
      onSubmitFunc(values, resetForm);
    },
  });

  return (
    <>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: 'center',
          gap: 1,
          ...sx
      }}
      >
        {children(formik)}
      </Box>

      {
        gdprMessage ?
          <Text.Small>
            {gdprMessage}
          </Text.Small>
        :
          <></> 
      }
    </>
  )
}

export default CustomForm;