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

export interface IFormSignIn {
  email: string;
  password: string;
}

export function SignIn() {
  const {
    control,
    formState: { errors },
    clearErrors,
    getValues,
    handleSubmit
  } = useForm<IFormSignIn>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  });

  const onSubmit = ({ email, password }: IFormSignIn) => {
    console.log(email, password);
  };

  useEffect(() => {
    Object.keys(errors).length > 0 &&
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StyledContainer>
          <StatusBar barStyle='light-content' backgroundColor='transparent' translucent />
          <StyledBackground source={background} />
          <StyledTitle>
            <StyledLogo />
            <TitleSvg />
          </StyledTitle>
          <StyledForm>
            <Input
              name='email'
              placeholder='Email'
              autoCorrect={false}
              autoCapitalize='none'
              control={control}
              error={errors['email']}
              getValue={getValues}
              clearErrors={clearErrors}
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
              onSubmit={handleSubmit(onSubmit)}
              clearErrors={clearErrors}
            />
          </StyledForm>
        </StyledContainer>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

export const StyledContainer = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0 ${RFValue(16)}px;
`;

export const StyledBackground = styled.ImageBackground`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const StyledLogo = styled(LogoSvg)`
  margin-right: ${RFValue(16.6)}px;
`;

export const StyledTitle = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${RFValue(50)}px;
`;

export const StyledForm = styled.View``;
