import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Box } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

interface Holding {
  name: string;
  ticker: string;
  asset_class: string;
  avg_price: number;
  market_price: number;
  latest_chg_pct: number;
  market_value_ccy: number;
}

interface RowProps {
  row: Holding;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

function Row({ row, isOpen, setIsOpen }: RowProps) {
    return (
      <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton size="small" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">{row.name}</TableCell>
          <TableCell align="right">{row.ticker}</TableCell>
          <TableCell align="right">{row.avg_price}</TableCell>
          <TableCell align="right">{row.market_price}</TableCell>
          <TableCell align="right">{row.latest_chg_pct}</TableCell>
          <TableCell align="right">{row.market_value_ccy}</TableCell>
        </TableRow>
        {isOpen && (
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
              <Typography variant="h6" gutterBottom component="div">
                Details for {row.name}
              </Typography>
              {/* Add more details or components here as needed */}
            </TableCell>
          </TableRow>
        )}
      </>
    );
  }

function HoldingsTable() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  

  useEffect(() => {
    axios.get('https://canopy-frontend-task.now.sh/api/holdings')
      .then(response => {
        setHoldings(response.data.payload);
        const initialOpenStates = response.data.payload.reduce((acc: { [key: string]: boolean }, item: Holding) => {
            if (!acc[item.asset_class]) {
              acc[item.asset_class] = false; // Initially collapse all groups
            }
            return acc;
          }, {});
        setOpen(initialOpenStates);
      })
      .catch(error => console.error('Error fetching  ', error));
  }, []);

  const groupedHoldings = holdings.reduce((acc: { [key: string]: Holding[] }, item) => {
    if (!acc[item.asset_class]) acc[item.asset_class] = [];
    acc[item.asset_class].push(item);
    return acc;
  }, {});

  const handleGroupToggle = (asset_class: string) => {
    setOpen({ ...open, [asset_class]: !open[asset_class] });
  };

  return (
    <Box display="flex" justifyContent="center">
        <TableContainer component={Paper} elevation={3} sx={{width: '100vw'}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Name</TableCell>
                <TableCell align="right">Ticker</TableCell>
                <TableCell align="right">Asset Class</TableCell>
                <TableCell align="right">Avg Price</TableCell>
                <TableCell align="right">Market Price</TableCell>
                <TableCell align="right">Latest Change (%)</TableCell>
                <TableCell align="right">Market Value (CCY)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(groupedHoldings).map(([assetClass, items]) => (
                <React.Fragment key={assetClass}>
                  <TableRow>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleGroupToggle(assetClass)}>
                        {open[assetClass] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
                    <TableCell colSpan={7}>{assetClass}</TableCell>
                  </TableRow>
                  {open[assetClass] && items.map((item) => (
                    <Row key={item.name} row={item} isOpen={open[item.name]} setIsOpen={(value) => setOpen({ ...open, [item.name]: value })} />
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </Box>
  );
}

export default HoldingsTable;