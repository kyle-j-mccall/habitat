export type SignInInput = {
  email: string;
  password: string;
};

export async function signIn(input: SignInInput) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (input.password === 'bad') {
    throw new Error('Invalid credentials');
  }
  return { id: 'stub-user-1', email: input.email };
}
