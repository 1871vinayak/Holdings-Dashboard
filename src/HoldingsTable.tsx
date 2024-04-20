import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface Holding {
  name: string;
  ticker: string;
  asset_class: string;
  avg_price: number;
  market_price: number;
  latest_chg_pct: number;
  market_value_ccy: number;
}

function HoldingsTable() {
  const [holdings, setHoldings] = useState<Holding[]>([]);

  useEffect(() => {
    axios.get('https://canopy-frontend-task.now.sh/api/holdings')
      .then(response => {
        setHoldings(response.data.payload);
      })
      .catch(error => console.error('Error fetching  ', error));
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
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
          {holdings.map((holding) => (
            <TableRow key={holding.name}>
              <TableCell component="th" scope="row">{holding.name}</TableCell>
              <TableCell align="right">{holding.ticker}</TableCell>
              <TableCell align="right">{holding.asset_class}</TableCell>
              <TableCell align="right">{holding.avg_price}</TableCell>
              <TableCell align="right">{holding.market_price}</TableCell>
              <TableCell align="right">{holding.latest_chg_pct}</TableCell>
              <TableCell align="right">{holding.market_value_ccy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default HoldingsTable;