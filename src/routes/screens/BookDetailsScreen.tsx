import React from 'react';
import { BookDetails } from '../../presentational';
import AuthRootStackParamList from '../../@types/AuthRootStackParamList';
import { RouteProp, useRoute } from '@react-navigation/native';

export function BookDetailsScreen() {
  const {
    params: { book }
  } = useRoute<RouteProp<AuthRootStackParamList, 'BookDetailsScreen'>>();

  return <BookDetails book={book} />;
}
