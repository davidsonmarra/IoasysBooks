import React, { useRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Control, Controller, FieldError, FieldErrorsImpl } from 'react-hook-form';
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
import { isObjectEmpty } from '../../utils';

interface Props extends TextInputProps {
  control: Control<IFormSignIn>;
  name: keyof IFormSignIn;
  error: FieldError | undefined;
  onSubmit?: () => void;
  canClearErrorOnFocus?: boolean;
  clearErrors: (prop: keyof IFormSignIn) => void;
  getValue: (prop: keyof IFormSignIn) => string;
  errors: Partial<FieldErrorsImpl<IFormSignIn>>;
}

interface ContainerProps {
  error: FieldError | undefined;
}

export function Input({
  name,
  placeholder,
  control,
  error,
  onSubmit,
  canClearErrorOnFocus = false,
  clearErrors,
  getValue,
  errors,
  ...rest
}: Props) {
  const { colors } = useTheme();
  const inputRef = useRef<TextInput>(null);

  const animationPlaceholder = useSharedValue(getValue(name) ? 1 : 0);

  const animationErrorInput = useDerivedValue(() => withTiming(error ? 1 : 0, { duration: 550 }));

  const animationStylePlaceholder = useAnimatedStyle(() => ({
    bottom: interpolate(animationPlaceholder.value, [0, 1], [8, 38], Extrapolate.CLAMP),
    left: interpolate(animationPlaceholder.value, [0, 1], [16, 10], Extrapolate.CLAMP),
    fontSize: interpolate(animationPlaceholder.value, [0, 1], [16, 12], Extrapolate.CLAMP)
  }));

  const animationStyleInputError = useAnimatedStyle(() => ({
    borderColor: interpolateColor(animationErrorInput.value, [0, 1], ['transparent', colors.alert])
  }));

  const onFocus = () => {
    inputRef.current?.focus();
    canClearErrorOnFocus && clearErrors(name);
    !getValue(name) && doAnimationOnPlaceholder(false);
  };

  const onBlur = () => {
    !getValue(name) && doAnimationOnPlaceholder(true);
  };

  const doAnimationOnPlaceholder = (type: boolean) => {
    animationPlaceholder.value = withTiming(type ? 0 : 1, { duration: 350 });
  };

  return (
    <Controller
      control={control}
      rules={{
        required: true
      }}
      name={name}
      render={({ field: { onChange, value } }) => (
        <AnimatedContainer style={[animationStyleInputError]} onPress={onFocus} error={error}>
          <StyledFormInput
            onFocus={onFocus}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            ref={inputRef}
            testID={`input-${name}`}
            {...rest}
          />
          {name === 'password' && <Button disabled={isObjectEmpty(errors)} onPress={onSubmit} />}
          <AnimatedPlaceholder style={[animationStylePlaceholder]}>
            {placeholder}
          </AnimatedPlaceholder>
        </AnimatedContainer>
      )}
    />
  );
}

const StyledContainer = styled.TouchableOpacity<ContainerProps>`
  width: 100%;
  height: ${RFValue(60)}px;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: ${RFValue(16)}px;
  border-radius: ${RFValue(4)}px;
  background-color: ${({ theme }) => theme.colors.input_background};
  border-width: 2px;
`;

const AnimatedContainer = Animated.createAnimatedComponent(StyledContainer);

const StyledFormInput = styled.TextInput`
  flex: 1;
  align-self: flex-end;
  padding: 0 ${RFValue(16)}px ${RFValue(8)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(16)}px;
  color: ${({ theme }) => theme.colors.shape};
`;

const StyledPlaceholder = styled.Text`
  position: absolute;
  font-size: ${RFValue(16)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.shape};
  opacity: 0.5;
`;

const AnimatedPlaceholder = Animated.createAnimatedComponent(StyledPlaceholder);
