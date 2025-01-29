/*
  # Initial Schema for Apartment Furnishing System

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - matches auth.users id
      - `email` (text)
      - `role` (text) - either 'morador' or 'visitante'
      - `created_at` (timestamp)
    
    - `groups`
      - `id` (uuid, primary key)
      - `name` (text) - group name
      - `created_by` (uuid) - reference to profiles
      - `is_custom` (boolean) - whether it's a custom or predefined group
      - `created_at` (timestamp)
    
    - `items`
      - `id` (uuid, primary key)
      - `name` (text) - item name
      - `price` (decimal) - item price
      - `group_id` (uuid) - reference to groups
      - `status` (text) - 'pendente', 'comprado', or 'presenteado'
      - `created_by` (uuid) - reference to profiles
      - `gifted_by` (uuid, nullable) - reference to profiles when gifted
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on their role
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('morador', 'visitante')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create groups table
CREATE TABLE groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_by uuid REFERENCES profiles(id),
  is_custom boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read groups"
  ON groups FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only moradores can insert groups"
  ON groups FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'morador'
    )
  );

-- Create items table
CREATE TABLE items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price decimal(10,2) NOT NULL,
  group_id uuid REFERENCES groups(id),
  status text NOT NULL CHECK (status IN ('pendente', 'comprado', 'presenteado')),
  created_by uuid REFERENCES profiles(id),
  gifted_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read items"
  ON items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only moradores can insert items"
  ON items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'morador'
    )
  );

CREATE POLICY "Only moradores can update their items"
  ON items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'morador'
    )
  );

CREATE POLICY "Only moradores can delete their items"
  ON items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'morador'
    )
  );

-- Insert predefined groups
INSERT INTO groups (name, is_custom) VALUES
  ('Sala', false),
  ('Cozinha', false),
  ('Quarto', false),
  ('Banheiro', false),
  ('Varanda', false),
  ('Escritório', false);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for items updated_at
CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();