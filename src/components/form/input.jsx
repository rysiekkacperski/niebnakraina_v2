import { InputAdornment, TextField, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Text from "../general/text";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

const europeanPrefixes = [
  { name: 'Austria', prefix: '+43', flagUrl: 'https://flagcdn.com/at.svg' },
  { name: 'Belgium', prefix: '+32', flagUrl: 'https://flagcdn.com/be.svg' },
  { name: 'Bulgaria', prefix: '+359', flagUrl: 'https://flagcdn.com/bg.svg' },
  { name: 'Croatia', prefix: '+385', flagUrl: 'https://flagcdn.com/hr.svg' },
  { name: 'Cyprus', prefix: '+357', flagUrl: 'https://flagcdn.com/cy.svg' },
  { name: 'Czech Republic', prefix: '+420', flagUrl: 'https://flagcdn.com/cz.svg' },
  { name: 'Denmark', prefix: '+45', flagUrl: 'https://flagcdn.com/dk.svg' },
  { name: 'Estonia', prefix: '+372', flagUrl: 'https://flagcdn.com/ee.svg' },
  { name: 'Finland', prefix: '+358', flagUrl: 'https://flagcdn.com/fi.svg' },
  { name: 'France', prefix: '+33', flagUrl: 'https://flagcdn.com/fr.svg' },
  { name: 'Germany', prefix: '+49', flagUrl: 'https://flagcdn.com/de.svg' },
  { name: 'Greece', prefix: '+30', flagUrl: 'https://flagcdn.com/gr.svg' },
  { name: 'Hungary', prefix: '+36', flagUrl: 'https://flagcdn.com/hu.svg' },
  { name: 'Ireland', prefix: '+353', flagUrl: 'https://flagcdn.com/ie.svg' },
  { name: 'Italy', prefix: '+39', flagUrl: 'https://flagcdn.com/it.svg' },
  { name: 'Latvia', prefix: '+371', flagUrl: 'https://flagcdn.com/lv.svg' },
  { name: 'Lithuania', prefix: '+370', flagUrl: 'https://flagcdn.com/lt.svg' },
  { name: 'Luxembourg', prefix: '+352', flagUrl: 'https://flagcdn.com/lu.svg' },
  { name: 'Malta', prefix: '+356', flagUrl: 'https://flagcdn.com/mt.svg' },
  { name: 'Netherlands', prefix: '+31', flagUrl: 'https://flagcdn.com/nl.svg' },
  { name: 'Poland', prefix: '+48', flagUrl: 'https://flagcdn.com/pl.svg' },
  { name: 'Portugal', prefix: '+351', flagUrl: 'https://flagcdn.com/pt.svg' },
  { name: 'Romania', prefix: '+40', flagUrl: 'https://flagcdn.com/ro.svg' },
  { name: 'Slovakia', prefix: '+421', flagUrl: 'https://flagcdn.com/sk.svg' },
  { name: 'Slovenia', prefix: '+386', flagUrl: 'https://flagcdn.com/si.svg' },
  { name: 'Spain', prefix: '+34', flagUrl: 'https://flagcdn.com/es.svg' },
  { name: 'Sweden', prefix: '+46', flagUrl: 'https://flagcdn.com/se.svg' }
];

const PrefixSelect = styled(TextField)(({ theme }) => ({
  "& .MuiSelect-select": {
    padding: theme.spacing(1),
  },
  minWidth: "fit-content",
  borderRight: "1px solid rgba(0, 0, 0, 0.23)",
}));

const PhoneInput = styled(TextField)(({ theme }) => ({
  flexGrow: 1,
  fontSize: "1rem",
}));

function PhoneNumberInput({formik}){

  const handlePhoneNumberChange = (e) => {
    const cleanedValue = e.target.value.replace(/\s+/g, "");
    formik.setFieldValue("phoneNumber", cleanedValue); //
  };

  return(
    <PhoneInput
      fullWidth
      name="phoneNumber"
      placeholder="Numer telefonu"
      value={formik.values.phoneNumber}
      onChange={handlePhoneNumberChange}
      onBlur={formik.handleBlur}
      type="tel"
      error={!!formik.errors.phoneNumber && !!formik.touched.phoneNumber} // Error handling for phone number
      helperText={formik.errors.phoneNumber}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PrefixSelect
              select
              name="prefix"
              value={formik.values.prefix}
              onChange={formik.handleChange}
              variant="standard"
              InputProps={{
                disableUnderline: true, // Remove underline for seamless integration
              }}
            >
              {europeanPrefixes.map((option) => (
                <MenuItem key={option.prefix} value={option.prefix}>
                  <img
                    src={option.flagUrl}
                    alt={`${option.name} flag`}
                    style={{ width: '20px', marginRight: '8px', verticalAlign: 'middle' }}
                  />
                  {option.prefix}
                </MenuItem>
              ))}

            </PrefixSelect>
          </InputAdornment>
        ),
      }}
    />
    
  );
}

