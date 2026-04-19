"use client";

import React, { useState } from 'react';
import { z } from 'zod';
import { cn } from "@/lib/utils";
import { Send, User, Mail, MessageSquare, HelpCircle, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
      const message = error instanceof z.ZodError ? error.issues[0].message : 'Invalid field';
      setErrors(prev => ({
        ...prev,
        [name]: message,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    try {
      contactSchema.parse(formData);
      setErrors({});
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<FormData> = {};
        error.issues.forEach((issue) => {
          fieldErrors[issue.path[0] as keyof FormData] = issue.message;
        });
        setErrors(fieldErrors);
      }
      setSubmitError('Please correct the highlighted errors before submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = (field: keyof FormData) => (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    validateField(field, e.target.value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary mb-2">
          <HelpCircle className="h-3 w-3" /> Get in Touch
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-[0.9]">
          How can we <span className="text-primary italic font-hand inline-block -rotate-2">help?</span>
        </h2>
        <p className="text-lg font-medium text-muted-foreground/60 max-w-md mx-auto">
          Have a question about indexing or enterprise plans? Our team is standing by.
        </p>
      </div>

      <Card className="border-border/40 bg-card/30 backdrop-blur-xl shadow-2xl shadow-primary/5 rounded-[40px] overflow-hidden">
        <CardContent className="p-8 md:p-12">
          {submitSuccess && (
            <Alert className="mb-8 border-pink-500/50 bg-pink-500/5 text-pink-600 animate-in fade-in slide-in-from-top-4 duration-500">
              <CheckCircle2 className="h-4 w-4 text-pink-500" />
              <AlertTitle className="font-bold tracking-tight">Message Sent!</AlertTitle>
              <AlertDescription className="font-medium opacity-90">
                We've received your inquiry and will get back to you within 24 hours.
              </AlertDescription>
            </Alert>
          )}
          
          {submitError && (
            <Alert variant="destructive" className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-bold tracking-tight">Error</AlertTitle>
              <AlertDescription className="font-medium">
                {submitError}
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Name</Label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -tranzinc-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur('name')}
                    className={cn(
                      "h-12 pl-11 bg-muted/20 border-border/40 rounded-2xl focus-visible:ring-primary/20 transition-all",
                      errors.name && "border-destructive/50 bg-destructive/5"
                    )}
                  />
                </div>
                {errors.name && <p className="text-[10px] font-bold text-destructive px-1 uppercase tracking-wider">{errors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -tranzinc-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur('email')}
                    className={cn(
                      "h-12 pl-11 bg-muted/20 border-border/40 rounded-2xl focus-visible:ring-primary/20 transition-all",
                      errors.email && "border-destructive/50 bg-destructive/5"
                    )}
                  />
                </div>
                {errors.email && <p className="text-[10px] font-bold text-destructive px-1 uppercase tracking-wider">{errors.email}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Subject</Label>
              <div className="relative group">
                <MessageSquare className="absolute left-3.5 top-1/2 -tranzinc-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                <Input
                  id="subject"
                  name="subject"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={handleChange}
                  onBlur={handleBlur('subject')}
                  className={cn(
                    "h-12 pl-11 bg-muted/20 border-border/40 rounded-2xl focus-visible:ring-primary/20 transition-all",
                    errors.subject && "border-destructive/50 bg-destructive/5"
                  )}
                />
              </div>
              {errors.subject && <p className="text-[10px] font-bold text-destructive px-1 uppercase tracking-wider">{errors.subject}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell us more about your indexing needs..."
                rows={5}
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur('message')}
                className={cn(
                  "bg-muted/20 border-border/40 rounded-[24px] focus-visible:ring-primary/20 transition-all resize-none p-4",
                  errors.message && "border-destructive/50 bg-destructive/5"
                )}
              />
              {errors.message && <p className="text-[10px] font-bold text-destructive px-1 uppercase tracking-wider">{errors.message}</p>}
            </div>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 rounded-2xl bg-foreground text-background font-black tracking-tight text-lg hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-black/10 transition-all group"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Send Message <Send className="h-4 w-4 group-hover:tranzinc-x-1 group-hover:-tranzinc-y-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}