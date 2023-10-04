import { render, screen } from '@testing-library/react'
import App from '../app/page';


describe('Home', () => {
    it('should have Image text', () => {
        render(<App />) //ARRANGE
        const linkElement = screen.getByText(/Image/i) //ACT
        expect(linkElement).toBeInTheDocument() //ASSERT
    })
    it('should have Uploader text', () => {
        render(<App />) //ARRANGE
        const linkElement = screen.getByText(/Uploader/i) //ACT
        expect(linkElement).toBeInTheDocument() //ASSERT
    })
    it('should have "Image Uploader" text', () => {
        render(<App />) //ARRANGE
        const linkElement = screen.getByRole('heading', {
            name: 'Image Uploader'
        }) //ACT
        expect(linkElement).toBeInTheDocument() //ASSERT
    })


})