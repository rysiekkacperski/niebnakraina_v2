import { useState } from 'react';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { styled } from '@mui/material/styles';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

import Utilities from '../../../general/utilities';

/* ====================================================
   DateSlotToggleGroup Component
   - Displays each date slot as a toggle button.
   - The status bar at the bottom is flush, 100% width, and its text color matches the theme.
==================================================== */
const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  padding: theme.spacing(1),
  textTransform: 'none',
  paddingBottom: 0, // Remove bottom padding so the status bar is flush.
}));

const DateSlotToggleGroup = ({ userId, dateSlots, selectedDateSlotId, onSelect }) => {
  return (
    <ToggleButtonGroup
      value={selectedDateSlotId}
      exclusive
      onChange={(event, newSelected) => {
        if (newSelected !== null) onSelect(newSelected);
      }}
      fullWidth
    >
      {dateSlots.map((slot) => {
        const dateObj = new Date(slot.datetime);
        const formattedDate = Utilities.formatPolishDate(dateObj);
        let occupancyIndicator;
        let disableButton = false;
        if (slot.currentlyOccupyingUser === null) {
          occupancyIndicator = (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                bgcolor: 'success.main',
                color: (theme) => theme.palette.success.contrastText,
                p: 0.5,
                borderRadius: 0,
                width: '100%',
              }}
            >
              <CheckCircleIcon fontSize="small" />
              <Typography variant="body2">Wolne</Typography>
            </Stack>
          );
        } else if (slot.currentlyOccupyingUser === userId) {
          occupancyIndicator = (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                bgcolor: 'info.main',
                color: (theme) => theme.palette.info.contrastText,
                p: 0.5,
                borderRadius: 0,
                width: '100%',
              }}
            >
              <InfoIcon fontSize="small" />
              <Typography variant="body2">Termin zajęty przez Ciebie</Typography>
            </Stack>
          );
        } else {
          occupancyIndicator = (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                bgcolor: 'error.main',
                color: (theme) => theme.palette.error.contrastText,
                p: 0.5,
                borderRadius: 0,
                width: '100%',
              }}
            >
              <ErrorIcon fontSize="small" />
              <Typography variant="body2">Zajęte</Typography>
            </Stack>
          );
          disableButton = true;
        }
        return (
          <StyledToggleButton key={slot.id} value={slot.id} disabled={disableButton}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2">{formattedDate}</Typography>
              <Typography variant="body2">Specjalista: {slot.therapistNameSurname}</Typography>
            </Box>
            <Box sx={{ width: '100%', p: 0, m: 0 }}>
              {occupancyIndicator}
            </Box>
          </StyledToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
};

/* ====================================================
   DateSlotSelector Component
   - Wraps DateSlotToggleGroup and implements onSelect logic:
       1. Clears previously selected slot (if any).
       2. Updates the clicked slot's occupancy to userId.
==================================================== */
const DateSlotSelector = ({ userId, dateSlots }) => {
  const [selectedDateSlotId, setSelectedDateSlotId] = useState(null);

  const onSelect = async (newSelectedId) => {
    try {
      // If there is a previously selected slot, clear its occupancy.
      if (selectedDateSlotId) {
        const previousSlot = dateSlots.find(slot => slot.id === selectedDateSlotId);
        if (previousSlot) {
          await previousSlot.clearOccupancy();
        }
      }
      // Update the newly selected slot's occupancy.
      const newSlot = dateSlots.find(slot => slot.id === newSelectedId);
      if (newSlot) {
        await newSlot.updateCurrentlyOccupyingUser(userId);
        setSelectedDateSlotId(newSelectedId);
      }
    } catch (error) {
      console.error("Error updating slot occupancy:", error);
    }
  };

  return (
    <DateSlotToggleGroup
      userId={userId}
      dateSlots={dateSlots}
      selectedDateSlotId={selectedDateSlotId}
      onSelect={onSelect}
    />
  );
};

const DateSlotUtilities = {
  Selector: DateSlotSelector
}

export default DateSlotUtilities;