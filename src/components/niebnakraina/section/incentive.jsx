import { useTheme } from "@mui/material";
import Stack from "@mui/material/Stack";

import Media from "../../general/media";
import Content from "../../general/content";

import NiebnaButtons from "../components/buttons";
import NiebnaLinks from "../components/link";


const ContactIncentive = ({offset=false}) => {

  const theme = useTheme();

  const IncentiveBox = () => {
    return(
      <Stack spacing={2}>
        <Stack direction={{xs: 'column', sm:'row'}} spacing={1}>
          <NiebnaButtons.Contact />
        </Stack>
        <NiebnaLinks.Remote />
      </Stack>
    )
  }

  const incentiveData = {
    offset: offset,
    spacing: 5,
    chip: {
      color: theme.palette.primary.main,
      label: 'Kontakt',
    },
    title: {
      color: 'primary.main',
      text: 'Masz wątpliwości? Skontaktuj się z nami i pozwól je rozwiać',
      align: 'left',
      wordsEnhanced: 2,
      fontSize: '2rem'
    },
    mediaColumnChild: <Media.Image src={'/svg/general/communication.svg'} alt={'Kontakt'} width="75%" />,
    textColumnChild: <IncentiveBox />
  }

  return(
    <Content {...incentiveData} />
  );
}

const SpecialistIncentive = ({offset=false}) => {

  const theme = useTheme();

  const IncentiveBox = () => {
    return(
      <Stack spacing={2}>
        <Stack direction={{xs: 'column', sm:'row'}} spacing={1}>
          <NiebnaButtons.Specialist />
        </Stack>
        <NiebnaLinks.Contact />
      </Stack>
    )
  }

  const incentiveData = {
    offset: offset,
    spacing: 1,
    chip: {
      color: theme.palette.primary.main,
      label: 'Specjaliści',
    },
    title: {
      color: 'primary.main',
      text: 'Zapoznaj się z wykształceniem i doświadczeniem naszych specjalistów',
      align: 'left',
      wordsEnhanced: 2,
      fontSize: '2rem'
    },
    mediaColumnChild: <Media.Image src={'/svg/general/teamwork.svg'} alt={'Kontakt'} width="75%" />,
    textColumnChild: <IncentiveBox />
  }

  return(
    <Content {...incentiveData} />
  );
}

const NiebnaIncentive = {
  Specialist: SpecialistIncentive,
  Contact: ContactIncentive,
}

export default NiebnaIncentive