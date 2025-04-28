import { useState, useEffect, useCallback, useRef } from 'react';

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

const Address = ({name, address, city, taxId, variant, align}) => {
  return(
    <>
      <Typography variant={variant} align={align}>
        {name}
      </Typography>
      <Typography variant={variant} align={align}>
        {address}
      </Typography>
      <Typography variant={variant} align={align}>
        {city}
      </Typography>
      <Typography variant={variant} align={align}>
        {taxId}
      </Typography>
    </>
  );
}

const GradientBox = ({children, width='100%'}) => {
  return(
    <Box
      sx={{
        width: width,
        p:2,
        background: (useTheme) => useTheme.palette.primary.gradientToRight,
        borderRadius: 3,
        boxShadow: 5,
      }}
    >
      {children}
    </Box>
  );
}

function isMobile(){
	return typeof screen.orientation !== 'undefined';
}

function consoleLog(...args) {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
}

const formatPolishDate = (date) => {
  const days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
  const months = [
    'Stycznia', 'Lutego', 'Marca', 'Kwietnia', 'Maja', 'Czerwca',
    'Lipca', 'Sierpnia', 'Września', 'Października', 'Listopada', 'Grudnia'
  ];
  const dayOfWeek = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  return `${dayOfWeek}, ${day} ${month}`;
};

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  // Handler to change page if the clicked button isn’t the current page.
  const handleClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  // Generate an array of page buttons.
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <Button
        key={i}
        variant={i === currentPage ? 'contained' : 'outlined'}
        color={i === currentPage ? 'primary' : 'inherit'}
        onClick={() => handleClick(i)}
      >
        {i}
      </Button>
    );
  }

  return (
    <>
      {
        totalPages > 1 ?
          <Box display="flex" justifyContent="center">
            <ButtonGroup variant="outlined" aria-label="pagination">
              {pages}
            </ButtonGroup>
          </Box>
        : <></>
      }
    </>
  );
};

// The generic component for real-time, paginated data fetching.
const RealTimePaginatedList = ({
  pageSize = 5,
  fetchCountFunc,
  fetchDataFunction,
  children,
}) => {
  // State to hold all fetched objects, total count, loading flag, and pagination info.
  const [objects, setObjects] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastDoc, setLastDoc] = useState(null); // keeps track of the last document for pagination

  // A ref to store the current unsubscribe function for the real-time listener.
  const unsubscribeRef = useRef(null);

  // Compute total pages based on totalCount and pageSize.
  useEffect(() => {
    setTotalPages(Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  // Function to set up the real-time listener.
  const subscribeData = useCallback(
    (startingDoc = null) => {
      // If a previous listener exists, unsubscribe it.
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      // Call fetchDataFunction to set up the listener.
      // The callback receives (newObjects, lastVisible, error)
      const unsub = fetchDataFunction(
        startingDoc,
        (newObjects, lastVisible, error) => {
          if (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
            return;
          }
          // If startingDoc is provided, append data; otherwise, set the initial list.
          setObjects((prev) =>
            startingDoc ? [...prev, ...newObjects] : newObjects
          );
          setLastDoc(lastVisible);
          setLoading(false);
        },
        pageSize
      );
      unsubscribeRef.current = unsub;
    },
    [fetchDataFunction, pageSize]
  );

  // Initial load: get total count and set up the initial real-time listener.
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchCountFunc()
      .then((count) => {
        if (isMounted) {
          setTotalCount(count);
        }
      })
      .catch((err) => {
        console.error("Error fetching count:", err);
      });

    // Initial subscription (without a starting document).
    subscribeData();

    return () => {
      isMounted = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [fetchCountFunc, subscribeData]);

  //Compute new totalCount whenever data changes
  useEffect(() => {
    fetchCountFunc()
      .then((count) => {
        setTotalCount(count);
      })
      .catch((err) => {
        console.error("Error fetching count:", err);
      });
  }, [objects, fetchCountFunc]);

  // Automatically load more data if totalCount > objects.length.
  useEffect(() => {
    if (!loading && totalCount > objects.length && lastDoc) {
      subscribeData(lastDoc);
    }
  }, [totalCount, objects.length, lastDoc, loading, subscribeData]);

  // Handle page change.
  const onPageChange = (page) => {
    const requiredCount = page * pageSize;
    // If we haven't loaded enough objects for the requested page and there's more data, load more.
    if (objects.length < requiredCount && lastDoc) {
      subscribeData(lastDoc);
    }
    setCurrentPage(page);
  };

  // Determine the objects to display on the current page.
  const startIndex = (currentPage - 1) * pageSize;
  const currentObjects = objects.slice(startIndex, startIndex + pageSize);

  // Create a pagination element using the generic Pagination component.
  const paginationElement = () => 
    <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />


  // The children render prop return the current objects, pagination element, and loading state.
  return children(currentObjects, paginationElement, loading);
};

const Utilities = {
  Address: Address,
  GradientBox: GradientBox,
  isMobile: isMobile,
  consoleLog: consoleLog,
  Pagination: Pagination,
  formatPolishDate: formatPolishDate,
  RealTimePaginatedList: RealTimePaginatedList,
}

export default Utilities;