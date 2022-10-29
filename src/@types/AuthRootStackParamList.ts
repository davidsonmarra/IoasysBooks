import { ParamListBase } from '@react-navigation/native';
import BookDTO from './BookDTO';

interface AuthRootStackParamList extends ParamListBase {
  HomeScreen: undefined;
  BookDetailsScreen: { book: BookDTO };
}

export default AuthRootStackParamList;
