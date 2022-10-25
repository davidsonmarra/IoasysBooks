import BookDTO from './BookDTO';

interface AuthRootStackParamList {
  HomeScreen: undefined;
  BookDetailsScreen: { book: BookDTO };
}

export default AuthRootStackParamList;
