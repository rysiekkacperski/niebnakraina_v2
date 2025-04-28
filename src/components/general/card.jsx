import { useContext } from "react";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Grid from '@mui/material/Grid2'
import Stack from "@mui/material/Stack";
import Chip from '@mui/material/Chip';

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import Text from "./text";
import Media from "./media";
import AlertManager from "./alert";

const PhoneCard = ({ owner, phone }) => {

  const Alert = useContext(AlertManager.Context);
  const theme = useTheme();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(phone);
    Alert.setAlert('success', 'Poprawnie skopiowano numer!')
  };

  return (
    <Paper sx={{ display: "flex", alignItems: "center", py: 2, px: {xs: 1, md:2}, gap: {xs: 1, md:2} }}> 
      {/* Phone Icon with Background */}
      <Box
        sx={{
          width: {xs: 30, md: 40},
          height: {xs: 30, md: 40},
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.secondary.main,
          borderRadius: "50%",
        }}
      >
        <PhoneIcon sx={{ color: "white" }} />
      </Box>

      {/* Divider */}
      <Divider orientation="vertical" flexItem />

      {/* Owner and Phone Number */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body1" fontWeight={600}>
          {owner}
        </Typography>
        <Typography
          variant="body2"
          color="primary"
          component="a"
          href={`tel:${phone}`}
          sx={{ textDecoration: "none" }}
        >
          {phone.slice(0, 3)} {phone.slice(3, 6)} {phone.slice(6, 9)} {phone.slice(9, 12)}
        </Typography>
      </Box>

      {/* Copy Icon */}
      <Tooltip title="Skopiuj numer">
        <IconButton onClick={copyToClipboard}>
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

const EmailCard = ({ owner, email }) => {

  const Alert = useContext(AlertManager.Context);
  const theme = useTheme();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    Alert.setAlert('success', 'Poprawnie skopiowano adres e-mail!')
  };

  return (
    <Paper sx={{ display: "flex", alignItems: "center", py: 2, px: {xs: 1, md:2}, gap: {xs: 1, md:2} }}> 
      {/* Email Icon with Background */}
      <Box
        sx={{
          width: {xs: 30, md: 40},
          height: {xs: 30, md: 40},
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.primary.main,
          borderRadius: "50%",
        }}
      >
        <EmailIcon 
          sx={{ 
            color: "white",
            width: {xs: 20, md: 30},
            height: {xs: 20, md: 30},  
          }} 
        />
      </Box>

      {/* Divider */}
      <Divider orientation="vertical" flexItem />

      {/* Owner and Email Address */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body1" fontWeight={600}>
          {owner}
        </Typography>
        <Typography
          variant="body2"
          color="primary"
          component="a"
          href={`mailto:${email}`}
          sx={{ textDecoration: "none" }}
        >
          {email}
        </Typography>
      </Box>

      {/* Copy Icon */}
      <Tooltip title="Skopiuj e-mail">
        <IconButton onClick={copyToClipboard}>
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

function FormCard({children, image, title, label, description, color='primary'}) {
  return (
    <Card sx={{ width: "100%", display: "flex" }}>
      <Grid container spacing={0} sx={{ width: '100%', alignItems: "stretch" }} >
        {/* Left Grid - Background Image */}
        <Grid 
          size={{ xs:12, sm:6 }}
          sx={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: 300,
            height: "auto",
            display: "flex",
            flexDirection: "column"
          }}
        /> 
        {/* Right Grid - Stack for elements */}
        <Grid size={{ xs:12, sm:6 }} alignItems="center">
          <Stack 
            spacing={2} 
            sx={{ px: {xs:1, md:3, lg: 5}, py: {xs:3, lg: 5} }}
          >
            <Box>
              <Chip 
                sx={{
                  padding: 1,
                }} 
                color={color}
                label={label}
              />
            </Box>
            <Text.Title variant="h1" color={color.concat('.main')} align="left">{title}</Text.Title>
            {!!description?
              <Typography variant="body1">
                {description}
              </Typography>
            : <></>  
            }  
            {children}
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}

const FloatingCard = (props) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md")); // Check if screen is md or larger

  return(
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        left: 20,
        display: "flex",
        flexDirection: isMdUp ? "column" : "row", // Column on large screens, row on small screens
        gap: 1.5,
        bgcolor: "background.paper",
        boxShadow: 5,
        p: 1.5,
        borderRadius: 2,
      }}
    >
      {props.children}
    </Box>
  )
}

const IncentiveCard = ({active, image, title, description, align='center', onClick=() => {}}) => {

  const Content = () =>
    <CardContent sx={{ width: '100%'}}>
      <Box sx={{ 
        display: "flex", 
        flexDirection: 'row',  
        width: '100%', 
        alignItems: 'center', 
        justifyContent: align
      }}>
        <Media.Image 
          image={image}
          alt={`${title} ikona`}
          width="50px" 
        />
        <Divider orientation="vertical" variant="middle" flexItem  sx={{marginX: 2}}/>
        <Typography sx={{
          fontWeight: 600,
          fontSize: {
            xs:'clamp(0.7rem, 6vw, 1.8rem)',
            md:'clamp(1.1rem, 6vw, 2rem)'
          },
          color: 'text.secondary'
        }}>
          {title}
      </Typography>
      </Box>
      {
        !!description ?
          <Typography variant="body2" sx={{ 
            color: 'text.secondary', 
            marginTop: 3, 
            fontSize: {
              xs:'clamp(0.9rem, 6vw, 1.0rem)',
              md:'clamp(0.7rem, 6vw, 0.9rem)'
            }, 
            width: '100%',
            textAlign: 'center',
          }}>
            {description}
          </Typography>
        : <></>
      }
      </CardContent>

  return(
    <Card sx={{ display: "flex",  alignItems: 'center', height: "100%"}}>
      {
        !!active ?  
          <CardActionArea
            onClick={onClick}
            data-active={ undefined }
            sx={{
              height: '100%',
              '&[data-active]': {
                backgroundColor: 'action.selected',
                '&:hover': {
                  backgroundColor: 'action.selectedHover',
                },
              },
            }}
          >
            <Content />
          </CardActionArea>
        : 
          <Content />
      }
    </Card>
  );
}

const CardBox = ({
    cardData, 
    cardBlueprint: ExampleCard, 
    xs=12, 
    sm=4,
    lg,
    mt, 
    backgroundColor='secondary.light'
}) => {
  return(
    <Box
      sx={{
        width: '100%',
        backgroundColor: backgroundColor,
        borderRadius: 3,
        boxShadow: 1,
        marginTop: mt ? 3 : 0, 
        padding: 2,
      }}
    >
      <Grid container spacing={3} alignItems={'stretch'} sx={{justifyContent: 'center'}}>
        {cardData.map((card, index) =>
          <Grid key={index} size={{ xs:xs, sm:sm }}>
            <ExampleCard
              {...card}
            />
          </Grid>
        )}
     </Grid>
    </Box>
    
  );
}

const TextCard = ({image, title, description}) => {
  return(
    <Card sx={{ display: "flex", flexDirection: 'row',  alignItems: 'center', padding: 3, height: "100%"}}>
      <Box sx={{ width: '100px', marginRight: 2}}>
        <Media.Image 
          image={image} 
          alt={`${title} ikona`}
          width="100px" 
        />
      </Box>
      <CardContent>
        <Typography sx={{
          fontWeight: 600,
        }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', marginTop: 0.5 }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

const ImageCard = ({image, title, icon, description}) => {

  const CardTitle = ({title, icon}) => {

    let Icon = () => icon;
  
    return(
      <Stack direction='row' spacing={1} sx={{
        fontSize: 'clamp(1rem, 2.5vw, 1.5rem)'
      }}>
        <Icon />
        <Typography sx={{
          fontWeight: 600,
        }}>
          {title}
        </Typography>
      </Stack>
    );
  }

  return(
    <Card sx={{ display: "flex", flexDirection: 'column',  alignItems: 'center', height: "100%"}}>
      <Media.Image image={image} />
      <CardContent>
        <CardTitle title={title} icon={icon} />
        <Typography variant="body2" sx={{ color: 'text.secondary', marginTop: 1 }}>
          {description}
        </Typography>
      </CardContent>  
    </Card>
  );
}

const CustomCard = {
  Phone: PhoneCard,
  Email: EmailCard,
  Form: FormCard,
  Floating: FloatingCard,
  IncentiveCard: IncentiveCard,
  Box: CardBox,
  Text: TextCard,
  Image: ImageCard,
}

export default CustomCard