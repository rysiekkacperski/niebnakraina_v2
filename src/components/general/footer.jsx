import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';

const FootBox = (props) => {

  return(
    <Box component="footer" sx={{ bgcolor: props.bgColor, width:'100%', p: 3 }}>
      <Container maxWidth='lg'>
        <Stack
          direction={props.isLargeScreen ? "row" : "column"}
          spacing={props.isLargeScreen ? 4 : 3}
          alignItems="center"
          justifyContent="center"
          divider={props.isLargeScreen ? <Divider orientation="vertical" flexItem sx={{ bgcolor: "white" }} /> : null}
        >
          {props.children}
        </Stack>
      </Container>
    </Box>  
  )

}

export default FootBox;