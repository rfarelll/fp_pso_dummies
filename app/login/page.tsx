'use client'

import * as React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { auth } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirect ke dashboard
            window.location.href = "/home";
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert(err.message);
            } else {
                alert("Login failed!");
            }
        }
        setLoading(false);
    };

    return (
        <section className="min-h-screen bg-[linear-gradient(135deg,_#4484B7_0%,_#6FACDD_80%)] flex items-center justify-center">
            <Card className="w-full max-w-md bg-white/80 shadow-2xl rounded-2xl p-6">
                <CardHeader className="flex flex-col items-center">
                    {/* Optional: Logo or App Name */}
                    <Image src="/images/DooIT.png" alt="Logo" width={120} height={60} className="m-[-5px]" />
                    <CardTitle className="text-2xl font-bold text-blue-900">Sign In to DooIT</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
                        <Button
                            className="bg-[#295B82] text-white w-full rounded-full py-2 font-bold mt-3"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Login"}
                        </Button>
                    </form>
                    {/* Optional: Link to Register */}
                    <div className="text-center text-sm mt-4 text-blue-900">
                        Don&apos;t have an account?{" "}
                        <a href="/register" className="font-bold underline hover:text-blue-700">
                            Register
                        </a>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
