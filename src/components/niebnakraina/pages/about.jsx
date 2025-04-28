import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material";

import Content from "../../general/content";
import Utilities from "../../general/utilities";
import Media from "../../general/media";

import NiebnaButtons from "../components/buttons";
import NiebnaLinks from "../components/link";
import NiebnaIncentive from "../section/incentive";

const valuesHeaderContent = () => {

  const theme = useTheme();

  const ValuesHeaderBox = () => {
    return(
      <Stack spacing={2}>
        <Stack direction={{xs: 'column', sm:'row'}} spacing={1}>
          <NiebnaButtons.Contact pill />
          <NiebnaButtons.Visit pill variant='outlined' color='purple' />
        </Stack>
        <NiebnaLinks.Remote />
      </Stack>
    )
  }

  const ValuesMediaBox = () => {
  return(
    <Utilities.GradientBox width="75%">
      <Media.Image 
        src='/img/values.webp' 
        alt='Zdjęcie usmiechnietych ludzi obok wartośći Niebnej Krainy' 
      />
    </Utilities.GradientBox>
  );
  }

  const valuesHeaderParagrahs = [
    "Ze względu na duże doświadczenie, doskonale znamy trudności, które pojawiają się w czasie terapii i diagnozy osób neuroróżnorodnych",
    "Chcemy, aby Niebna Kraina była miejscem, w którym czują Państwo oparcie w codziennych staraniach o poprawę swojego dobrostanu lub rozwój Państwa dzieci",
    "W pracy kierujemy się uniwersalnymi wartościami, które pozwalają osiągnać znaczące efekty terapeutyczne",
    "W naszym Instytucie, mogą Państwo liczyć na profesjonalną pomoc, szczerość, zrozumienie i otwartość"
  ]

  const content = {
    videoSrc:'video/therapy.mp4',
    chip: {
      color: theme.palette.primary.main,
      label: 'Kim jesteśmy?'
    },
    title: {
      color: 'primary.main',
      text: 'Odpowiednie podejście podstawą działań terapeutycznych',
      align: 'left',
      wordsEnhanced: 2,
      fontSize: '2rem'
    },
    paragraph: {
      align: 'left',
      text: valuesHeaderParagrahs,
    },
    textColumnChild: <ValuesHeaderBox />,
    mediaColumnChild: <ValuesMediaBox />,
  }

  return content

} 

