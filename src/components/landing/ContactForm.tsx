"use client";

import React, { useState } from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

type FormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateField = (name: keyof FormData, value: string) => {
    try {
      contactSchema.shape[name].parse(value);
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (error: unknown) {
      const message =
        error instanceof z.ZodError
          ? error.issues[0].message
          : "Invalid field";
      setErrors((prev) => ({ ...prev, [name]: message }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      contactSchema.parse(formData);
      setErrors({});
      setIsSubmitting(true);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<FormData> = {};
        error.issues.forEach((issue) => {
          fieldErrors[issue.path[0] as keyof FormData] = issue.message;
        });
        setErrors(fieldErrors);
      }
      setSubmitError("Please correct the highlighted errors before submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur =
    (field: keyof FormData) =>
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      validateField(field, e.target.value);
    };

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-foreground">
          Contact us
        </h2>
        <p className="text-sm text-muted-foreground">
          Have a question? We're here to help.
        </p>
      </div>

      {submitSuccess && (
        <div className="rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground">
          Message sent. We'll get back to you soon.
        </div>
      )}

      {submitError && (
        <div className="rounded-md border border-border bg-card px-4 py-3 text-sm text-destructive">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm text-foreground">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Jane Doe"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur("name")}
              className={cn(
                "h-10 bg-card border-border",
                errors.name && "border-destructive"
              )}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm text-foreground">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jane@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur("email")}
              className={cn(
                "h-10 bg-card border-border",
                errors.email && "border-destructive"
              )}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="subject" className="text-sm text-foreground">
            Subject
          </Label>
          <Input
            id="subject"
            name="subject"
            placeholder="How can we help?"
            value={formData.subject}
            onChange={handleChange}
            onBlur={handleBlur("subject")}
            className={cn(
              "h-10 bg-card border-border",
              errors.subject && "border-destructive"
            )}
          />
          {errors.subject && (
            <p className="text-xs text-destructive">{errors.subject}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="message" className="text-sm text-foreground">
            Message
          </Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Tell us more..."
            rows={5}
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur("message")}
            className={cn(
              "resize-none bg-card border-border",
              errors.message && "border-destructive"
            )}
          />
          {errors.message && (
            <p className="text-xs text-destructive">{errors.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10"
        >
          {isSubmitting ? "Sending..." : "Send message"}
        </Button>
      </form>
    </div>
  );
}
