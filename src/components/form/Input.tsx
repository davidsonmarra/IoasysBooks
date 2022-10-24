import React, { useRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Control, Controller, FieldError } from 'react-hook-form';
import { Button } from './Button';
import { IFormSignIn } from '../../presentational/SignIn';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  interpolateColor,
  Extrapolate
} from 'react-native-reanimated';

interface Props extends TextInputProps {
  control: Control<IFormSignIn>;
  name: keyof IFormSignIn;
  error: FieldError | undefined;
  onSubmit?: () => void;
  clearErrors: (prop: keyof IFormSignIn) => void;
  getValue: (prop: keyof IFormSignIn) => string;
}

interface ContainerProps {
  error: FieldError | undefined;
  borderColor: () => void;
}

export function Input({
  name,
  placeholder,
  control,
  onSubmit,
  error,
  getValue,
  clearErrors,
  ...rest
}: Props) {
  const inputRef = useRef<TextInput>(null);
  const { colors } = useTheme();

  const AnimatedContainer = Animated.createAnimatedComponent(StyledContainer);
  const AnimatedPlaceholder = Animated.createAnimatedComponent(StyledPlaceholder);
  const animationError = useDerivedValue(() => withTiming(error ? 1 : 0, { duration: 350 }));
  const animationPlaceholder = useSharedValue(0);

  const animationStyleError = useAnimatedStyle(() => ({
    borderColor: interpolateColor(animationError.value, [0, 1], ['transparent', colors.alert])
  }));

  const animationStylePlaceholder = useAnimatedStyle(() => ({
    bottom: interpolate(animationPlaceholder.value, [0, 1], [8, 40], Extrapolate.CLAMP),
    fontSize: interpolate(animationPlaceholder.value, [0, 1], [16, 12], Extrapolate.CLAMP)
  }));

  const onFocus = () => {
    if (error) {
      clearErrors(name);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    } else inputRef.current?.focus();
    !getValue(name) && doAnimationOnPlaceholder();
  };

  const onBlur = () => {
    !getValue(name) && doAnimationOnPlaceholder();
  };

  const doAnimationOnPlaceholder = () => {
    animationPlaceholder.value = withTiming(animationPlaceholder.value ? 0 : 1, { duration: 350 });
  };

  return (
    <Controller
      control={control}
      rules={{
        required: true
      }}
      name={name}
      render={({ field: { onChange, value } }) => (
        <>
          <AnimatedContainer style={[animationStyleError]} onPress={onFocus} error={error}>
            <StyledFormInput
              onFocus={onFocus}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              ref={inputRef}
              {...rest}
            />
            {name === 'password' && <Button onPress={onSubmit} />}
            <AnimatedPlaceholder style={[animationStylePlaceholder]}>
              {placeholder}
            </AnimatedPlaceholder>
          </AnimatedContainer>
        </>
      )}
    />
  );
}

export const StyledContainer = styled.TouchableOpacity<ContainerProps>`
  width: 100%;
  height: ${RFValue(60)}px;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: ${RFValue(16)}px;
  border-radius: ${RFValue(4)}px;
  background-color: ${({ theme }) => theme.colors.input_background};
  border-width: 2px;
`;

export const StyledFormInput = styled.TextInput`
  flex: 1;
  align-self: flex-end;
  padding: 0 ${RFValue(16)}px ${RFValue(8)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(16)}px;

  color: ${({ theme }) => theme.colors.shape};
`;

export const StyledPlaceholder = styled.Text`
  position: absolute;
  /* left: ${RFValue(16)}px;
  top: ${RFValue(8)}px; */
  bottom: 8px;
  /* top: 8px; */
  left: 16px;

  font-family: ${({ theme }) => theme.fonts.regular};
  /* font-size: ${RFValue(12)}px; */
  font-size: 16px;
  color: ${({ theme }) => theme.colors.shape};
  opacity: 0.5;
`;
