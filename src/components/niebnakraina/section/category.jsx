import { useTheme } from "@mui/material";

import Content from "../../general/content";
import CustomButton from "../../general/buttons";
import Media from "../../general/media";
import CustomChip from "../../general/chip";

import NiebnaLinks from "../components/link";

const CategorySection = ({id, name, slogan, svg, shortDescription, url, keywords, ...props}) => {
  
  const theme = useTheme()
  const CategoryBox = () => {
    return(
      <Stack spacing={2}>
        
        <Stack direction={{xs: 'column', sm:'row'}} spacing={1}>
          <CustomButton.Link to={'/kategoria/' + url}>
            Dowiedz się więcej
          </CustomButton.Link>
          <NiebnaButtons.About variant='outline' color='purple' />
        </Stack>
        <NiebnaLinks.Contact />
      </Stack>
    );
  }

  const categoryData = {
    chip: {
      color: theme.palette.primary.main,
      label: name
    },
    title: {
      color: 'primary.main',
      text: slogan,
      align: 'left',
      wordsEnhanced: 2,
      fontSize: '2rem'
    },
    paragraph: {
      align: 'left',
      text: shortDescription
    },
    belowTitleChild: <Media.Image src={svg.src} alt={svg.alt}/>,
    textColumnChild: <CategoryBox />,
    rowChild: <CustomChip.Tags tags={keywords} />
  }

  return(
    <Content {...categoryData} />
  );
}