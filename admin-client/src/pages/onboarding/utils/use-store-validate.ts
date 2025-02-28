import { useMutation } from '@tanstack/react-query';
import { validateStoreNameAndHandle } from '../api/validate-store';
import { useToast } from '@/hooks/use-toast';

export const useStoreValidate = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: { storeName: string; handle: string }) => {
      return await validateStoreNameAndHandle(payload);
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMsg = Object.values(errors).join(' ');
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: errorMsg,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: 'Failed to validate store details.',
        });
      }
    },
  });
};
