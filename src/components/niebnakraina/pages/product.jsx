import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material";

import Product from "../../functionality/objects/product";

import Content from "../../general/content";

import LoaderPage from "./loader";

const ProductPage = () => {

  const [ product, setProduct ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const { url } = useParams();
  const theme = useTheme();

  const productRetrieval = async () => await Product.getByUrl(url)
  
  useEffect(() => {
    if(url){
      setProduct(productRetrieval());
    }
    setLoading(false);
  })

  if(product && !loading){

    const productHeaderData = {
      id: product.url.replace('/', ''),
      chip: {
        color: theme.palette.primary.main,
        label: product.fullName
      },
      title: {
        color: 'primary.main',
        text: product.slogan,
        align: 'left',
        wordsEnhanced: 2,
        fontSize: '2.5rem'
      },
      paragraph: product.description,
      textColumnChild: <></>,
      mediaColumnChild: <></>,
      rowChild: <></>
    }

    return(
      <>
        <Content {...productHeaderData} first />
      </>
    );
  }else if(loading){
    return(
      <LoaderPage />
    );
  }else{
    
  }
  

}

export default ProductPage;