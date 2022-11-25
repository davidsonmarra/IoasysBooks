import React, { useEffect } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableWithoutFeedback
} from 'react-native';
import styled from 'styled-components/native';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { RFValue } from 'react-native-responsive-fontsize';
import { schema } from './schema';
import { Input } from '../../components';
import TitleSvg from '../../assets/title.svg';
import LogoSvg from '../../assets/logo.svg';
import background from '../../assets/background.png';
import Toast from 'react-native-toast-message';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  Easing,
  Extrapolate
} from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { LOGIN } from '../../store/slices/profileSlice';
import { IRootState } from '../../store/store';
import { isObjectEmpty } from '../../utils';

export interface IFormSignIn {
  email: string;
  password: string;
}

export function SignIn() {
  const { error } = useSelector(({ profile }: IRootState) => profile);

  const dispatch = useDispatch();
  const animation = useSharedValue(0);

  const animationStyleLogo = useAnimatedStyle(() => ({
    marginRight: interpolate(animation.value, [0, 1], [-16.6, 16.6], Extrapolate.CLAMP),
    left: interpolate(animation.value, [0, 1], [50, 0], Extrapolate.CLAMP),
    opacity: interpolate(animation.value, [0, 1], [0, 1])
  }));

  const animationStyleTitle = useAnimatedStyle(() => ({
    right: interpolate(animation.value, [0, 1], [50, 0], Extrapolate.CLAMP),
    opacity: interpolate(animation.value, [0, 1], [0, 1])
  }));

  const animationStyleForm = useAnimatedStyle(() => ({
    opacity: interpolate(animation.value, [0, 1], [0, 1])
  }));

  const {
    control,
    formState: { errors },
    clearErrors,
    getValues,
    setError,
    handleSubmit
  } = useForm<IFormSignIn>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onChange'
  });

  const onSubmit = (form: IFormSignIn) => {
    Keyboard.dismiss();
    dispatch(LOGIN(form));
  };

  useEffect(() => {
    animation.value = withTiming(1, { duration: 1200, easing: Easing.in(Easing.ease) });
  }, []);

  useEffect(() => {
    isObjectEmpty(errors) &&
      Toast.show({
        type: 'error',
        text1: 'Ops... algo não funcionou corretamente',
        text2: errors.email?.message || errors.password?.message,
        props: {
          style: {
            background: 'red'
          }
        }
      });
  }, [errors]);

  useEffect(() => {
    if (isObjectEmpty(error)) {
      setError('email', new Error('Login inválido. Tente novamente'));
      setError('password', new Error('Login inválido. Tente novamente'));
      Toast.show({
        type: 'error',
        text1: 'Ops... algo não funcionou corretamente',
        text2: errors.email?.message || errors.password?.message,
        props: {
          style: {
            background: 'red'
          }
        }
      });
    }
  }, [error]);

  return (
    <TouchableWithoutFeedback testID='SignInScreen' onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StyledContainer>
          <StatusBar barStyle='light-content' backgroundColor='transparent' translucent />
          <StyledBackground source={background} />
          <StyledTitle>
            <Animated.View style={[animationStyleLogo]}>
              <LogoSvg />
            </Animated.View>
            <Animated.View style={[animationStyleTitle]}>
              <TitleSvg />
            </Animated.View>
          </StyledTitle>
          <AnimatedForm style={[animationStyleForm]}>
            <Input
              name='email'
              placeholder='Email'
              autoCorrect={false}
              autoCapitalize='none'
              control={control}
              error={errors['email']}
              canClearErrorOnFocus={isObjectEmpty(error)}
              getValue={getValues}
              clearErrors={clearErrors}
              errors={errors}
            />
            <Input
              name='password'
              placeholder='Senha'
              secureTextEntry
              autoCorrect={false}
              autoCapitalize='none'
              control={control}
              error={errors['password']}
              getValue={getValues}
              canClearErrorOnFocus={isObjectEmpty(error)}
              onSubmit={handleSubmit(onSubmit)}
              clearErrors={clearErrors}
              errors={errors}
            />
          </AnimatedForm>
        </StyledContainer>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const StyledContainer = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0 ${RFValue(16)}px;
`;

const StyledBackground = styled.ImageBackground`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const StyledTitle = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${RFValue(50)}px;
`;

const StyledForm = styled.View``;

const AnimatedForm = Animated.createAnimatedComponent(StyledForm);
