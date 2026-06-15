import { render, screen } from '@testing-library/react';
import PaymentGatewayConfig from './page';

describe('PaymentGatewayConfig', () => {
  it('renders the Payment Gateway Configurations page', () => {
    render(<PaymentGatewayConfig />);
    expect(screen.getByText('Payment Gateway Configurations')).toBeInTheDocument();
    expect(screen.getByLabelText('Gateway Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('API Key:')).toBeInTheDocument();
    expect(screen.getByLabelText('Secret Key:')).toBeInTheDocument();
    expect(screen.getByText('Save Configuration')).toBeInTheDocument();
  });
});