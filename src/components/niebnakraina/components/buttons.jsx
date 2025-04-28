import CustomButton from '../../general/buttons'

const VisitButton = ({...props}) => {
  return(
    <CustomButton.Link
      {...props}
    >
      Umów wizytę
    </CustomButton.Link>
  );
}

const AboutButton = ({...props}) => {
  return(
    <CustomButton.Link
      {...props}
      to='o-nas'
    >
      Więcej o nas
    </CustomButton.Link>
  );
}

const ContactButton = ({...props}) => {
  return(
    <CustomButton.Link
      {...props}
    >
      Kontakt
    </CustomButton.Link>
  );
}

const TherapyButton = ({...props}) => {
  return(
    <CustomButton.Link
      {...props}
      to='/terapia-adhd-spektrum-autyzmu-asperger-gorzow-zdalnie'
    >
      Oferta Terapii
    </CustomButton.Link>
  );
}

const DiagnoseButton = ({...props}) => {
  return(
    <CustomButton.Link
      {...props}
      to='/diagnoza-adhd-spektrum-autyzmu-asperger-gorzow-zdalnie'
    >
      Oferta Diagnozy
    </CustomButton.Link>
  );
}

const SpecialistButton = ({...props}) => {
  return(
    <CustomButton.Link
      {...props}
      to='/specjalisci'
    >
      Nasi specjaliści
    </CustomButton.Link>
  );
}

const AddPatient = ({...props}) => {
  return(
    <CustomButton.Button
      {...props}
    >
      Dodaj pacjenta
    </CustomButton.Button>
  );
}

const NiebnaButtons = {
  Visit: VisitButton,
  Contact: ContactButton,
  Therapy: TherapyButton,
  Diagnose: DiagnoseButton,
  AddPatient: AddPatient,
  About: AboutButton,
  Specialist: SpecialistButton,
}

export default NiebnaButtons;