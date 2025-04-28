import Box from "@mui/material/Box";

import Media from "../../general/media";

const LoaderPage = () => {

  return(
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Media.Image src='/svg/double_clouds.svg' className='loader' />
    </Box>
  );

}

export default LoaderPage;