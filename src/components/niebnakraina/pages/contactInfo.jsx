import { use, useState, useEffect } from "react";
import { useNavigate } from 'react-router';

import Section from "../../general/section";
import CustomCard from "../../general/card";
import CustomForm from "../../general/form";
import validation from "../../form/schema";
import AlertManager from "../../general/alert";
import Input from "../../form/input";
import Stack from "@mui/material/Stack";
import CustomButton from "../../general/buttons";
import Redirect from "../../functionality/redirect";

import { FirebaseContext } from "../../../firebaseProvider";
import User from "../../functionality/objects/user";

const ContactInfoPage = () => {

  const navigate = useNavigate();
  const { setAlert } = use(AlertManager.Context);
  const { currentUser } = use(FirebaseContext);
  const [userObject, setUserObject] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (currentUser && currentUser.uid) {
        const user = await User.getByUserId(currentUser.uid);
        setUserObject(user);
      }
    };
    fetchUser();
  }, [currentUser]);

  const from = localStorage.getItem('redirectAfterInfoUpdate') || '/';

  if (!userObject) {

    return (
      <Redirect.PrivateRoute>
        <div>Loading...</div>
      </Redirect.PrivateRoute>
    );
  }

  const initials = {
    nameSurname: userObject.nameSurname || "",
    prefix: userObject.prefix || "+48",
    phoneNumber: userObject.phoneNumber || "",
    age: userObject.age || "",
  };

  const schema = {
    nameSurname: validation.nameSurname(),
    phoneNumber: validation.phoneNumber(),
    age: validation.age(false),
  }

  const submitFunc = async (values, resetForm) => {
    userObject.nameSurname = values.nameSurname;
    userObject.prefix = values.prefix;
    userObject.phoneNumber = values.phoneNumber;
    userObject.age = values.age;
    try{
      await userObject.update()
      setAlert('success', 'Pomyślnie zaktualizowano dane kontaktowe')
      resetForm();
      // Removing redirection item if exists
      if(localStorage.getItem('redirectAfterInfoUpdate'))
        localStorage.removeItem('redirectAfterInfoUpdate');
      navigate(from, { replace: true });
    }
    catch{
      setAlert('error', 'Nie udało się zaktualizować danych kontaktowych. Spróbuj ponownie')
    }
  }

  return(
    <Redirect.PrivateRoute>
      <Section full first>
        <CustomCard.Form
          image='/img/happy_people.webp'
          title='Uzupełnij swoje dane kontaktowe'
          label='DANE KONTAKTOWE'
          sx={{ 
            display: 'flex', 
            justifyContent: 'center' 
          }} 
        >
          <CustomForm 
            initialValues={initials}
            validationObject={schema}
            gdprMessage={'Klikając "Kontynuj" zgadzasz się na przetwarzenie Twoich danych osobowych w celach realizacji usług Niebnej Krainy'}
            onSubmitFunc={submitFunc}
          >
            {
              (formik) =>
                <Stack 
                  spacing={2}
                  sx={{ 
                    width: '100%', 
                    display: 'flex',
                  }}  
                >
                  <Input.Label label={'Imię i nazwisko (wymagane)'}>
                    <Input.NameSurname formik={formik} />
                  </Input.Label>
                  <Input.Label label={'Numer telefonu (wymagane)'}>
                    <Input.PhoneNumber formik={formik} />
                  </Input.Label>
                  <Input.Label label={'Wiek'} message={'Podaj tylko jeśli zamierzasz rezerwować wizyty dla siebie, jako dorosły'}>
                    <Input.Age formik={formik} />
                  </Input.Label>
                  <CustomButton.Button type='submit' size='large'>Kontynuj</CustomButton.Button>
                </Stack>    
            }
          </CustomForm>
        </CustomCard.Form>
      </Section>
    </Redirect.PrivateRoute>
  );

}

export default ContactInfoPage;