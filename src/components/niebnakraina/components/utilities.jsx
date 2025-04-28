import { Link } from 'react-router';
import CardMedia from '@mui/material/CardMedia'

const LogoLink = ({width=180}) => {
  return(
    <Link 
      to='/'
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        lineHeight: 0,
        fontSize: 0,
        border: 0
      }}
    >
      <CardMedia
        component="img"
        src='/svg/logo.svg'
        alt="Logo"
        sx={{
          width: width,
          display: 'block',
          lineHeight: 0
        }}
      />
    </Link>
  )
}

const Utilities = {
  LogoLink: LogoLink,
}

export default Utilities;