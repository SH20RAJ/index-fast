'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { Box, Typography, TextField, Button, Alert, Stack } from '@mui/material';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Define Zod schema for form validation
const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

type FormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateField = (name: keyof FormData, value: string) => {
    try {
      contactSchema.shape[name].parse(value);
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    } catch (error: any) {
      setErrors(prev => ({
        ...prev,
        [name]: error.message,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    // Validate all fields
    try {
      contactSchema.parse(formData);
      setErrors({});
      
      // Simulate form submission
      setIsSubmitting(true);
      
      // In a real application, you would send the data to your backend here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      console.log('Form submitted:', formData);
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000); // Hide success message after 5 seconds
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<FormData> = {};
        error.issues.forEach((issue) => {
          fieldErrors[issue.path[0] as keyof FormData] = issue.message;
        });
        setErrors(fieldErrors);
      }
      setSubmitError('There were errors in your submission. Please check the form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = (field: keyof FormData) => (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    validateField(field, e.target.value);
  };

  return (
    <Card className="p-6 md:p-8 w-full max-w-2xl mx-auto">
      <Typography variant="h4" component="h2" gutterBottom align="center" className="font-bold">
        Contact Us
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" mb={4}>
        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
      </Typography>
      
      {submitSuccess && (
        <Alert severity="success" className="mb-4">
          Thank you for your message! We'll get back to you soon.
        </Alert>
      )}
      
      {submitError && (
        <Alert severity="error" className="mb-4">
          {submitError}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <div>
            <Input
              id="name"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur('name')}
              className={`w-full ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && (
              <Typography variant="caption" color="error" mt={0.5} display="block">
                {errors.name}
              </Typography>
            )}
          </div>
          
          <div>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur('email')}
              className={`w-full ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <Typography variant="caption" color="error" mt={0.5} display="block">
                {errors.email}
              </Typography>
            )}
          </div>
          
          <div>
            <Input
              id="subject"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur('subject')}
              className={`w-full ${errors.subject ? 'border-red-500' : ''}`}
            />
            {errors.subject && (
              <Typography variant="caption" color="error" mt={0.5} display="block">
                {errors.subject}
              </Typography>
            )}
          </div>
          
          <div>
            <textarea
              id="message"
              name="message"
              placeholder="Your Message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur('message')}
              className={`w-full p-3 border rounded-md ${errors.message ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]`}
            />
            {errors.message && (
              <Typography variant="caption" color="error" mt={0.5} display="block">
                {errors.message}
              </Typography>
            )}
          </div>
          
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </Stack>
      </form>
    </Card>
  );
}