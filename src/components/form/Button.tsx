import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store/store';

type Props = TouchableOpacityProps;

export function Button({ disabled, ...rest }: Props) {
  const { isLoading } = useSelector(({ profile }: IRootState) => profile);

  return (
    <StyledContainer disabled={disabled || isLoading} {...rest}>
      {isLoading ? <StyledLoading /> : <StyledTitle>Entrar</StyledTitle>}
    </StyledContainer>
  );
}

const StyledContainer = styled.TouchableOpacity`
  width: ${RFValue(85)}px;
  height: ${RFValue(40)}px;
  justify-content: center;
  align-items: center;
  align-self: center;
  margin-right: ${RFValue(16)}px;
  padding: ${RFValue(8)}px 0;
  border-radius: ${RFValue(44)}px;
  background-color: ${({ theme }) => theme.colors.shape};
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
`;

const StyledLoading = styled.ActivityIndicator.attrs(({ theme }) => ({
  color: theme.colors.button
}))`
  font-size: ${RFValue(16)}px;
`;

const StyledTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(16)}px;
  color: ${({ theme }) => theme.colors.button};
`;