function EmailInput({ formik }) {
  return (
    <TextField
      name="email"
      fullWidth
      placeholder="Adres e-mail"
      value={formik.values.email}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      type="email"
      error={!!formik.errors.email && !!formik.touched.email} 
      helperText={formik.touched.email && formik.errors.email}
      InputProps={{
        startAdornment: <InputAdornment position="start"><span>@</span></InputAdornment>,
      }}
      variant="outlined"
    />
  );
}

function PasswordInput({ formik }) {
  return (
    <TextField
      name="password"
      fullWidth
      placeholder="Hasło"
      value={formik.values.password}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      type="password"
      error={!!formik.errors.password && !!formik.touched.password} 
      helperText={formik.touched.password && formik.errors.password}
      variant="outlined"
    />
  );
}

function MessageTopicInput({ formik }) {
  return (
    <TextField
      fullWidth
      name="messageTopic"
      placeholder="Temat wiadomości"
      value={formik.values.messageTopic}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      type="text"
      error={!!formik.errors.messageTopic && !!formik.touched.messageTopic}
      helperText={formik.touched.messageTopic && formik.errors.messageTopic}
      variant="outlined"
    />
  );
}

function MessageContentInput({ formik }) {
  return (
    <TextField
      fullWidth
      name="messageContent"
      placeholder="Treść wiadomości"
      value={formik.values.messageContent}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      multiline
      rows={4} // Adjust the number of rows as needed
      error={!!formik.errors.messageContent && !!formik.touched.messageContent}
      helperText={formik.touched.messageContent && formik.errors.messageContent}
      variant="outlined"
    />
  );
}

function NameSurnameInput({ formik }) {

  const handleNameChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\s+/g, " ");
    value = value.trimStart();
    formik.setFieldValue("nameSurname", value);
  };

  return (
    <TextField
      fullWidth
      name="nameSurname"
      placeholder="Imię i nazwisko"
      value={formik.values.nameSurname}
      onChange={handleNameChange}
      onBlur={formik.handleBlur}
      type="text"
      error={!!formik.errors.nameSurname && !!formik.touched.nameSurname}
      helperText={formik.touched.nameSurname && formik.errors.nameSurname}
      variant="outlined"
    />
  );
}

function NameInput({ formik }) {

  const handleNameChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\s+/g, " ");
    value = value.trimStart();
    formik.setFieldValue("name", value);
  };

  return (
    <TextField
      fullWidth
      name="name"
      placeholder="Imię"
      value={formik.values.name}
      onChange={handleNameChange}
      onBlur={formik.handleBlur}
      type="text"
      error={!!formik.errors.name && !!formik.touched.name}
      helperText={formik.touched.name && formik.errors.name}
      variant="outlined"
    />
  );
}

function QuantityInput({ formik }) {

  const handleQuantityChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "");
    formik.setFieldValue("quantity", value);
  };

  return (
    <TextField
      fullWidth
      name="quantity"
      placeholder="Ilość"
      value={formik.values.quantity}
      onChange={handleQuantityChange}
      onBlur={formik.handleBlur}
      type="number"
      inputProps={{
        min: 1, // Prevent negative numbers
        step: 1, // Ensure only whole numbers
      }}
      error={!!formik.errors.quantity && !!formik.touched.quantity}
      helperText={formik.touched.quantity && formik.errors.quantity}
      variant="outlined"
    />
  );
}

