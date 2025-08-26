import { useMutation } from '@tanstack/react-query';
import { correctText } from '../../util/post/correctText';

const useCorrectText = ({ onSuccess, onError }) => {
  return useMutation({ 
    mutationFn: correctText,
    onSuccess,
    onError,
  });
};

export default useCorrectText;