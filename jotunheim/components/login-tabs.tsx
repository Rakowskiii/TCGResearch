"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

import { backendServer } from "@/lib/constants"

const LoginTabs = () => {
    const { toast } = useToast();

    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [registerData, setRegisterData] = useState({ login: '', password: '', confirmPassword: '' });

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.id]: e.target.value });
    };

    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.id]: e.target.value });
    };

    const login = async () => {
        fetch(`${backendServer}/login`, {
            method: 'POST',
            body: JSON.stringify(loginData),
        }).then((res) => res.json()).then((data) => { console.log(data) })
            .catch((err) => {
                toast({
                    variant: 'destructive',
                    title: 'Login failure',
                    description: err.toString()
                })
            });


    }

    const register = () => {
        toast({
            title: 'Register',
            description: `Login: ${registerData.login}, Password: ${registerData.password}, Confirm Password: ${registerData.confirmPassword}`,
        })
    }

    return (
        <Tabs defaultValue="login" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle >Login</CardTitle>
                        <CardDescription>
                            Log in to your account to continue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="usernane">Username</Label>
                            <Input id="username" placeholder="myaccount" onChange={handleLoginChange} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password">password</Label>
                            <Input id="password" placeholder="**********" type="password" onChange={handleLoginChange} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={login}>Log In</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="register">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle>Register</CardTitle>
                        <CardDescription>
                            Register your account here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="login">Login</Label>
                            <Input id="login" type="text" onChange={handleRegisterChange} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password">password</Label>
                            <Input id="password" type="password" onChange={handleRegisterChange} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="confirmPassword">Confirm password</Label>
                            <Input id="confirmPassword" type="password" onChange={handleRegisterChange} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={register}>Register</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
            <Toaster />
        </Tabs>
    )
}


export default LoginTabs