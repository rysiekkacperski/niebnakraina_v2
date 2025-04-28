import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const Title = ({
  children, 
  variant='h1',
  color='secondary.main', 
  align='center',
  wordsEnhanced=2,
  fontSize,
  mainSx,
}) => {

  let title = children.split(' ');
  let mainText = title.slice(0, title.length-wordsEnhanced).join(' ');
  let coloredText = title.slice(-wordsEnhanced).join(' ');

  let fS = fontSize ? fontSize : 'clamp(1.5rem, 10vw, 2rem)' 

  return(
    <Typography
        variant={variant}
        sx={{
          fontSize: fS,
          textAlign: align,
          fontWeight: 600,
          ...mainSx
        }}
      >
        {mainText}
        <Typography
          component='span'
          sx={{
            fontSize: fS,
            textAlign: align,
            fontWeight: 600,
            lineHeight: 0,
            color: color
          }}
        >
          &nbsp;{coloredText}
        </Typography>
    </Typography>
  );

}

const TextStack = ({children, sx, spacing=1, align='center', full=false}) => {
  return(
    <Stack
      spacing={spacing}
      useFlexGap
      sx={{
        textAlign: align,
        color: 'text.secondary',
        ...sx
      }}
    >
      {children}
    </Stack>
  );
}

const SmallTextEnhanced = ({children, align='center'}) => {
  return(
    <Typography
      sx={{
        fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
        textAlign: align,
        fontWeight: 600,
      }}
    >
      {children}
    </Typography>
  );
}

const SmallText = ({children, align='center', color='text.secondary'}) => {
  return(
    <Typography
      sx={{
        fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)',
        textAlign: align,
        fontWeight: 400,
        color: color,
      }}
    >
      {children}
    </Typography>
  );
}

const Text={
  'Title': Title,
  'Stack': TextStack,
  'Small': SmallText,
  'SmallEnhanced': SmallTextEnhanced,
}

export default Text;