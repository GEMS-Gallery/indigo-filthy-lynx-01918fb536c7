import React, { useState } from 'react';
import { Container, Paper, Grid, Button, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { backend } from 'declarations/backend';

const CalculatorButton = styled(Button)(({ theme }) => ({
  fontSize: '1.25rem',
  padding: theme.spacing(2),
}));

const Display = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'right',
  fontSize: '2rem',
  marginBottom: theme.spacing(2),
}));

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (num: string) => {
    setDisplay(prev => (prev === '0' ? num : prev + num));
  };

  const handleOperationClick = (op: string) => {
    if (firstOperand === null) {
      setFirstOperand(parseFloat(display));
      setOperation(op);
      setDisplay('0');
    } else {
      handleEqualsClick();
      setOperation(op);
    }
  };

  const handleEqualsClick = async () => {
    if (firstOperand !== null && operation) {
      setLoading(true);
      try {
        const result = await backend.calculate(operation, firstOperand, parseFloat(display));
        setDisplay(result.toString());
        setFirstOperand(null);
        setOperation(null);
      } catch (error) {
        setDisplay('Error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperation(null);
  };

  const handleBackspace = () => {
    setDisplay(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  return (
    <Container maxWidth="xs">
      <Display elevation={3}>
        <Typography variant="h4">
          {display}
          {loading && <CircularProgress size={20} style={{ marginLeft: '10px' }} />}
        </Typography>
      </Display>
      <Grid container spacing={1}>
        {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
          <Grid item xs={3} key={btn}>
            <CalculatorButton
              variant="contained"
              fullWidth
              onClick={() => {
                if (btn === '=') handleEqualsClick();
                else if (['+', '-', '*', '/'].includes(btn)) handleOperationClick(btn);
                else handleNumberClick(btn);
              }}
              color={['+', '-', '*', '/', '='].includes(btn) ? 'primary' : 'secondary'}
            >
              {btn}
            </CalculatorButton>
          </Grid>
        ))}
        <Grid item xs={6}>
          <CalculatorButton variant="contained" fullWidth onClick={handleClear} color="error">
            Clear
          </CalculatorButton>
        </Grid>
        <Grid item xs={6}>
          <CalculatorButton variant="contained" fullWidth onClick={handleBackspace} color="info">
            <BackspaceIcon />
          </CalculatorButton>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;