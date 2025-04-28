import { Stack } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";

import Content from "../../general/content";
import Utilities from "../../general/utilities";
import CustomCard from "../../general/card";

import NiebnaButtons from "../components/buttons";
import NiebnaLinks from "../components/link";

const headerContent = () => { 

  const theme = useTheme();

  const PromoVideo = () => {
    return(
      <Utilities.GradientBox />
    );
  }

  const HeaderBox = () => {
    return(
      <Stack spacing={2}>
        <Stack direction={{xs: 'column', sm:'row'}} spacing={1}>
          <NiebnaButtons.Diagnose />
          <NiebnaButtons.Therapy color='purple' />
        </Stack>
        <NiebnaLinks.Remote />
      </Stack>
    )
  }

  const cardsContent = [
    {
      'image': '/svg/general/compass.svg',
      'title': '+ 20',
      'description': 'LAT DOŚWIADCZENIA'     
    },
    {
      'image': '/svg/general/clock.svg',
      'title': '+ 500',
      'description': 'GODZIN ZAJĘĆ'     
    },
    {
      'image': '/svg/general/youngs.svg',
      'title': '+ 10',
      'description': 'TYPÓW ZAJĘĆ'     
    },
  ]

  const IncentiveCards = () => {
    return(
      <CustomCard.Box 
        cardData={cardsContent}
        cardBlueprint={CustomCard.IncentiveCard}
        backgroundColor='rgb(45, 163, 225, 0.3)'
      />
    );
  }
  
  const content = {
    videoSrc: '/video/teacher.mp4',
    id: 'diagnoza-i-terapie-adhd-i-spektrum-autyzmu-gorzow-zdalnie',
    chip: {
      color: theme.palette.primary.main,
      label: 'SPECJALIŚCI OD ADHD I SPEKTRUM'
    },
    title: {
      color: 'primary.main',
      text: 'Wspieramy osoby neuroróżnorodne',
      align: 'left',
      wordsEnhanced: 2,
      fontSize: '2.5rem'
    },
    textColumnChild: <HeaderBox />,
    mediaColumnChild: <PromoVideo />,
    rowChild: <IncentiveCards />
  }

  return content
}

const Header = () => {
  return(
    <Content {...headerContent()} full first />
  )
}

export default Header;