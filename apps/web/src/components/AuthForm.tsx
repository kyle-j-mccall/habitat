import { Input } from './ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { signIn, signUp } from '@/lib/auth';
import { Button } from '@base-ui/react';

const signInSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});
export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const form = useForm({
    resolver: zodResolver(signInSchema),
  });

  const signInMutation = useMutation({
    mutationFn: isSignUp ? signUp : signIn,
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {form.formState.errors.email && (
          <span>{form.formState.errors.email.message}</span>
        )}
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
        <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
        <Button type="button" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp
            ? 'Already have an account? Sign In'
            : 'No Account? Sign Up'}
        </Button>
      </form>
    </Form>
  );
}
