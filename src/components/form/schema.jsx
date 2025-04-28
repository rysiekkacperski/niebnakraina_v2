import * as Yup from 'yup';

function phoneNumberValidation(required=true){
  let validation = Yup.string()
    .min(9, 'Podany numer jest zbyt krótki')
    .max(9, 'Podany numer jest zbyt długi')
    .matches(/^\d+$/, "Podany numer nie składa się jedynie z liczb");

  if(required){
    validation = validation.required('Numer telefonu jest wymagany');
  } else {
    validation = validation.notRequired(); // Explicitly allow undefined values
  }
  
  return validation
}

function emailValidation(required=true){
  let validation = Yup.string().email('Podaj prawidłowy adres e-mail')
    .max(100, 'Podany adres e-mail jest zbyt długi');
  
  if(required){
    validation = validation.required('Adres e-mail jest wymagany');
  } else {
    validation = validation.notRequired(); // Explicitly allow undefined values
  }
    
  return validation
}

function passwordValidation(required=true){
  let validation = Yup.string()
    .min(7, 'Hasło powinno składać się z przynajmniej 7 znaków')
    .max(25, 'Hasło powinno składać się z maksymalnie 25 znaków')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Hasło powinno zawierać przynajmniej jeden znak specjalny');
  
  if(required){
    validation = validation.required('Hasło jest wymagane');
  } else {
    validation = validation.notRequired(); // Explicitly allow undefined values
  }
    
  return validation
}

function messageContentValidation(length=1000, required=true){
  let validation = Yup.string().max(length, 'Wiadomość jest zbyt długa')
  
  if(required){
    validation = validation.required('Wiadomość jest wymagana');
  } else {
    validation = validation.notRequired(); // Explicitly allow undefined values
  }
    
  return validation
}

function messageTopicValidation(length=150, required=true){
  let validation = Yup.string().max(length, 'Temat wiadomości jest zbyt długi')
  
  if(required){
    validation = validation.required('Temat wiadomości jest wymagany');
  } else {
    validation = validation.notRequired(); // Explicitly allow undefined values
  }
    
  return validation
}

function nameSurnameValidation(length=100, required=true){
  let validation = Yup.string().max(length, 'Imię i nazwisko są zbyt długie')
  
  if(required){
    validation = validation.required('Imię i nazwisko są wymagane');
  } else {
    validation = validation.notRequired(); // Explicitly allow undefined values
  }
    
  return validation
}

function nameValidation(length=20, required=true){
  let validation = Yup.string().max(length, 'Imię jest zbyt długie')
  
  if(required){
    validation = validation.required('Imię jest wymagane');
  } else {
    validation = validation.notRequired(); // Explicitly allow undefined values
  }
    
  return validation
}

function taxIdValidation(required=true){
  let validation = Yup.string()
    .min(10, 'Podany NIP jest zbyt krótki')
    .max(10, 'Podany NIP jest zbyt długi')
    .matches(/^\d+$/, "Podany NIP nie składa się jedynie z liczb")
    .test(
      'isPlTaxIdValid',
      'Podany NIP jest nieprawidłowy',
      (value) => {

        if (!value) return true; // Allow empty values when not required
        
        let nipArray = value.split('');
        let controlDigit = Number(nipArray.at(9));
        nipArray = nipArray.toSpliced(9, 1);
        let multipliers = [6, 5, 7, 2, 3, 4, 5, 6, 7];

        let sum = nipArray.map((digit, index) => 
          Number(digit) * multipliers.at(index))

        sum = sum.reduce((a, b) => a + b, 0)
        return sum % 11 == controlDigit
      }
    );

  if (required) {
    validation = validation.required('Numer NIP jest wymagany');
  } else {
    validation = validation.notRequired(); // Explicitly allow undefined values
  }
  
  return validation
}

function quantityValidation(required=true){
  let validation = Yup.number().
    positive('Podana ilość musi być większa niż 0');

  if(required){
    validation = validation.required('Ilość jest wymagana');
  } else {
    validation = validation.notRequired(); // Explicitly allow undefined values
  }
  
  return validation
}

function ageValidation(required=true){
  let validation = Yup.number('Podana wartość musi być cyfrą').
    positive('Wiek musi być większy niż 0');

  if(required){
    validation = validation.required('Wiek jest wymagany');
  } else {
    validation = validation.notRequired(); // Explicitly allow undefined values
  }
  
  return validation
}

function postalCodeValidation(required=true){
  let validation = Yup.string()
    .min(5, 'Podany kod pocztowy jest zbyt krótki')
    .max(6, 'Podany kod pocztowy jest zbyt długi')
    .matches(/^\d{2}-\d{3}$/, "Format kodu pocztowego jest nieprawidłowy");

  if(required){
    validation = validation.required('Kod pocztowy jest wymagany');
  } else {
    validation = validation.notRequired(); // Explicitly allow undefined values
  }
  
  return validation
}


const validation = {
  phoneNumber : phoneNumberValidation,
  email: emailValidation,
  nameSurname: nameSurnameValidation,
  name: nameValidation,
  messageContent: messageContentValidation,
  messageTopic: messageTopicValidation,
  taxId: taxIdValidation,
  quantity: quantityValidation,
  postalCode: postalCodeValidation,
  password: passwordValidation,
  age: ageValidation,
}

export default validation;