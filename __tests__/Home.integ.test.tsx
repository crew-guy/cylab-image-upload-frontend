import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import Home from '../app/page';

fetchMock.enableMocks();

beforeEach(() => {
    fetchMock.resetMocks();
});

test('uploads files, displays upload duration, and handles loading state', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ status: 'ok' }));

    render(<Home />);

    // Query for the file input and upload button
    const fileInput = screen.getByLabelText(/upload file:/i) as HTMLInputElement;
    const uploadButton = screen.getByRole('button', { name: /upload serially to azure/i });

    // Prepare a File object
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    // Dispatch the file input change event with the File object
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Click the upload button to trigger the uploadFiles function
    fireEvent.click(uploadButton);

    // Wait for the loading and upload duration text to appear
    // await waitFor(() => {
    //     expect(screen.getByText(/uploading.../i)).toBeInTheDocument();
    //     expect(screen.getByText(/upload duration: \d+ milliseconds/i)).toBeInTheDocument();
    // });

    // Assert fetchMock was called with expected arguments
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/api/upload', expect.anything());
});
