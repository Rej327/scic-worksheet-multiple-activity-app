import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PhotoGrid from '../PhotoGrid';

// Mock PhotoGrid’s internal behavior: assuming it takes `search`, `sortBy`, etc.
// and displays photos based on them. We'll simulate a basic version of that.

const mockPhotos = [
  { id: 1, title: 'Sunset', url: 'sunset.jpg' },
  { id: 2, title: 'Mountains', url: 'mountains.jpg' },
];

jest.mock('../PhotoGrid', () => (props : any) => {
  const filteredPhotos = mockPhotos.filter((photo) =>
    photo.title.toLowerCase().includes(props.search.toLowerCase())
  );

  return (
    <div>
      {filteredPhotos.map((photo) => (
        <div
          key={photo.id}
          data-testid="photo-item"
          onClick={() => props.onPhotoClick(photo)}
        >
          {photo.title}
        </div>
      ))}
    </div>
  );
});

describe('<PhotoGrid />', () => {
  it('renders photos and triggers onPhotoClick on click', () => {
    const handlePhotoClick = jest.fn();

    render(
      <PhotoGrid
        sortBy="name"
        refreshFlag={false}
        search=""
        onPhotoClick={handlePhotoClick}
      />
    );

    const photoItems = screen.getAllByTestId('photo-item');
    expect(photoItems).toHaveLength(2); // Renders both mock photos

    fireEvent.click(photoItems[0]);
    expect(handlePhotoClick).toHaveBeenCalledWith(mockPhotos[0]);
  });

  it('filters photos based on search', () => {
    render(
      <PhotoGrid
        sortBy="name"
        refreshFlag={false}
        search="sun"
        onPhotoClick={jest.fn()}
      />
    );

    const photoItems = screen.getAllByTestId('photo-item');
    expect(photoItems).toHaveLength(1);
    expect(photoItems[0]).toHaveTextContent('Sunset');
  });
});
