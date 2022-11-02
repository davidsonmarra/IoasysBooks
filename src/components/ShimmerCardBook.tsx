import React from 'react';
import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import Animated, { FadeIn } from 'react-native-reanimated';

export function ShimmerCardBook() {
  return (
    <AnimatedWrapper entering={FadeIn}>
      <StyledContainer>
        <StyledImageBook />
        <StyledInfo>
          <StyledHeader>
            <StyledTitle />
            <StyledAuthor />
          </StyledHeader>
          <StyledFooter>
            <StyledInfoDetails />
            <StyledInfoDetails />
            <StyledInfoDetails />
          </StyledFooter>
        </StyledInfo>
      </StyledContainer>
    </AnimatedWrapper>
  );
}

const StyledWrapper = styled.View`
  width: 100%;
  padding: 0 ${RFValue(16)}px;
`;

const AnimatedWrapper = Animated.createAnimatedComponent(StyledWrapper);

const StyledContainer = styled.View`
  width: 100%;
  height: ${RFValue(180)}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${RFValue(16)}px;
  padding: ${RFValue(8)}px ${RFValue(16)}px;
  border-radius: ${RFValue(4)}px;
  box-shadow: 0px 6px 24px rgba(84, 16, 95, 0.13);
  background-color: ${({ theme }) => theme.colors.shape};
`;

const StyledImageBook = styled.Image`
  width: ${RFValue(81)}px;
  height: ${RFValue(122)}px;
  margin-right: ${RFValue(16)}px;
  border-radius: ${RFValue(2)}px;
  background-color: ${({ theme }) => theme.colors.shimmer};
`;

const StyledInfo = styled.View`
  flex: 1;
  height: ${RFValue(180)}px;
  justify-content: space-between;
  padding: ${RFValue(16)}px 0;
`;

const StyledHeader = styled.View``;

const StyledTitle = styled.View`
  width: 60%;
  height: ${RFValue(12)}px;
  border-radius: ${RFValue(2)}px;
  margin-bottom: ${RFValue(2)}px;
  background-color: ${({ theme }) => theme.colors.shimmer};
`;

const StyledAuthor = styled.View`
  width: 45%;
  height: ${RFValue(12)}px;
  border-radius: ${RFValue(2)}px;
  background-color: ${({ theme }) => theme.colors.shimmer};
`;

const StyledFooter = styled.View``;

const StyledInfoDetails = styled.View`
  width: 45%;
  height: ${RFValue(12)}px;
  border-radius: ${RFValue(2)}px;
  margin-bottom: ${RFValue(4)}px;
  background-color: ${({ theme }) => theme.colors.shimmer};
`;
