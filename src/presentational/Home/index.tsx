import React, { useEffect, useState } from 'react';
import { FlatListProps, FlatList, Keyboard, RefreshControl } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import LogoSvg from '../../assets/logo-dark.svg';
import FilterSvg from '../../assets/filter.svg';
import TitleSvg from '../../assets/title-dark.svg';
import LogoutSvg from '../../assets/logout.svg';
import { RFValue } from 'react-native-responsive-fontsize';
import BookDTO from '../../@types/BookDTO';
import { CardBook, FilterModal, SearchInput, ShimmerCardBook } from '../../components';
import { FETCH_BOOKS, RESET_BOOKS } from '../../store/slices/booksSlice';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store/store';
import { LOGOUT } from '../../store/slices/profileSlice';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import AuthRootStackParamList from '../../@types/AuthRootStackParamList';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './schema';

export interface IFormSearch {
  search: string;
}

export function Home() {
  const { colors } = useTheme();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [offset, setOffset] = useState(1);
  const { navigate } = useNavigation<NavigationProp<AuthRootStackParamList, 'Home'>>();
  const dispatch = useDispatch();
  const { isEnd, booksData, loadingFetchBooks, category } = useSelector(
    ({ books }: IRootState) => books
  );
  const { control, getValues, handleSubmit, reset } = useForm<IFormSearch>({
    resolver: yupResolver(schema),
    mode: 'onSubmit'
  });

  const handleFilterModal = () => setFilterModalVisible(prev => !prev);

  const handleLogout = () => {
    dispatch(RESET_BOOKS());
    dispatch(LOGOUT());
  };

  const onReset = () => {
    setOffset(1);
    reset();
    dispatch(RESET_BOOKS());
    dispatch(FETCH_BOOKS({ offset: 1, category, search: '' }));
  };

  const onSubmit = (form: IFormSearch) => {
    Keyboard.dismiss();
    setOffset(1);
    dispatch(RESET_BOOKS());
    dispatch(FETCH_BOOKS({ offset: 1, category, search: form.search }));
  };

  const onEndReached = () => {
    if (!isEnd) {
      dispatch(FETCH_BOOKS({ offset: offset + 1, category, search: getValues('search') || '' }));
      setOffset(offset + 1);
    }
  };

  const renderListFooterComponent = () =>
    loadingFetchBooks ? (
      <>
        <ShimmerCardBook />
        <ShimmerCardBook />
        <ShimmerCardBook />
      </>
    ) : (
      <StyledFooter />
    );

  function handleGoToBookDetails(book: BookDTO) {
    navigate('BookDetailsScreen', { book });
  }

  const renderItem = ({ item }: { item: BookDTO }) => (
    <CardBook data={item} handleGoToBookDetails={book => handleGoToBookDetails(book)} />
  );

  const refreshControl = (
    <RefreshControl
      colors={[colors.button]}
      tintColor={colors.button}
      refreshing={loadingFetchBooks}
      onRefresh={() => onSubmit({ search: getValues('search') || '' })}
    />
  );

  useEffect(() => {
    dispatch(FETCH_BOOKS({ offset, category, search: getValues('search') || '' }));
  }, []);

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledTitle>
          <StyledLogo />
          <TitleSvg />
        </StyledTitle>
        <StyledLogoutButton accessibilityLabel='logout' onPress={handleLogout}>
          <LogoutSvg />
        </StyledLogoutButton>
      </StyledHeader>
      <StyledSearch>
        <SearchInput
          control={control}
          name='search'
          placeholder='Procure um livro'
          autoCorrect={false}
          autoCapitalize='none'
          searchValue={getValues('search')}
          onSubmit={handleSubmit(onSubmit)}
          reset={onReset}
        />
        <StyledFilterButton onPress={handleFilterModal}>
          <StyledFilter />
        </StyledFilterButton>
      </StyledSearch>
      <StyledList
        data={booksData}
        refreshControl={refreshControl}
        keyExtractor={item => `${item.id}`}
        refreshing={loadingFetchBooks}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        scrollEventThrottle={16}
        ListFooterComponent={renderListFooterComponent}
        keyboardDismissMode='on-drag'
      />
      <FilterModal
        visible={filterModalVisible}
        handleModal={handleFilterModal}
        setOffset={setOffset}
        getSearch={() => getValues('search')}
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

export const StyledFooter = styled.View`
  height: ${RFValue(100)}px;
`;
