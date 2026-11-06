import { z } from "zod";

const phoneRegex = /^[+0-9 ()-]{8,20}$/;

export const cartItemSchema = z.object({
  productId: z.string().min(1).max(50),
  quantity: z.number().int().min(1).max(100),
});

export const orderSchema = z.object({
  customerName: z.string().trim().min(2, "Indiquez votre nom").max(100),
  phone: z.string().trim().regex(phoneRegex, "Numéro de téléphone invalide"),
  email: z.string().trim().email("E-mail invalide").max(255).optional().or(z.literal("")),
  commune: z.string().trim().min(2, "Choisissez votre commune").max(60),
  address: z.string().trim().min(5, "Précisez l'adresse de livraison").max(300),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  items: z.array(cartItemSchema).min(1, "Votre panier est vide").max(30),
});

export type OrderInput = z.infer<typeof orderSchema>;

export const contactSchema = z.object({
  requestType: z.enum(["contact", "devis"]),
  name: z.string().trim().min(2, "Indiquez votre nom").max(100),
  phone: z.string().trim().regex(phoneRegex, "Numéro de téléphone invalide"),
  email: z.string().trim().email("E-mail invalide").max(255).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  quantity: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Votre message est trop court").max(1500),
});

export type ContactInput = z.infer<typeof contactSchema>;
