"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { email, z } from "zod";

const signInSchema = z.object({
  email: z.string().email("Invalid Email Address"),
  password: z.string().min(8, "Invalid Password"),
});

const signUpSchema = z.object({
  firstName: z.string().min(1, "required"),
  lastName: z.string().min(1, "required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password length must be 8 characters"),
});

type signInData = z.infer<typeof signInSchema>;
type signUpData = z.infer<typeof signUpSchema>;

export const useAuth = () => {
  const { signIn, signOut } = useAuthActions();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const signInForm = useForm<signInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<signUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (data: signInData) => {
    setIsLoading(true);
    try {
      await signIn("password", {
        email: data.email,
        password: data.password,
        flow: "signIn",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign-in failed:", error);
      signInForm.setError("password", { type: "manual", message: "Invalid email or password" });
    } finally {
        setIsLoading(false);
    }
  };

  const handleSignUp = async (data: signUpData) => {
    setIsLoading(true);
    try {
        await signIn("password", {
            email: data.email,
            password: data.password,
            name: `${data.firstName} ${data.lastName}`,
            flow: "signUp",
        });
        router.push("/dashboard");
    } catch (error) {
        console.error("Sign-up failed:", error);
        signUpForm.setError("root", { type: "manual", message: "Email already in use" });
    } finally {
        setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
        await signOut();
        router.push("/auth/sign-in");

    } catch (error) {
        console.error("Sign-out failed:", error);
    }
  };

  return {
    signInForm,
    signUpForm,
    handleSignIn,
    handleSignUp,
    handleSignOut,
    isLoading,
  };
};
