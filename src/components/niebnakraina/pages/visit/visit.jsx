import React, { useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { TransitionGroup } from 'react-transition-group';

import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import StepContent from '@mui/material/StepContent';
import Stack from '@mui/material/Stack';

import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

import { useTheme, styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { FirebaseContext } from '../../../../firebaseProvider';

import Section from '../../../general/section';
import Text from '../../../general/text';
import Redirect from '../../../functionality/redirect';

import PatientComponents from '../../components/forObjects/patient';
import Utilities from '../../../general/utilities';

import Patient from '../../../functionality/objects/patient';
import Category from '../../../functionality/objects/category';
import Product from '../../../functionality/objects/product';
import VisitMode from '../../../functionality/objects/visitMode';
import CustomButton from '../../../general/buttons';
import Media from '../../../general/media';

// Reusable component for block-style ToggleButtonGroup
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  display: 'flex', // Ensure flexbox is used
  gap: theme.spacing(1), // Adjust the gap size as needed
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    borderRadius: 2,
    borderColor: grey[400],
    marginRight: theme.spacing(1), // Adds gap between buttons
    '&:last-child': {
      marginRight: 0, // Remove margin for the last button
    },
  },
}));

// Create a group of custom togle button group
const BlockToggleGroup = ({ value, onChange, options, orientation = 'horizontal' }) => {

  return(
    <StyledToggleButtonGroup
      value={value}
      orientation={orientation}
      exclusive
      onChange={onChange}
      fullWidth
    >
      {options.map((option, index) => (
        <ToggleButton value={option.value} key={index}>
          <Stack
            spacing={2}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            direction={orientation === 'horizontal' ? 'column' : 'row'}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {option.img ? (
                <Media.Image
                  src={option.img.src}
                  alt={option.img.alt}
                  width={orientation === 'horizontal' ? '75%' : '90px'}
                />
              ) : null}
            </Box>
            <Box>{option.label}</Box>
          </Stack>
        </ToggleButton>
      ))}
    </StyledToggleButtonGroup>
)};

// Keep your original header display.
const VisitWelcomeHeader = ({ src, alt, imgWidth = '50%' }) => (
  <Text.Stack align="left" full spacing={2}>
    <Box>
      <Chip color="primary" label="Nowa wizyta" />
    </Box>
    <Text.Title align="left" variant="h1" color="primary.main" fontSize="1.5rem">
      Uzyskaj profesjonalną pomoc, umawiając wizytę w naszej placówce!
    </Text.Title>
    {src ? <Media.Image src={src} alt={alt} width={imgWidth} /> : null}
  </Text.Stack>
);

