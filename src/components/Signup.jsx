import React, { useState } from 'react'
import { Input } from '../scomp/ui/input'
import { Button } from '../scomp/ui/button'
import { Loader2, UserPlus } from "lucide-react"
import { Checkbox } from '../scomp/ui/checkbox'
import axios from 'axios'
import { useToast } from '../scomp/ui/use-toast'
import { ToastAction } from '../scomp/ui/toast'
import ENV from '../env'
export default function Signup({ setSelectedTab, ...props }) {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [mobile, setMobile] = useState("")
    const [check, setCheck] = useState(false)
    const [load, setLoad] = useState(false)
    const { toast } = useToast()


    const clearAll = () => {
        setName("")
        setPassword("")
        setConfirmPassword("")
        setEmail("")
        setMobile("")
        setCheck(false)
        setSelectedTab("login")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoad(true)
        if (password !== confirmPassword) {
            setLoad(false)

            throw toast({
                variant: "destructive",
                title: "Password and confirm password didn't match",
                action: <ToastAction altText="Try again">Try again</ToastAction>,

            })
        }

        if (!check) {
            setLoad(false)

            throw toast({
                variant: "destructive",
                title: "Kindly accept terms and conditions",
                action: <ToastAction altText="Try again">Try again</ToastAction>,

            })
        }

        try {

            const URL = ENV.baseUrl + "/signin"
            const data = {
                name, email, password, confirmPassword, mobile
            }
            const res = await axios.post(URL, data)
            const d = await res.data
            toast({
                title: "User created Successfully",
                description: "Now Login to enter",
            })
            clearAll()

        } catch (error) {
            const msg = (">>>>>", error)
            if (error?.resposne?.status) {
                throw toast({
                    variant: "destructive",
                    title: msg,
                    action: <ToastAction altText="Try again">Try again</ToastAction>,

                })
            } else {
                throw toast({
                    variant: "destructive",
                    title: "Some thing went wrong",
                    action: <ToastAction altText="Try again">Try again</ToastAction>,

                })
            }

        } finally {
            setLoad(false)
        }




    }


    return (
        <form onSubmit={handleSubmit} className='w-[300px]  flex flex-col p-3 justify-center  rounded-lg'  >
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <div className='h-3' />
            <Input required value={email} onChange={(e) => setEmail(e.target.value)} type={"email"} placeholder="Email" />
            <div className='h-3' />
            <Input required value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile Number" type={"tel"} maxlength={10} />
            <div className='h-3' />
            <Input required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
            <div className='h-3' />
            <Input required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-Password" type="password" />

            <div className='h-3' />
            <div className="flex items-center space-x-2">
                <Checkbox onCheckedChange={(e) => setCheck(e)} id="terms2" disabled={false} />
                <label
                    htmlFor="terms2"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Accept terms and conditions
                </label>
            </div>
            <div className='h-3' />

            <Button type="submit" variant="" >{load ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}Sign Up</Button>


        </form>
    )
}
