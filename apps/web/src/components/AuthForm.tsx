import { Input } from './ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { signIn, signUp } from '@/lib/auth';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

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
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </CardTitle>
        <CardDescription>
          {isSignUp
            ? 'Sign up to start managing your habitat.'
            : 'Sign in to continue to your dashboard.'}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete={
                        isSignUp ? 'new-password' : 'current-password'
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full"
              disabled={signInMutation.isPending}
            >
              {signInMutation.isPending
                ? isSignUp
                  ? 'Creating account…'
                  : 'Signing in…'
                : isSignUp
                  ? 'Sign up'
                  : 'Sign in'}
            </Button>
            <Button
              type="button"
              variant="link"
              className="text-sm"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
