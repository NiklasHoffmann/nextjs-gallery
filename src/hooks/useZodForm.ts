import { useForm, UseFormReturn, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodType } from 'zod';

export interface UseZodFormOptions<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues?: Partial<T>;
}

export function useZodForm<T extends FieldValues>(
  options: UseZodFormOptions<T>
): UseFormReturn<T> {
  // @ts-ignore - Type compatibility between zod and react-hook-form versions
  return useForm<T>({
    // @ts-ignore
    resolver: zodResolver(options.schema),
    // @ts-ignore
    defaultValues: options.defaultValues,
    mode: 'onBlur',
  });
}