const Values = () => {

  const theme = useTheme();

  const valuesData = [
    {
      offset: true,
      spacing: 1,
      chip: {
        color: theme.palette.purple.main,
        label: 'UWAGA',
      },
      title: {
        color: 'purple.main',
        text: 'Według nas nie ma błachych problemów',
        align: 'left',
        wordsEnhanced: 2,
        fontSize: '1.5rem'
      },
      paragraph: {
        align: 'left',
        text: ["Każdy problem, z którym się mierzysz, jest ważny. Uważnie słuchamy i staramy się zrozumieć Twoją perspektywę"],
      },
      mediaColumnChild: <Media.Image src={'/svg/values/1.svg'} alt={'Uwagi'} width="50%" />
    }, 
    {
      spacing: 1,
      chip: {
        color: theme.palette.primary.main,
        label: 'ZAUFANIE',
      },
      title: {
        color: 'primary.main',
        text: 'Tworzymy nić zaufania',
        align: 'left',
        wordsEnhanced: 2,
        fontSize: '1.5rem'
      },
      paragraph: {
        align: 'left',
        text: ["Relacje budujemy krok po kroku, opierając je na szczerości, bezpieczeństwie i wzajemnym szacunku"],
      },
      mediaColumnChild: <Media.Image src={'/svg/values/2.svg'} alt={'Zaufanie'} width="50%" />
    },
    {
      offset: true,
      spacing: 1,
      chip: {
        color: theme.palette.burgundy.main,
        label: 'INDYWIDUALIZM',
      },
      title: {
        color: 'burgundy.main',
        text: 'Indywidualne podejście do pacjenta',
        align: 'left',
        wordsEnhanced: 2,
        fontSize: '1.5rem'
      },
      paragraph: {
        align: 'left',
        text: ["Każda osoba jest wyjątkowa — dostosowujemy metody i narzędzia, by najlepiej wspierać jej rozwój"],
      },
      mediaColumnChild: <Media.Image src={'/svg/values/3.svg'} alt={'Indywidualne podejście'} width="50%" />
    }, 
    {
      spacing: 1,
      chip: {
        color: theme.palette.primary.main,
        label: 'WSPARCIE',
      },
      title: {
        color: 'primary.main',
        text: 'Zaangażowanie bliskich w terapię, to konieczność',
        align: 'left',
        wordsEnhanced: 2,
        fontSize: '1.5rem'
      },
      paragraph: {
        align: 'left',
        text: ["Wspólna praca z rodziną i bliskimi sprawia, że efekty terapii są głębsze i trwalsze"],
      },
      mediaColumnChild: <Media.Image src={'/svg/values/4.svg'} alt={'Zaangażowanie bliskich'} width="50%" />
    }, 
    {
      offset: true,
      spacing: 1,
      chip: {
        color: theme.palette.purple.main,
        label: 'NOWOCZESNOŚĆ',
      },
      title: {
        color: 'purple.main',
        text: 'Odpowiedzialna nowoczesność w terapii',
        align: 'left',
        wordsEnhanced: 2,
        fontSize: '1.5rem'
      },
      paragraph: {
        align: 'left',
        text: ["Korzystamy z najnowszych metod i technologii, dbając jednocześnie o to, by były dostosowane do Twoich potrzeb. Możesz u nas skorzystać z usług zdalnych, ale tylko jeśli nie zakłóci to celowości i przebiegu zajęć"],
      },
      mediaColumnChild: <Media.Image src={'/svg/values/5.svg'} alt={'Nowoczesność'} width="50%" />
    }, 
    {
      spacing: 1,
      chip: {
        color: theme.palette.burgundy.main,
        label: 'WIEDZA',
      },
      title: {
        color: 'burgundy.main',
        text: 'Dzielimy się wiedzą',
        align: 'left',
        wordsEnhanced: 2,
        fontSize: '1.5rem'
      },
      paragraph: {
        align: 'left',
        text: ["Edukacja to klucz — nie tylko wspieramy naszych podopiecznych, ale również uczymy ich oraz ich bliskich, jak najlepiej działać razem"],
      },
      mediaColumnChild: <Media.Image src={'/svg/values/6.svg'} alt={'Wiedza'} width="50%"  />
    }
  ]

  const headerContent = {
    spacing: 1,
    textColumnAlign: 'center',
    chip: {
      color: theme.palette.primary.main,
      label: 'Czym się kierujemy?',
    },
    title: {
      color: 'primary.main',
      text: 'Nasze wartości',
      align: 'center',
      wordsEnhanced: 1,
      fontSize: '3rem'
    },
  }

  return(
    <>
      <Content {...headerContent} center paddingTop={10} paddingBottom={5}/>
      {
        valuesData.map((value, index) => 
          <Content key={'value_' + index} {...value} />
        )
      }
    </>
  );

}

const Office = () => {

  const theme = useTheme();

  const OfficeBox = () => {
    return(
      <Stack spacing={2}>
        <Stack direction={{xs: 'column', sm:'row'}} spacing={1}>
        <NiebnaButtons.Visit pill variant='outlined' color='purple' />
          <NiebnaButtons.Contact pill /> 
        </Stack>
        <NiebnaLinks.Remote />
      </Stack>
    )
  }

  const OfficeMediaBox = () => {
    return(
      <></>
    );
  }

  const valuesHeaderParagrahs = [
    "Instytut Diagnostyczno-Terapeutyczny Niebna Kraina mieści się w Gorzowie Wielkopolskim, przy ul. Górczyńskiej 21 (budynek dawnego Banku PKO BP), lokal nr 19, na I piętrze",
    "Na naszych pacjentów czekają meble przystosowane do wieku, a na ich rodziców wygodna poczekalnia",
    "Przed budynkiem znajduje się bezpłatny parking dla klientów",
  ]

  const content = {
    videoSrc:'video/office.mp4',
    chip: {
      color: theme.palette.primary.main,
      label: 'Nasz placówka'
    },
    title: {
      color: 'primary.main',
      text: 'Nasza placówka powstała z myślą o dzieciach, a także ich rodzicach',
      align: 'left',
      wordsEnhanced: 2,
      fontSize: '2rem'
    },
    paragraph: {
      align: 'left',
      text: valuesHeaderParagrahs,
    },
    textColumnChild: <OfficeBox />,
    mediaColumnChild: <OfficeMediaBox />,
  }

  return content
  
}

const AboutPage = () => {
  return(
    <>
      <Content {...valuesHeaderContent()} first full />
      <NiebnaIncentive.Specialist offset />
      <Box sx={{
        backgroundImage: "url('/background/spectrum-gradient.svg')",
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover'
      }}>
        <Values />
      </Box>
      <NiebnaIncentive.Contact offset />
    </>
  )
}

export default AboutPage