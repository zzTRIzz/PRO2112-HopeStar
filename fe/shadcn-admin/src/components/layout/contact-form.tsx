"use client"

import { useEffect, useState } from "react"
import { Mail, Monitor, Moon, Sun } from "lucide-react"

import {
  PopoverForm,
  PopoverFormButton,
  PopoverFormCutOutLeftIcon,
  PopoverFormCutOutRightIcon,
  PopoverFormSeparator,
  PopoverFormSuccess,
} from "@/components/ui/popover-form"

type FormState = "idle" | "loading" | "success"

export function ContactFormExample() {
  const [formState, setFormState] = useState<FormState>("idle")
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")

  function submit() {
    setFormState("loading")
    setTimeout(() => {
      setFormState("success")
    }, 1500)

    setTimeout(() => {
      setOpen(false)
      setFormState("idle")
      setName("")
      setEmail("")
      setMessage("")
    }, 3300)
  }

  return (
    <div className="flex  w-full items-center justify-center">
      <PopoverForm
        title="Liên hệ chúng tôi"
        open={open}
        setOpen={setOpen}
        width="364px"
        height="472px"
        showCloseButton={formState !== "success"}
        showSuccess={formState === "success"}
        openChild={
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!name || !email || !phone || !message) return
              submit()
            }}
            className=" space-y-4"
          >
            <div className="px-4 pt-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Tên của bạn
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border  rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-black"
              />
            </div>
            <div className="px-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border  rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-black"
                
              />
            </div>
            <div className="px-4">
              <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground mb-1">
                Số điện thoại
              </label>
              <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="
                w-full px-3 py-2 border  rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-black
              "/>
            </div>
            <div className="px-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Nội dung
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-black"
                rows={3}
                
              />
            </div>
            <div className="relative flex h-12 items-center px-[10px]">
              <PopoverFormSeparator />
              <div className="absolute left-0 top-0 -translate-x-[1.5px] -translate-y-1/2">
                <PopoverFormCutOutLeftIcon />
              </div>
              <div className="absolute right-0 top-0 translate-x-[1.5px] -translate-y-1/2 rotate-180">
                <PopoverFormCutOutRightIcon />
              </div>
              <PopoverFormButton
                loading={formState === "loading"}
                text="Submit"
              />
            </div>
          </form>
        }
        successChild={
          <PopoverFormSuccess
            title="Message Sent"
            description="Thank you for contacting us. We'll get back to you soon!"
          />
        }
      />
    </div>
  )
}



export function LienHe() {
  return (
    <div className="space-y-8 grid grid-cols-1 ">
      <ContactFormExample />
    </div>
  )
}
