import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

import Badge from "@mui/material/Badge";

import CustomCard from "../../general/card";
import CustomChip from "../../general/chip";

import NiebnaChips from "./chip";

const ShortProductCard = ({
  fullName,
  categoryName, 
  forAdults, 
  forChildren, 
  remote,
  partiallyRemote,
  onPremises,
  svg,
  url
}) => {
  
  const navigate = useNavigate();
  const [tags, setTags] = useState([])

  useEffect(()=>{
    setTags(NiebnaChips.getProductTags(
      categoryName, 
      forAdults, 
      forChildren,
      remote,
      partiallyRemote,
      onPremises
    ));
  }, [])

  return(
    <Badge badgeContent={<CustomChip.List chips={tags} />}>
      <CustomCard.IncentiveCard
        active
        image={svg}
        title={fullName}
        onClick={() => navigate(url, { replace: true })}
      />
    </Badge>
  );

}



