import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const RemoteIncentive = () => {
  return(
    <Typography>
      {`Jesteś zainteresowany/a zajęciami on-line? `} 
      <Link 
        href='/terapia-i-diagnoza-adhd-spektrum-asperger-online-zdalnie' 
        underline="always"
      >
        Sprawdź ofertę zajęć zdalnych
      </Link>
    </Typography>
  );
}

const ContactIncentive = () => {
  return(
    <Typography>
      {`Masz wątpliwości lub pytania? `} 
      <Link 
        href='/terapia-i-diagnoza-adhd-spektrum-asperger-online-zdalnie' 
        underline="always"
      >
        Skontakuj się z nami
      </Link>
    </Typography>
  );
}

const NiebnaLinks = {
  Remote: RemoteIncentive,
  Contact: ContactIncentive
} 

export default NiebnaLinks