function AgeInput({ formik }) {

  const handleQuantityChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "");
    formik.setFieldValue("age", value);
  };

  return (
    <TextField
      fullWidth
      name="age"
      placeholder="Wiek"
      value={formik.values.age}
      onChange={handleQuantityChange}
      onBlur={formik.handleBlur}
      type="number"
      inputProps={{
        min: 1, // Prevent negative numbers
        step: 1, // Ensure only whole numbers
      }}
      error={!!formik.errors.age && !!formik.touched.age}
      helperText={formik.touched.age && formik.errors.age}
      variant="outlined"
    />
  );
}

function TaxIdInput({ formik }) {
  const handleTaxIdChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    formik.setFieldValue("taxId", value);
  };

  return (
    <TextField
      fullWidth
      name="taxId"
      placeholder="Numer Identyfikacji Podatkowej (NIP)"
      value={formik.values.taxId}
      onChange={handleTaxIdChange}
      onBlur={formik.handleBlur}
      type="text"
      inputProps={{
        maxLength: 10, // Standard PL NIP length
      }}
      error={!!formik.errors.taxId && !!formik.touched.taxId}
      helperText={formik.touched.taxId && formik.errors.taxId}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <span>PL</span>
          </InputAdornment>
        ),
      }}
      variant="outlined"
    />
  );
}

function PostalCodeInput({ formik }) {
  
  const handlePostalCodeChange = (e) => {
    let value = e.target.value;

    // Remove all non-numeric characters
    value = value.replace(/\D/g, "");

    // Format to "XX-XXX" pattern
    if (value.length > 2) {
      value = `${value.slice(0, 2)}-${value.slice(2, 6)}`;
    }

    // Enforce a max length of 6 characters (XX-XXX)
    if (value.length > 6) {
      value = value.slice(0, 6);
    }

    formik.setFieldValue("postalCode", value);
  };

  return (
    <TextField
      fullWidth
      name="postalCode"
      placeholder="Kod pocztowy"
      value={formik.values.postalCode}
      onChange={handlePostalCodeChange}
      onBlur={formik.handleBlur}
      type="text"
      inputProps={{
        maxLength: 6, // Ensure the max length is 5 digits
      }}
      error={!!formik.errors.postalCode && !!formik.touched.postalCode}
      helperText={formik.touched.postalCode && formik.errors.postalCode}
      variant="outlined"
    />
  );
}

const LabeledInput = ({ label, children, message }) => {
  return (
    <Box sx={{width: '100%', py:0.5}}>
      <FormControl fullWidth sx={{width: '100%', py:0.5}}>
        <Box 
          display="flex" 
          flexDirection={'column'}
          sx={{width: '100%'}}
        >
          <InputLabel shrink>{label}</InputLabel>
          <Box flexGrow={1} sx={{width: '100%'}} mt={2}>{children}</Box>
          {
            message ?
              <Box flexGrow={1} mt={2}>
                <Text.Small align="left">{message}</Text.Small>
              </Box>
            : <></>
          }
        </Box>
      </FormControl>
    </Box>
    
  );
}

const CustomGroup = ({ children }) => {
  return (
    <Stack display="flex" flexDirection="column" alignItems="start" gap={3} width="100%">
      {children}
    </Stack>
  );
}

let Input = {
  PhoneNumber: PhoneNumberInput,
  Email: EmailInput,
  MessageTopic: MessageTopicInput,
  MessageContent: MessageContentInput,
  NameSurname: NameSurnameInput,
  Quantity: QuantityInput,
  TaxId: TaxIdInput,
  PostalCode: PostalCodeInput,
  Label: LabeledInput,
  Group: CustomGroup,
  Password: PasswordInput,
  Age: AgeInput,
  Name: NameInput,
}

export default Input;