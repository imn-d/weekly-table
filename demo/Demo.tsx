import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CssBaseline,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import React, { FC, createRef, useCallback, useEffect, useState } from 'react';

import { ScheduleGroup } from '../src';
import './main.css';
import { useDataExample } from './useDataExample';
import { useTimezone } from './useTimezone';

const Scheduler = React.lazy(() => import('../src'));

const useStyles = makeStyles({
  parent: {
    position: 'relative',
    height: 600,
    color: 'white',
    background: '#0f3bdb',
    borderRadius: 5,
    boxShadow: '0 3px 5px 2px rgba(30, 30, 31, 0.3)',
  },
  outBox: {
    display: 'flex',
    flexDirection: 'row',
  },
  out: {
    flex: '1 1 auto',
    maxWidth: 320,
    textAlign: 'end',
  },
});

export const Demo: FC = () => {
  const classes = useStyles();

  const ref = createRef<HTMLDivElement>();

  const [timeframe, setTimeframe] = useState<number>(60);
  const handleTimeframe = useCallback((event) => {
    setTimeframe(event.target.value);
  }, []);

  const { fiveExample, weekendExample, complexExample } = useDataExample();

  const [initValue, setInitValue] = useState<ScheduleGroup[] | undefined>(
    undefined,
  );

  const { handleTimezone, timezone, offsetOptions } = useTimezone();

  const [output, setOutput] = useState<ScheduleGroup[]>();

  const [draw, setDraw] = useState<boolean>(false);

  useEffect(() => {
    document.addEventListener('mousedown', () => setDraw(true));
    document.addEventListener('mouseup', () => setDraw(false));
    return () => {
      document.removeEventListener('mousedown', () => setDraw(true));
      document.removeEventListener('mouseup', () => setDraw(false));
    };
  }, []);

  return (
    <>
      <CssBaseline />
      <AppBar position='static'>
        <Container maxWidth='xl'>
          <Toolbar disableGutters>
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              WEEKLY-TABLE DEMO
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Container>
        <Grid container sx={{ mt: 5 }} spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl>
              <FormLabel>Timeframe</FormLabel>
              <RadioGroup
                row
                value={timeframe}
                onChange={(event) => handleTimeframe(event)}
              >
                <FormControlLabel value={15} control={<Radio />} label='15m' />
                <FormControlLabel value={30} control={<Radio />} label='30m' />
                <FormControlLabel value={60} control={<Radio />} label='60m' />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormLabel sx={{ display: 'flex', pb: '5px' }}>
              Input data (UTC)
            </FormLabel>
            <Chip
              label='5/0 10-18'
              color='primary'
              sx={{ mr: '5px' }}
              onClick={() => setInitValue(fiveExample)}
            />
            <Chip
              label='0/2 12-15'
              color='primary'
              sx={{ mr: '5px' }}
              onClick={() => setInitValue(weekendExample)}
            />
            <Chip
              label='insane'
              color='primary'
              onClick={() => setInitValue(complexExample)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              autoHighlight
              value={timezone}
              onChange={(event, target) => handleTimezone(target)}
              fullWidth
              clearOnEscape
              options={offsetOptions}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => (
                <TextField {...params} label={'Timezone'} margin='none' />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button variant='contained' onClick={() => setInitValue([])}>
              Clear Area
            </Button>
          </Grid>
        </Grid>
        <Grid item sx={{ pt: 5 }}>
          <div className={classes.parent} ref={ref}>
            <Scheduler
              parentRef={ref}
              timeframe={timeframe}
              defaultValue={initValue}
              requiredTZOffset={timezone.value}
              onChange={(values) => setOutput(values)}
            />
          </div>
        </Grid>
        <Grid item sx={{ pt: 5 }}>
          <Typography>Output data (UTC)</Typography>
          <Divider sx={{ mb: 2 }} />
          <Box className={classes.outBox}>
            <div className={classes.out}> {' Start Time' + ' | '}</div>
            <div className={classes.out}>{'End Time' + ' | '}</div>
            <div className={classes.out}>Group Mask</div>
          </Box>
          {!draw ? (
            output?.map((out, index) => (
              <div key={index} className={classes.outBox}>
                <div className={classes.out}>
                  {out.startTime +
                    ' (' +
                    new Date(out.startTime).toISOString().substr(11, 8) +
                    ') | '}
                </div>
                <div className={classes.out}>
                  {out.endTime +
                    ' (' +
                    new Date(out.endTime).toISOString().substr(11, 8) +
                    ') | '}
                </div>
                <div className={classes.out}>{out.mask}</div>
              </div>
            ))
          ) : (
            <></>
          )}
        </Grid>
      </Container>
    </>
  );
};
