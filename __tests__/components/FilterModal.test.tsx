import { FilterModal } from '../../src/components';
import { mockPreloadedStateFilled } from '../../__mocks__';
import {
  matchSnapshotWithProviders,
  fireEvent,
  renderWithCustomProviders,
  cleanup
} from '../test-utils';
import { server } from '../jest.setup';

const params = (visible = true, handleModal = jest.fn(), setOffset = jest.fn(), search = '') => ({
  visible,
  handleModal,
  setOffset,
  search
});

describe('Filter Modal', () => {
  afterEach(() => {
    cleanup();
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it('should match a snapshot', () => {
    matchSnapshotWithProviders(<FilterModal {...params()} />);
  });

  it('should select category correctly', () => {
    const {
      render: { getByTestId, getByLabelText },
      store
    } = renderWithCustomProviders(<FilterModal {...params()} />, mockPreloadedStateFilled);
    const categoryButton = getByTestId(/category-tales-button/i);
    const buttonFilterSubmit = getByLabelText(/submit filter/i);

    fireEvent.press(categoryButton);
    fireEvent.press(buttonFilterSubmit);
    expect(store.getState().books.category).toEqual({ key: 'tales', title: 'Contos' });

    fireEvent.press(categoryButton);
    fireEvent.press(buttonFilterSubmit);
    expect(store.getState().books.category).toEqual({});
  });
});
