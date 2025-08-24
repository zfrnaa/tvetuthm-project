import { useEffect, useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import dayjs from 'dayjs';
import { CssBaseline, Button, Dialog, IconButton, DialogContent, Box } from '@mui/material';

const CalendarComponent = () => {
  const [date, setDate] = useState(dayjs());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dayjs.locale('ms');
  }, []);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    // Check screen size
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1366); // 768px is standard md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    // Set up observer to detect theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkScreenSize);
    }
  }, []);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: isDarkMode ? '#38bdf8' : '#344bfd', // Tailwind cyan colors
      }
    },
  });

  const stopPropagation = (e: React.MouseEvent | React.FocusEvent) => {
    e.stopPropagation();
  };

  // Common calendar styling
  const calendarSx = {
    width: '100%',
    '& .MuiPickersCalendarHeader-root': {
      paddingInline: '8px',
      marginTop: '8px',
      color: isDarkMode ? 'white' : 'inherit',
    },
    '& .MuiPickersCalendarHeader-label': {
      marginLeft: '6px',
      fontSize: '.9rem',
      color: isDarkMode ? 'white' : 'inherit',
    },
    '& .MuiDayCalendar-header': {
      paddingTop: '2px',
      paddingBottom: '4px',
    },
    '& .MuiPickersDay-root': {
      fontSize: '0.8rem',
      margin: '1px',
    },
    '& .MuiDayCalendar-monthContainer': {
      margin: '0px',
    },
    '& .MuiPickersCalendarHeader-switchViewButton': {
      padding: '2px',
      marginLeft: '8px',
      color: isDarkMode ? 'white' : 'inherit',
    },
    '& .MuiPickersArrowSwitcher-root': {
      padding: '4px',
    }
  };

  // Additional styling for compact desktop calendar
  const compactCalendarSx = {
    ...calendarSx,
    maxWidth: '220px', // Make it smaller than before
    maxHeight: '300px',
    padding: '0',
    '& .MuiPickersCalendarHeader-root': {
      ...calendarSx['& .MuiPickersCalendarHeader-root'],
      marginTop: '2px', // Less top margin
      paddingLeft: '4px',
      paddingRight: '4px',
    },
    '& .MuiPickersCalendarHeader-label': {
      ...calendarSx['& .MuiPickersCalendarHeader-label'],
      fontSize: '0.8rem', // Smaller font
    },
    '& .MuiDayCalendar-header': {
      ...calendarSx['& .MuiDayCalendar-header'],
      paddingTop: '1px',
      paddingBottom: '1px',
    },
    '& .MuiPickersDay-root': {
      ...calendarSx['& .MuiPickersDay-root'],
      width: '32px', // Smaller day cells
      height: '32px',
      fontSize: '0.75rem',
      margin: '0px',
    },
    '& .MuiPickersArrowSwitcher-button': {
      padding: '2px', // Smaller arrow buttons
    }
  };

  return (
    <>
      {/* Button for small screens */}
      {isSmallScreen ? (
        <div className={`p-2 text-center rounded-lg ${isDarkMode ? 'bg-cyan-800' : 'bg-secondaryCustom'}`}>
          <Button
            startIcon={<CalendarIcon className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            variant="outlined"
            fullWidth
            sx={{
              color: isDarkMode ? 'white' : 'inherit',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'inherit'
            }}
          >
            Kalendar
          </Button>
        </div>
      ) : (
        // Regular calendar for larger screens - using compactCalendarSx now
        <div className={`rounded-lg ${isDarkMode ? 'bg-cyan-800' : 'bg-secondaryCustom'}`}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ms'>
              <DateCalendar
                value={date}
                onChange={(newDate) => newDate && setDate(newDate)}
                showDaysOutsideCurrentMonth={false}
                sx={compactCalendarSx} // Using the compact styling
                displayWeekNumber={false} // Remove week numbers to save space
              />
            </LocalizationProvider>
          </ThemeProvider>
        </div>
      )}

      {/* Modal Dialog with original styling */}
      <Dialog
        open={isModalOpen}
        onClose={(_, reason) => {
          // Only handle close events we explicitly want
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            setIsModalOpen(false);
          }
        }}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown
        disablePortal
        disableAutoFocus
        disableEnforceFocus
        slotProps={{
          backdrop: {
            onClick: stopPropagation,
            onMouseDown: stopPropagation,
            onMouseUp: stopPropagation,
            sx: { position: 'fixed' }
          },
          paper: {
            onClick: stopPropagation,
            onMouseDown: stopPropagation,
            onMouseUp: stopPropagation,
            sx: { position: 'relative' }
          }
        }}
        sx={{
          position: 'fixed',
          zIndex: 9999,
          '& .MuiBackdrop-root': {
            position: 'fixed'
          }
        }}
      >
        <Box
          onClick={stopPropagation}
          onMouseDown={stopPropagation}
          onMouseUp={stopPropagation}
          sx={{ position: 'relative' }}
        >
          <DialogContent
            className={`relative p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}
            onClick={stopPropagation}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(false);
              }}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <X className={isDarkMode ? 'text-white' : 'text-gray-800'} />
            </IconButton>

            <ThemeProvider theme={theme}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ms'>
                <DateCalendar
                  value={date}
                  onChange={(newDate) => newDate && setDate(newDate)}
                  sx={{
                    ...calendarSx, // Using original styling for modal
                    margin: '0 auto',
                  }}
                />
              </LocalizationProvider>
            </ThemeProvider>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

export default CalendarComponent;
