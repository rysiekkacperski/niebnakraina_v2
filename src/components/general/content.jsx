import Section from "./section";
import Text from "./text";

import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip"
import Typography from "@mui/material/Typography";

const Content = ({
  videoSrc,
  imgSrc, 
  id, 
  chip, 
  title, 
  paragraph,
  offset,
  center,
  paddingTop=5,
  paddingBottom=5,
  textColumnAlign = 'left',
  belowTitleChild = false,
  textColumnChild = false,
  mediaColumnChild = false, 
  rowChild = false,
  spacing = 3,
  ...props
}) => {

  return(
    <Section 
      id={id}
      videoSrc={videoSrc}
      imgSrc={imgSrc}
      spacing={spacing}
      center={center}
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
      {...props}
    >
      <Grid 
        size={{ xs: 12, sm: 6 }}
        sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
        offset={{ sm: offset ? 6 : 0 }} 
      >
        <Text.Stack align={textColumnAlign} spacing={2}>
          {!!chip?
              <Box>
                <Chip 
                  sx={{
                    padding: 1,
                    background: chip.color,
                    color: '#fff',
                  }} 
                  label={chip.label}
                />
              </Box>
            : <></>
          }
          <Text.Title 
            variant={title.variant} 
            color={title.color}
            align={title.align}
            wordsEnhanced={title.wordsEnhanced}
            fontSize={title.fontSize}
          >
            {title.text}
          </Text.Title>
          {
            !!belowTitleChild ?
              {belowTitleChild}
            : <></>
          }
          {
            !!paragraph ?
              <Text.Stack align={paragraph.align}>
                {
                  paragraph.text.map((text, index)=>{
                    return <Typography key={index}>{text}</Typography>
                  })
                }
              </Text.Stack>
            : <></>
          }
          { textColumnChild }  
        </Text.Stack>
      </Grid>

      {!!mediaColumnChild ?
          <Grid 
            size={{ xs: 12, sm: 6 }} 
            sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            offset={{ sm: offset ? -12 : 0 }} 
          >
            { mediaColumnChild }
          </Grid>
        : <></>
      }
      {
        !!rowChild ?
          <Grid size={{ xs:12 }}>
            { rowChild }
          </Grid>
        : <></>
      }
    </Section>
  );
}

export default Content;