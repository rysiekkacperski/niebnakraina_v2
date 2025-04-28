import { useEffect, useState } from "react";

import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

const ChipsList = ({chips}) => {

  const colors = ['default', 'primary', 'success', 'secondary', 'info', 'warning', 
    'purple', 'burgundy']

  const randomColor = () => colors.at(Math.floor(Math.random() * (length(colors)-1)))

  return(
    <Box>
      <Stack spacing={1} direction={row}>
        {
          chips.map((chip, index) => 
            <Chip  
              key={index}
              label={chip.label.toUpperCase()}
              color={!!chip.color ? chip.color : randomColor()}
              icon={!!chip.icon ? chip.icon : <></>}
            />
          )
        }
      </Stack> 
    </Box>
  )

}

const ChipTags = ({tags}) => {

  const [tagList, setTagList] = useState([])

  useEffect(()=>{
    tags = tags.map((tag) => {
      tag = '#' + tag.toLowerCase().replace(' ', '_')
      return { label: tag }
    })
    setTagList(tags)
    return
  }, [])
  
  return(
    <ChipsList chips={tagList} />
  )

}

const CustomChip={
  List: ChipsList,
  Tags: ChipTags,
}

export default CustomChip;