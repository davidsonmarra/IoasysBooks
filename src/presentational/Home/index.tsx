import React, { useEffect, useState } from 'react';
import {
  FlatListProps,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableWithoutFeedback
} from 'react-native';
import styled from 'styled-components/native';
import LogoSvg from '../../assets/logo-dark.svg';
import FilterSvg from '../../assets/filter.svg';
import TitleSvg from '../../assets/title-dark.svg';
import LogoutSvg from '../../assets/logout.svg';
import { RFValue } from 'react-native-responsive-fontsize';
import BookDTO from '../../@types/BookDTO';
import { CardBook, FilterModal, ListFooter, SearchInput } from '../../components';
import { FETCH_BOOKS, RESET_BOOKS, SET_SEARCH } from '../../store/slices/booksSlice';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store/store';
import { LOGOUT } from '../../store/slices/profileSlice';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import AuthRootStackParamList from '../../@types/AuthRootStackParamList';

export interface IFormSignIn {
  email: string;
  password: string;
}

export function Home() {
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [offset, setOffset] = useState(1);
  const { navigate } = useNavigation<NavigationProp<AuthRootStackParamList>>();
  const { search, isEnd, booksData, loadingFetchBooks, category } = useSelector(
    ({ books }: IRootState) => books
  );
  const dispatch = useDispatch();

  const handleFilterModal = () => setFilterModalVisible(prev => !prev);

  const handleLogout = () => {
    dispatch(RESET_BOOKS());
    dispatch(LOGOUT());
  };

  const handleSearch = () => {
    Keyboard.dismiss();
    dispatch(RESET_BOOKS());
    dispatch(SET_SEARCH(searchInput));
    setOffset(1);
    dispatch(FETCH_BOOKS({ offset: 1, category, search: searchInput }));
  };

  const onEndReached = () => {
    if (!isEnd) {
      dispatch(FETCH_BOOKS({ offset: offset + 1, category, search }));
      setOffset(offset + 1);
    }
  };

  const renderListFooterComponent = () => {
    return <ListFooter isLoading={loadingFetchBooks} />;
  };

  function handleGoToBookDetails(book: BookDTO) {
    navigate('BookDetailsScreen', { book });
  }

  const renderItem = ({ item }: { item: BookDTO }) => (
    <CardBook data={item} handleGoToBookDetails={book => handleGoToBookDetails(book)} />
  );

  useEffect(() => {
    dispatch(FETCH_BOOKS({ offset, category, search }));
  }, []);

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledTitle>
          <StyledLogo />
          <TitleSvg />
        </StyledTitle>
        <StyledLogoutButton onPress={() => handleLogout()}>
          <LogoutSvg />
        </StyledLogoutButton>
      </StyledHeader>
      <StyledSearch>
        <SearchInput
          name='book'
          placeholder='Procure um livro'
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmit={() => handleSearch()}
        />
        <StyledFilterButton onPress={() => handleFilterModal()}>
          <StyledFilter />
        </StyledFilterButton>
      </StyledSearch>
      <StyledList
        data={booksData}
        keyExtractor={item => `${item.id}`}
        refreshing={loadingFetchBooks}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderListFooterComponent}
        keyboardDismissMode='on-drag'
      />
      <FilterModal
        visible={filterModalVisible}
        handleModal={handleFilterModal}
        setOffset={setOffset}
      />
    </StyledContainer>
  );
}

export const StyledContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const StyledLogo = styled(LogoSvg)`
  margin-right: ${RFValue(16.6)}px;
`;

export const StyledHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${RFValue(42)}px ${RFValue(16)}px 0;
`;

export const StyledTitle = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const StyledLogoutButton = styled.TouchableOpacity`
  width: ${RFValue(32)}px;
  height: ${RFValue(32)}px;
  justify-content: center;
  align-items: center;
  border: ${RFValue(1)}px solid ${({ theme }) => theme.colors.input_background};
  border-radius: ${RFValue(16)}px;
`;

export const StyledSearch = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${RFValue(32)}px;
  padding: 0 ${RFValue(16)}px ${RFValue(32)}px;
`;

export const StyledFilterButton = styled.TouchableOpacity``;

export const StyledFilter = styled(FilterSvg).attrs({
  width: RFValue(24),
  height: RFValue(24)
})``;

export const StyledList = styled(
  FlatList as new (props: FlatListProps<BookDTO>) => FlatList<BookDTO>
).attrs({
  contentContainerStyle: {
    alignItems: 'center',
    paddingBottom: RFValue(24)
  }
})``;
