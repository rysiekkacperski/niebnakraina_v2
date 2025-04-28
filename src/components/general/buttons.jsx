import { Link } from "react-router";
import { useEffect, useState } from "react";

import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';

import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

import Button from "@mui/material/Button";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

import CustomCard from "./card";
import CustomModal from "./modal";
import Media from "./media";

function BaseButton({variant='contained', color='primary', pill, sx, ...props}){
  return(
    <Button 
      variant={variant} 
      color={color}
      sx={{
        ...sx,
        borderRadius: pill ? '9999px' : ''
      }}
      {...props}
    >
      {props.children}
    </Button>
  );
}

function LinkButton(props){
  return(
    <BaseButton 
      component={Link}
      {...props}
    >
      {props.children}
    </BaseButton>
  );
}

function WhatsAppButton({number, ...props}) {
  return (
    <LinkButton 
      to={"https://wa.me/".concat(number)}
      target="_blank" 
      rel="noopener noreferrer" 
      color="success" // WhatsApp green color
      startIcon={<WhatsAppIcon />}
      {...props} 
    >
      Napisz na Whatsappie
    </LinkButton>
  );
}

const CustomFab = ({color, onClick, children, ...props}) => {
  return(
    <Fab color={color} onClick={!!onClick ? onClick : ()=>{}} {...props}>
     {children}
    </Fab>
  );
}

const PhoneFab = ({phone, owner, ...props}) => {

  const [openPhone, setOpenPhone] = useState(false);

  return(
    <>
      <CustomFab onClick={() => setOpenPhone(true)} {...props}>
        <PhoneIcon />
      </CustomFab>
      <CustomModal 
        openModal={openPhone} 
        onClose={() => setOpenPhone(false)}
        title={'Numery telefonu'}
      >
        {
          phone.map((phone, index)=>{
            return(
              <CustomCard.Phone phone={phone} owner={owner.at(index)} />
            );
          })
        }
      </CustomModal>
    </>
  )
}

const EmailFab = ({email, owner, ...props}) => {

  const [openMail, setOpenMail] = useState(false);

  return(
    <>
      <CustomFab onClick={() => setOpenMail(true)} {...props}>
        <EmailIcon />
      </CustomFab>
      <CustomModal 
        openModal={openMail} 
        onClose={() => setOpenMail(false)}
        title={'Adresy e-mail'}
      >
        <CustomCard.Email email={email} owner={owner} />
      </CustomModal>
    </>
  )
  
}

const WhatsAppFab = ({whatsappnumber, ...props}) => {
  return(
    <a
      href={`https://wa.me/${whatsappnumber}`}
      target="_blank"
      style={{ 
        textDecoration: "none", 
      }}
    >
      <Fab 
        sx={{ 
          backgroundColor: "#25D366", 
          color: "white", 
        }} 
        {...props}
      >
        <WhatsAppIcon />
      </Fab>
    </a>
  )
}

export const AppleAuthButton = (props) => (
  <CustomButton.Button
    variant="contained"
    color="default"
    sx={{
      backgroundColor: '#000000', // Black background for Apple
      color: '#FFFFFF',
      '&:hover': { backgroundColor: '#333333' },
      ...props.sx,
    }}
    {...props}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap:2 }}>
      <Box
        component="img"
        src="/svg/brands/apple.svg"
        alt="Apple Icon"
        sx={{ width: 25, height: 25 }}
      />
      
      <Box component="span">Kontynuj z Apple ID</Box>
    </Box>
  </CustomButton.Button>
);

// Google login button using trusted Google "G" logo link with MUI Box and Divider
export const GoogleAuthButton = (props) => (
  <CustomButton.Button
    variant="contained"
    color="default"
    sx={{
      backgroundColor: '#FFFFFF', // White background for Google
      color: '#000000',
      border: '1px solid #ccc',
      '&:hover': { backgroundColor: '#F2F2F2' },
      ...props.sx,
    }}
    {...props}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        component="img"
        src="/svg/brands/google.svg"
        alt="Google Icon"
        sx={{ width: 25, height: 25 }}
      />
      <Box component="span">Kontynuj z Google</Box>
    </Box>
  </CustomButton.Button>
);

