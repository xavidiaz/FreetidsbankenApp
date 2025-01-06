import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { GalleryVerticalEnd } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


// ✅ Define validation schema
const signUpSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email format" }),
});

const SignUpPage = () => {
    const register = useAuthStore((state) => state.register);
    const navigate = useNavigate();
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: { name: "", email: "" },
    });

    // ✅ Sign-up handler
    const handleSignUp = (values) => {
        console.log("📝 Attempting registration with:", values);
        const { name, email } = values;

        const result = register({ name, email });

        console.log("🔄 Register result:", result);

        if (result.success) {
            toast({
                title: "🎉 Registration Successful",
                description: `Welcome, ${name}! Your account has been created.`,
                duration: 5000, // 5 seconds
            });

            // ✅ Navigate to user profile
            navigate(`/users/${result.user.user_id}`);
        } else {
            toast({
                title: "⚠️ Registration Failed",
                description: result.message,
                variant: "destructive", // 🔴 Red styling for errors
                duration: 5000,
            });
        }
    };


    return (
        <div className="flex min-w-fit min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSignUp)} className="flex flex-col gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md">
                                <GalleryVerticalEnd className="size-6" />
                            </div>
                            <h1 className="text-xl font-bold">Create an Account</h1>
                        </div>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Name</Label>
                                    <FormControl>
                                        <Input type="text" placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Email</Label>
                                    <FormControl>
                                        <Input type="email" placeholder="john@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="text-primary">
                            <Button type="submit" className="w-full">
                                Sign Up
                            </Button>
                        </div>
                    </form>
                </Form>

                {/* 🔹 Divider */}
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        Or
                    </span>
                </div>

                {/* 🔹 Already have an account? */}
                <div className="text-center mt-4">
                    <span className="text-muted-foreground">Already have an account?</span>
                    <Button variant="link" onClick={() => navigate("/login")}>
                        Log in
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
