import React, { useRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import SearchSvg from '../../assets/search.svg';
import CleanSvg from '../../assets/close.svg';
import { Control, Controller } from 'react-hook-form';
import { IFormSearch } from '../../presentational/Home';

interface Props extends TextInputProps {
  control: Control<IFormSearch>;
  name: keyof IFormSearch;
  onSubmit: () => void;
  searchValue: string;
  reset: () => void;
}

export function SearchInput({ onSubmit, control, name, reset, searchValue, ...rest }: Props) {
  const inputRef = useRef<TextInput>(null);

  const onFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <Controller
      control={control}
      rules={{
        required: true
      }}
      name={name}
      render={({ field: { onChange, value } }) => {
        const showCleanIcon = value !== searchValue || !value;

        return (
          <StyledContainer onPress={onFocus}>
            <StyledFormInput onChangeText={onChange} value={value} ref={inputRef} {...rest} />
            <StyledSearchButton
              testID='search-submit-button'
              onPress={() => (showCleanIcon ? onSubmit() : reset())}
            >
              {showCleanIcon ? <StyledSearchIcon /> : <StyledSearchClear />}
            </StyledSearchButton>
          </StyledContainer>
        );
      }}
    />
  );
}

export const StyledContainer = styled.TouchableOpacity`
  width: 85%;
  height: ${RFValue(60)}px;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0 ${RFValue(16)}px 0 ${RFValue(11)}px;
  border: ${RFValue(1)}px solid ${({ theme }) => theme.colors.input_background};
  border-radius: ${RFValue(2)}px;
`;

export const StyledFormInput = styled.TextInput`
  flex: 1;
  height: 100%;
  align-self: flex-end;
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.dark};
`;

export const StyledSearchIcon = styled(SearchSvg).attrs({
  width: RFValue(24),
  height: RFValue(24)
})``;

export const StyledSearchClear = styled(CleanSvg).attrs({
  width: RFValue(24),
  height: RFValue(24)
})``;

export const StyledSearchButton = styled.TouchableOpacity`
  align-self: center;
`;
