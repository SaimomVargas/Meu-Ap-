/*
  # Fix Profiles RLS Policies

  1. Changes
    - Add RLS policy to allow inserting new profiles during registration
    - This policy allows unauthenticated users to create their initial profile

  2. Security
    - Enables new user registration while maintaining security
    - Only allows profile creation when the ID matches the authenticated user's ID
*/

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (
    -- During signup, auth.uid() will match the id being inserted
    auth.uid() = id
  );