// Microsoft login button using trusted Microsoft logo link with MUI Box and Divider
export const MicrosoftAuthButton = (props) => (
  <CustomButton.Button
    variant="contained"
    color="default"
    sx={{
      backgroundColor: '#727272', // Microsoft blue
      color: '#FFFFFF',
      '&:hover': { backgroundColor: '#5e5e5e' },
      ...props.sx,
    }}
    {...props}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap:2 }}>
      <Box
        component="img"
        src="/svg/brands/microsoft.svg"
        alt="Microsoft Icon"
        sx={{ width: 25, height: 25 }}
      />
      <Box component="span">Kontynuj z Microsoft</Box>
    </Box>
  </CustomButton.Button>
);

// Facebook login button using trusted Facebook "f" logo link with MUI Box and Divider
export const FacebookAuthButton = (props) => (
  <CustomButton.Button
    variant="contained"
    color="default"
    sx={{
      backgroundColor: '#1877F2', // Facebook blue
      color: '#FFFFFF',
      '&:hover': { backgroundColor: '#145db2' },
      ...props.sx,
    }}
    {...props}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        component="img"
        src="/svg/brands/facebook.svg"
        alt="Facebook Icon"
        sx={{ width: 25, height: 25 }}
      />
      <Box component="span">Kontynuj z Facebookiem</Box>
    </Box>
  </CustomButton.Button>
);

// Reusable component for block-style ToggleButtonGroup
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  display: 'flex', // Ensure flexbox is used
  gap: theme.spacing(1), // Adjust the gap size as needed
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    borderRadius: 2,
    borderColor: grey[400],
    marginRight: theme.spacing(1), // Adds gap between buttons
    '&:last-child': {
      marginRight: 0, // Remove margin for the last button
    },
  },
}));



//Create a group of custom Togtlebuttongroup

/**
 * Returns a block of CustomToggleButtons
 * @param {reactNode} EachButtonChild - content of the ToggleButton - 
 * accepts a React component option with option prop
 * @returns reactNode 
 */

const BlockToggleButtonGroup = ({ EachButtonChild , value, onChange, options, orientation = 'horizontal' }) => {

  return(
    <ToggleButtonGroup
      value={value}
      orientation={orientation}
      exclusive
      onChange={onChange}
      fullWidth
    >
      {options.map((option) => (  
        <ToggleButton value={option.value} key={option.value}>
          <Stack
            spacing={2}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            direction={orientation === 'horizontal' ? 'column' : 'row'}
          >
            <EachButtonChild content={option} orientation={orientation} />
          </Stack>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
)};

//Create body for ButtonSvgBody

const SvgButtonBody = ({content, orientation}) => (
  <>
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      {content.svg ? (
        <Media.Image
          src={content.svg.src}
          alt={content.svg.alt}
          width={orientation === 'horizontal' ? '50%' : '90px'}
        />
      ) : null}
    </Box>
    <Box>
      {content.label}
    </Box>
  </>
  
)

const CustomButton = {
  'Button': BaseButton,
  'Link': LinkButton,
  'WhatsApp': WhatsAppButton,
  'Fab': CustomFab,
  'WhatsAppFab': WhatsAppFab,
  'EmailFab': EmailFab,
  'PhoneFab': PhoneFab,
  'AppleAuth': AppleAuthButton,
  'GoogleAuth': GoogleAuthButton,
  'FacebbokAuth': FacebookAuthButton,
  'MicrosoftAuth': MicrosoftAuthButton,
  'StyledToggleButtonGroup': StyledToggleButtonGroup,
  'BlockToggleButtonGroup': BlockToggleButtonGroup,
  'ButtonBody': {
    'SvgBody': SvgButtonBody
  },
}

export default CustomButton;