// The left column shows the step image and the right column shows the chip, header, and renderer (6 columns on sm)
const CustomStepContent = ({
  stepsData,
  activeStep,
  handleBack,
  handleNext,
  isStepComplete,
}) => {
  const currentStep = stepsData.at(activeStep);
  return (
    <Paper
      elevation={3}
      sx={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}
    >
      <Grid container spacing={{ xs: 0, sm: 2 }} sx={{ width: '100%', alignItems: 'stretch' }}>
        <Grid item size={{xs: 12, sm: 6}} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              px: { xs: 3, sm: 5 },
              py: { xs: 1, sm: 5 },
            }}
          >
            <Media.Image
              src={currentStep.img.src}
              alt={currentStep.img.alt}
              width={{ xs: '50%', sm: '75%' }}
            />
          </Box>
        </Grid>
        <Grid item size={{xs: 12, sm: 6}} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', px: 3, pt: { xs: 0, sm: 3 }, gap: 2 }}>
            <Box>
              <Chip label={currentStep.chip.label} />
            </Box>
            <Text.Title fontSize="1.2rem" color="primary.main" mainSx={{ color: 'text.secondary' }} align="left">
              {currentStep.header.text}
            </Text.Title>
          </Box>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              flexDirection: 'column',
              p: 3,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              flexGrow: 2,
            }}
          >
            {currentStep.renderer()}
          </Box>
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', px: 3, py: 2, background: grey[100] }}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Wstecz
            </Button>
            <Button variant="contained" color="primary" onClick={handleNext} disabled={!isStepComplete(activeStep)}>
              {activeStep === stepsData.length - 1 ? 'Umów wizytę' : 'Dalej'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

function ScheduleVisitPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  // Manage the active step index
  const [activeStep, setActiveStep] = useState(0);

  // Consolidated form state
  const [formData, setFormData] = useState({
    isAdult: null,
    categoryId: '',
    productId: '',
    patientId: '',
    visitModeId: '',
    paymentMethod: '',
  });

  console.log(formData)

  // External data state
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [allVisitModes, setAllVisitModes] = useState([]);

  // Step names 
  const [stepsData, setStepNames] = useState([]);
        
  // Fetch initial data (Categories, VisitModes)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCategories = await Category.getAll()
        const fetchedVisitModes = await VisitMode.getAll()
        setCategories(fetchedCategories);
        setAllVisitModes(fetchedVisitModes); // Store all modes
      } catch (error) {
        Utilities.consoleLog('Failed to fetch initial data:', error);
      }
    };
    fetchData();
  }, []); // Run only once on mount

  // Fetch products when a category is selected.
  useEffect(() => {
    // Reset product-dependent fields when category/age changes or becomes unset
    const resetProducts = () => setFormData(prev => ({
      ...prev,
      productId: '',
      patientId: '',
      visitModeId: '',
      paymentMethod: '',
    }));
    async function fetchProducts() {
      if (formData.categoryId && formData.isAdult !== null) {
        setProducts([]); // Clear previous products immediately
        resetProducts();
        try {
          const prods = await Product.getByCategoryAndAge(formData.categoryId, formData.isAdult, !formData.isAdult);
          setProducts(prods);
        } catch (error) {
          Utilities.consoleLog('Failed to fetch products:', error);
          setProducts([]); // Ensure products is empty on error
        }
      }
    }
    fetchProducts();
  }, [formData.categoryId, formData.isAdult]);

  // Auto-select product if only one is available *after* products load
  useEffect(() => {
    // Only run if products are loaded and there's exactly one
    if (products.length === 1 && formData.productId === '') {
      setFormData((prev) => ({ ...prev, productId: products[0].id }));
    }

    // Reset downstream if selected product is no longer valid in the current list
    if (formData.productId && !products.find(p => p.id === formData.productId)) {
      setFormData(prev => ({
        ...prev,
        productId: '',
        patientId: '',
        visitModeId: '',
        paymentMethod: '',
    }));
    }
  }, [products, formData.productId]);

  // Auto-select visit mode if only one is available for the selected product
  useEffect(() => {
    if (formData.productId && products.length > 0 && allVisitModes.length > 0) {
      const product = products.find((p) => p.id === formData.productId);
      const modes = product ? product.visitModeIds || [] : [];

      // Auto-select if only one mode and none is selected yet
      if (modes.length === 1 && formData.visitModeId === '') {
          setFormData((prev) => ({ ...prev, visitModeId: modes[0] }));
      }

      // Reset downstream if selected mode is no longer valid for the current product
      if (formData.visitModeId && !modes.includes(formData.visitModeId)) {
          setFormData(prev => ({ ...prev, visitModeId: '', paymentMethod: '' }));
      }
    }
  }, [formData.productId, products, formData.visitModeId, allVisitModes]); // Added allVisitModes dependency

   // Auto-set payment method based on visit mode
  useEffect(() => {
    if (formData.visitModeId && allVisitModes.length > 0) {
        const selectedMode = allVisitModes.find(m => m.id === formData.visitModeId);
        if (selectedMode) {
            if (selectedMode.name === 'remote') {
              // Force online payment for remote
              if (formData.paymentMethod !== 'online') {
                setFormData(prev => ({ ...prev, paymentMethod: 'online' }));
              }
            }
        }
    } else if (!formData.visitModeId) {
        // Clear payment method if visit mode is deselected
        if (formData.paymentMethod !== '') {
            setFormData(prev => ({ ...prev, paymentMethod: '' }));
        }
    }
  }, [formData.visitModeId, allVisitModes, formData.paymentMethod]);

  // Define base steps with display properties.
  const baseSteps = [
    {
      key: 'age',
      label: "Dla kogo?",
      img: { src: '/svg/order/person.svg', alt: 'person waving' },
      chip: { label: 'WIEK' },
      header: { text: 'W jakim wieku jest pacjent?' },
      renderer: () => renderIsAdult(),
      validate: () => formData.isAdult !== null,
    },
    {
      key: 'patient',
      label: "Dane pacjenta",
      img: { src: '/svg/order/data.svg', alt: 'person noting' },
      chip: { label: 'SZCZEGÓŁY' },
      header: { text: 'Kto jest pacjentem?' },
      renderer: () => renderSelectPatient(),
      validate: () => formData.patientId !== '',
    },
    {
      key: 'category',
      label: "Określ typ wizyty",
      img: { src: '/svg/order/person.svg', alt: 'person waving' },
      chip: { label: 'TYP' },
      header: { text: 'Na jaką wizytę chcesz się umówić?' },
      renderer: () => renderCategories(),
      validate: () => formData.categoryId !== '',
    },
    {
      key: 'product',
      label: "Wybierz usługę",
      img: { src: '/svg/order/visit.svg', alt: 'person visiting' },
      chip: { label: 'USŁUGA' },
      header: { text: 'Czego dokładnie oczekujesz?' },
      renderer: () => renderProduct(),
      validate: () => formData.productId !== '',
    },
    {
      key: 'mode',
      label: "Zdalnie czy stacjonarnie?",
      img: { src: '/svg/order/remote.svg', alt: 'people on meeting' },
      chip: { label: 'FORMA ZAJĘĆ' },
      header: { text: 'Gdzie chcesz się spotkać?' },
      renderer: () => renderVisitMode(),
      validate: () => formData.visitModeId !== '',
    },
    {
      key: 'date',
      label: "Termin wizyty",
      img: { src: '/svg/order/calendar.svg', alt: 'people with calendar on the wall' },
      chip: { label: 'TERMIN' },
      header: { text: 'Kiedy chcesz się zobaczyć?' },
      renderer: () => renderSelectedDate(),
      validate: () => formData.date !== '',
    },
    {
      key: 'payment',
      label: "Metoda płatności",
      img: { src: '/svg/order/payment.svg', alt: 'person with a credit card' },
      chip: { label: 'PŁATNOŚĆ' },
      header: { text: 'Jak chcesz zapłacić?' },
      renderer: () => renderPaymentMethod(),
      validate: () => formData.paymentMethod !== '',
    },
  ]

  // Determining steps for each choice
  useEffect(() => {
    const determineSteps = () => {
        const steps = [];
        const findStep = (key) => baseSteps.find((s) => s.key === key);

        steps.push(findStep('age'));
        steps.push(findStep('category'));

        // Conditional Product step: Add ONLY if category selected AND more than 1 product exists
        if (formData.categoryId && products.length > 1) {
            steps.push(findStep('product'));
        }

        // Conditional Visit Mode step: Add ONLY if product selected AND more than 1 mode exists for it
        if (formData.productId) {
            const product = products.find((p) => p.id === formData.productId);
            const modeIds = product ? product.visitModeIds || [] : [];
            if (modeIds.length > 1) {
                steps.push(findStep('mode'));
            }
        }

        // Conditional Patient step: Add ONLY if category selected
        if (formData.isAdult != null && formData.categoryId && formData.productId){
          steps.push(findStep('patient'));
        }

        // Conditional Payment step: Add if mode selected AND it's NOT remote
        if (formData.visitModeId) {
            const selectedMode = allVisitModes.find(m => m.id === formData.visitModeId);
            if (selectedMode && selectedMode.name !== 'remote') {
                 steps.push(findStep('payment'));
            }
        }

        // Filter out any potential undefined steps if baseSteps were incomplete
        const finalSteps = steps.filter(Boolean);

        // Update state only if steps actually changed
        setStepNames(finalSteps);
    };
    
    determineSteps();

  }, [formData, products, allVisitModes]);

  // ---------------------------
  // Renderer functions for each step.
  // ---------------------------

  // ----- IsAdult Step Content Creator -----
  const handleIsAdultChange = useCallback((e, newValue) => {
    // This logic was inside setIsAdultValue before
    if (newValue !== null) {
      setFormData((prev) => ({
        ...prev,
        isAdult: newValue,
        // Reset dependent fields when age changes
        categoryId: '',
        productId: '',
        patientId: '',
        visitModeId: '',
        paymentMethod: '',
      }));
    }
    // No need to return anything or call setActiveStep
  }, [setFormData]); // Dependency: only setFormData

  const renderIsAdult = () => {

    return(
      <CustomButton.BlockToggleButtonGroup
        EachButtonChild={({...props}) => <CustomButton.ButtonBody.SvgBody {...props} />} 
        value={formData.isAdult}
        onChange={handleIsAdultChange}
        options={[
          {
            value: false, 
            label: 'Dziecko', 
            svg: { 
              src: '/svg/general/child.svg', 
              alt: 'Dziecko'
            }, 
          },
          { 
            value: true, 
            label: 'Dorosły', 
            svg: { 
              src: '/svg/general/adult.svg', 
              alt: 'Dorosły' 
            } 
          },
        ]}
      />
    );
  };

  // ----- Select Patient Step Content Creator -----
  const renderSelectPatient = () => {
    const { currentUser } = useContext(FirebaseContext);

    return (
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Utilities.RealTimePaginatedList
          fetchCountFunc={() => Patient.countPatientsByOwnerId(currentUser.uid, formData.isAdult)}
          fetchDataFunction={
            (startingDoc, callback, pageSize) =>
              Patient.listenPatientsByOwnerId(
                currentUser.uid, 
                formData.isAdult, 
                startingDoc, 
                callback, 
                pageSize
              )
          }
        >
          {(patients, Pagination) => {
            if(patients.length > 0){
              return(
                <Stack spacing={1}>
                  <BlockToggleGroup
                    value={formData.patientId}
                    onChange={(e, newValue) => {
                      if (newValue !== null) {
                        setFormData((prev) => ({ ...prev, patientId: newValue }));
                      }
                    }}
                    options={patients.map((patient) => ({
                      value: patient.id,
                      label: `${patient.name} - wiek: ${patient.age}`,
                    }))}
                    orientation="vertical"
                  />
                  <Pagination />
                </Stack>
              )
            }else {
              return(
                <Stack sx={{ display: 'flex',  }}>
                  <SentimentVeryDissatisfiedIcon sx={{fontSize: 80}}/>
                  <Typography 
                    fontWeight={500} 
                    lineHeight={2} 
                    variant='overline' 
                    textAlign={'center'}>`Wygląda na to, że na Twoim koncie nie ma 
                    jeszcze zarejestrowanego pacjenta`</Typography>
                  <Typography fontWeight={500} variant='overline' textAlign={'center'}>Skorzystaj z opcji poniżej</Typography>
                </Stack>
              )  
            }
              
          }}
        </Utilities.RealTimePaginatedList>
        <PatientComponents.AddPatientDialog ownerId={currentUser.uid} isAdult={formData.isAdult} />
      </Stack>
    );
  };

  // ----- Select Category Step Content Creator -----
  const handleCategories = useCallback((e, newValue) => {
    // This logic was inside setIsAdultValue before
    if (newValue !== null) {
      setFormData((prev) => ({ ...prev, categoryId: newValue}))
    }
  }, [setFormData]); 

  const mappedCategories = useMemo(() => {
    return categories.map((category) => ({
      value: category.id,
      label: category.name,
      img: { src: category.svg?.src || '', alt: category.svg?.alt || '' },
    }))
  }, [categories])

  const renderCategories = () => {
    return (
      categories && (
        <CustomButton.BlockToggleButtonGroup
          EachButtonChild={({...props}) => <CustomButton.ButtonBody.SvgBody {...props} />}
          value={formData.categoryId}
          onChange={handleCategories}
          options={mappedCategories}
          orientation="vertical"
        />
      )
    );
  };

  // ----- Select Product Step Content Creator -----
  const renderProduct = () => (
    <BlockToggleGroup
      value={formData.productId}
      onChange={(e, newValue) => {
        if (newValue !== null) {
          setFormData((prev) => ({ ...prev, productId: newValue}))
        }
      }}
      options={products.map((product) => ({
        value: product.id,
        label: product.fullName,
      }))}
      orientation="vertical"
    />
  );

  // ----- Select Visit Mode Step Content Creator -----
  const renderVisitMode = () => {
    
    const [modes, setModes] = useState([]);
    const fetchVisitModes = async (ids) => await VisitMode.getByIds(ids);

    useEffect(() => {

      const product = products.find((p) => p.id === formData.productId);
      const productModes = product ? product.visitModeIds || [] : [];

      const getModes = async () => {
        try {
          const modes = await fetchVisitModes(productModes);
          setModes(modes);
        } catch (error) {
          Utilities.consoleLog('Failed to fetch modes: ' + error);
        }
      };
      getModes();

    }, [products, formData.productId]);

    return (
      <BlockToggleGroup
        value={formData.visitModeId}
        onChange={(e, newValue) => {
          if (newValue !== null) {
            setFormData((prev) => ({ ...prev, visitModeId: newValue }))
          }
        }}
        options={modes.map((mode) => ({ value: mode.id, label: mode.fullName }))}
      />
    );
  };

  // ----- Select Payment Method Step Content Creator -----
  const renderPaymentMethod = () => (
    <BlockToggleGroup
      value={formData.paymentMethod}
      onChange={(e, newValue) => {
        if (newValue !== null) {
          setFormData((prev) => ({ ...prev, paymentMethod: newValue }))
          console.log(newValue)
        }
      }}
      options={[
        { value: 'online', label: 'Płatność on-line' },
        { value: 'onPremises', label: 'Płatność na miejscu' },
      ]}
    />
  );

  // Navigation handlers.
  const handleNext = () => {
    if (activeStep < stepsData.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      // Final step: handle form submission.
      Utilities.consoleLog('Form submission', formData);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const CurrentStep = () =>
    <CustomStepContent
      stepsData={stepsData}
      activeStep={activeStep}
      handleBack={handleBack}
      handleNext={handleNext}
      isStepComplete={(stepIndex) =>
        stepsData[stepIndex] && stepsData[stepIndex].validate()
      }
    />
  
  return (
    <Redirect.PrivateRoute>
      <Redirect.ContactInfoRequiredRoute>
        <Section full first>
          <Grid item size={{ xs: 12 }} >
            <VisitWelcomeHeader />
          </Grid>
          <Grid item size={{ xs: 12 }}>
            <Stepper 
              activeStep={activeStep} 
              orientation={isMobile ? 'vertical' : 'horizontal'}
              sx={{display: 'flex', width: '100%'}}
            >
              {stepsData.map((step) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                  {isMobile && (
                    <StepContent>
                      <CurrentStep />
                    </StepContent>
                  )}
                </Step>
              ))}
            </Stepper>
          </Grid>
          {!isMobile && (
            <Grid item xs={12}>
              <TransitionGroup>
                <CurrentStep />
              </TransitionGroup>
            </Grid>
          )}
        </Section>
      </Redirect.ContactInfoRequiredRoute>
    </Redirect.PrivateRoute>
  );
}

export default ScheduleVisitPage;

