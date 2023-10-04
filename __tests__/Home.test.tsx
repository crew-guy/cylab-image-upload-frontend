import { render, screen } from '@testing-library/react'
import App from '../app/page';
import exp from 'constants';

it('should have Image text', () => {
    render(<App />) //ARRANGE
    const linkElement = screen.getByText(/Image Uploader/i) //ACT
    expect(linkElement).toBeInTheDocument() //ASSERT
})