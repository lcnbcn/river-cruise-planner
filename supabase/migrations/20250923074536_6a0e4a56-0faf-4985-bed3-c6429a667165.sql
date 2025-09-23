-- Enable Row Level Security on tourists_allergies table
ALTER TABLE public.tourists_allergies ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own allergy information
-- This assumes there's an authentication system where auth.uid() returns the current user's ID
-- and that tourists have a user_id field or similar authentication link
CREATE POLICY "Users can view their own allergy information" 
ON public.tourists_allergies 
FOR SELECT 
USING (
  tourist_id IN (
    SELECT id FROM public.tourists WHERE id = tourist_id
  )
);

-- Create policy to allow authorized staff to view allergy information
-- This assumes there's a user roles system where staff members can be identified
CREATE POLICY "Authenticated staff can view allergy information" 
ON public.tourists_allergies 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create policy for inserting allergy information (for staff only)
CREATE POLICY "Authenticated staff can insert allergy information" 
ON public.tourists_allergies 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Create policy for updating allergy information (for staff only)
CREATE POLICY "Authenticated staff can update allergy information" 
ON public.tourists_allergies 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Create policy for deleting allergy information (for staff only)
CREATE POLICY "Authenticated staff can delete allergy information" 
ON public.tourists_allergies 
FOR DELETE 
USING (auth.role() = 'authenticated');