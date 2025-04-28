import CardMedia from "@mui/material/CardMedia";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function StandardImageList({ itemData }) {
  const [open, setOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const theme = useTheme();
  // Dialog goes full screen on small devices.
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = (img) => {
    setSelectedImage(img);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
        {itemData.map((item) => (
          <ImageListItem 
            key={item.img} 
            onClick={() => handleOpen(item.img)} 
            style={{ cursor: 'pointer' }}
          >
            <img
              srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
              alt={item.title}
              loading="lazy"
              style={{
                transition: 'transform 0.3s ease-in-out',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </ImageListItem>
        ))}
      </ImageList>

      {/* Responsive dialog that displays the clicked image in a larger view */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Selected"
              style={{ width: '100%', height: 'auto' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

const Image = ({src, width='100%', height='auto', sx, className='', ...props}) => {
  return(
    <CardMedia
      component='img'
      className={className}
      src={src}
      sx={{
        width: width,
        height: height,
        objectFit: 'contain',
        ...sx
      }}
      {...props}
    />
  );
}

const Media = {
  'Image': Image,
  'ImageList': StandardImageList
}

export default Media;