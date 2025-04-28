import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack"
import Chip from "@mui/material/Chip"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import Media from "./media";
import Text from "./text";

const Incentive = ({image, title, description, button, wordsEnhanced=2}) => {

  let Button = button;

  return(
    <Grid container spacing={2}>
      <Grid size={{ xs:12, md:6 }} sx={{display: 'flex', justifyContent: 'center'}}>
        <Media.Image width='75%' src={image.src} alt={image.alt}/>
      </Grid>
      <Grid 
        size={{ xs:12, md:6 }}
      >
        <Stack spacing={2} sx={{
          display: 'flex', 
          height: '100%', 
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text.Title 
            variant="h2" 
            color="secondary.main"
            align='center'
            wordsEnhanced={wordsEnhanced}
          >
            {title}
          </Text.Title>
          {
            description ? <Typography>{description}</Typography> : <></>
          }
          <Box>
            <Button />
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default Incentive;