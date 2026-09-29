import { Input } from './ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { signIn } from '@/lib/auth';

const signInSchema = z.object({
  email: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});
export function AuthForm() {
  const form = useForm({
    resolver: zodResolver(signInSchema),
  });

  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      console.log('Sign in successful');
    },
    onError: (error) => {
      console.error('Sign in failed', error);
    },
  });

  const onSubmit = (data: z.infer<typeof signInSchema>) => {
    signInMutation.mutate(data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {form.formState.errors.username && (
          <span>{form.formState.errors.username.message}</span>
        )}
        <FormLabel>Password</FormLabel>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
            </FormItem>
          )}
        />
        {form.formState.errors.password && (
          <span>{form.formState.errors.password.message}</span>
        )}
        <button type="submit">Login</button>
      </form>
    </Form>
  );
}
