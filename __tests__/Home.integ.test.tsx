// home.test.js
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import Home from '../app/page'; // update this path accordingly
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
    fetchMock.resetMocks();
});

test('uploads files, displays upload duration, and handles loading state', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ status: 'ok' }))
    const { getByText, getByRole, queryByText } = render(<Home />);

    // Assert initial state
    expect(queryByText('Uploading...')).not.toBeInTheDocument();

    // Trigger file input and upload
    const fileInput = getByRole('button', { name: /upload serially to azure/i });
    const file = new File(['file-content'], 'file-name', { type: 'text/plain' });
    userEvent.upload(fileInput, file);

    // Trigger button click to initiate upload
    fireEvent.click(getByText('Upload Serially to Azure'));

    // Assert loading state
    expect(getByText('Uploading...')).toBeInTheDocument();

    // Wait for fetch to be called and assert it was called correctly
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Wait for loading state to disappear
    await waitFor(() => expect(queryByText('Uploading...')).not.toBeInTheDocument());

    // Assert upload duration is displayed
    expect(getByText(/upload duration:/i)).toBeInTheDocument();
});
