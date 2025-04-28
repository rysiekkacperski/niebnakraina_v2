import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";

function Section(props){
    return(
      <Box
        sx={{
          width: '100%',
          minHeight: props.full ? "100vh" : 'auto',
          position: "relative",
          overflow: "hidden",
          backgroundRepeat: 'no-repeat',
          backgroundImage: !!props.bgGradient ? 'radial-gradient(ellipse 80% 50% at 50% -20%, #40ad36, transparent)' : 'url()',
        }}
      > 
        {/* Video Background */}
        {
          !!props.videoSrc ? 
            <Box
              component="video"
              autoPlay
              loop
              muted
              playsInline
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                minHeight: "100%",
                objectFit: "cover",
                zIndex: -1,
              }}
            > 
              <source src={props.videoSrc} type="video/mp4" />
            </Box>
          :
          !!props.imgSrc ?
            <Box
              component="img"
              src={props.imgSrc}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                minHeight: "100%",
                objectFit: "cover",
                zIndex: -1,
              }}
            /> 
          : <></>
        }

        <Box sx={{ 
          position: "relative",
          display: 'flex',
          alignItems: 'center', 
          width: "100%", 
          minHeight: props.full ? "100vh" : 'auto', 
          overflow: "hidden",  
          backgroundColor: "rgba(255, 255, 255, 0.8)", 
          backdropFilter: "blur(10px)" 
        }}>
          <Container
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              pt: { xs: !!props.first ? 15 : props.paddingTop  },
              pb: { xs: !!props.first ? 8 : props.paddingBottom },
            }}
          >
            <Grid 
              container 
              spacing={props.spacing ? props.spacing : 3} 
              sx={{
                width: '100%',
                alignItems: props.center ? 'center' : '',
                justifyContent: props.center ? 'center' : '',
              }} 
              id={props.id}
            >
              {props.children}
            </Grid>
          </Container>
        </Box>
      </Box>
    );
}

export default Section;