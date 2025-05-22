'use client'

import * as React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { auth } from "@/lib/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function RegisterPage() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    // Dummy submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Optional: set displayName di profile
            await updateProfile(userCredential.user, { displayName: name });
            // Optionally redirect to login or home
            window.location.href = "/login";
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert(err.message);
            } else {
                alert("Register error!");
            }
        }
        setLoading(false);
    };

    return (
        <section className="min-h-screen bg-[linear-gradient(135deg,_#4484B7_0%,_#6FACDD_80%)] flex items-center justify-center">
            <Card className="w-full max-w-md bg-white/80 shadow-2xl rounded-2xl p-6">
                <CardHeader className="flex flex-col items-center">
                    <Image src="/images/DooIT.png" alt="Logo" width={120} height={60} className="m-[-5px]" />
                    <CardTitle className="text-2xl font-bold text-blue-900">Register to DooIT</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name" className="text-blue-900 font-semibold">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="bg-white"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email" className="text-blue-900 font-semibold">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-white"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password" className="text-blue-900 font-semibold">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-white"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="confirm-password" className="text-blue-900 font-semibold">Confirm Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="bg-white"
                            />
                        </div>
                        <Button
                            className="bg-[#295B82] text-white w-full rounded-full py-2 font-bold mt-3"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Register"}
                        </Button>
                    </form>
                    <div className="text-center text-sm mt-4 text-blue-900">
                        Already have an account?{" "}
                        <a href="/login" className="font-bold underline hover:text-blue-700">
                            Login
                        </a>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
