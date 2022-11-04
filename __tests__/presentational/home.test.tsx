import { Home } from '../../src/presentational';
import { mockPreloadedStateFilled } from '../../__mocks__';
import { matchSnapshotWithProviders, fireEvent, renderWithCustomProviders } from '../test-utils';

describe('Home', () => {
  it('should match a snapshot', async () => {
    matchSnapshotWithProviders(<Home />);
  });

  it('should logout function be called correctly', () => {
    const {
      render: { getByLabelText },
      store
    } = renderWithCustomProviders(<Home />, mockPreloadedStateFilled);
    const logoutButton = getByLabelText('logout');
    expect(store.getState().profile.email).toBeTruthy();
    fireEvent.press(logoutButton);
    expect(store.getState().profile.email).toBeFalsy();
  });
});
