"use client"

import { useState } from "react"
import { Mail, MapPin, Phone, Send } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type FormState = "idle" | "loading" | "success"

export function ContactFormSection() {
  const [formState, setFormState] = useState<FormState>("idle")
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
      setFormState("idle")
      setName("")
      setEmail("")
      setPhone("")
      setMessage("")
    }, 3300)
  }

  return (
    <Card className="p-6 shadow-lg">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">Gửi phản hồi đến <span className="text-primary">HopeStar</span></h2>
        <p className="text-muted-foreground mt-2">Chúng tôi sẽ cố gắng trả lời đến bạn sớm nhất</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!name || !email || !phone || !message) return
          submit()
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-1"
            >
              Tên của bạn
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-background"
                placeholder="Họ và tên"
                required
              />
              <div className="absolute left-3 top-2.5 text-muted-foreground">
                <Mail size={16} />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
            >
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-background"
                placeholder="example@email.com"
                required
              />
              <div className="absolute left-3 top-2.5 text-muted-foreground">
                <Mail size={16} />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Số điện thoại
          </label>
          <div className="relative">
            <input 
              type="text" 
              id="phone" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-background"
              placeholder="0123456789"
              required
            />
            <div className="absolute left-3 top-2.5 text-muted-foreground">
              <Phone size={16} />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium mb-1"
          >
            Nội dung
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-background"
            rows={4}
            placeholder="Nhập nội dung tin nhắn của bạn..."
            required
          />
        </div>

        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2"
            disabled={formState === "loading"}
          >
            {formState === "loading" ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Send size={16} />
            )}
            {formState === "loading" ? "Đang gửi..." : "Gửi phản hồi"}
          </Button>
        </div>
      </form>

      {formState === "success" && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md text-center">
          <h4 className="font-bold">Gửi phản hồi thành công!</h4>
          <p>Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
        </div>
      )}
    </Card>
  )
}

export function ContactInfo() {
  return (
    <Card className="p-6 shadow-lg h-full">
      <h3 className="text-xl font-semibold mb-4">Thông tin liên hệ</h3>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium">Địa chỉ</h4>
            <p className="text-muted-foreground">Hòe Thị, Phương Canh, Nam Từ Liêm, Hà Nội, Việt Nam</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium">Điện thoại</h4>
            <p className="text-muted-foreground">+84 358 168 699</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium">Email</h4>
            <p className="text-muted-foreground">contact@hopestar.com</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Giờ làm việc</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Thứ Hai - Thứ Sáu:</span>
            <span>8:00 - 17:00</span>
          </div>
          <div className="flex justify-between">
            <span>Thứ Bảy:</span>
            <span>8:00 - 12:00</span>
          </div>
          <div className="flex justify-between">
            <span>Chủ Nhật:</span>
            <span>Đóng cửa</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export function GoogleMap() {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d783.0690069252823!2d105.74443546952945!3d21.03987039878826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134548d53109a5f%3A0x659c15d527f2ecf!2zTmcuIDEyNCBQaOG7kSBIb8OoIFRo4buLLCBIw7JlIFRo4buLLCBQaMawxqFuZyBDYW5oLCBOYW0gVOG7qyBMacOqbSwgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e1!3m2!1svi!2s!4v1745061578294!5m2!1svi!2s"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded-lg"
        title="FPT Polytechnic map"
      />
    </div>
  )
}

export function LienHe() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Liên Hệ Với Chúng Tôi</h1>
        <p className="text-muted-foreground max-w-6xl mx-auto">
          Hãy để lại thông tin và chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất. Cảm ơn bạn đã quan tâm đến dịch vụ của HopeStar.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <GoogleMap />
        <div className="grid grid-cols-1 gap-8">
          <ContactInfo />
        </div>
      </div>
      
      <div className="mt-10">
        <ContactFormSection />
      </div>
    </div>
  )
}

export function PopoverFormExamples() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Liên Hệ Với Chúng Tôi</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Hãy để lại thông tin và chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất. 
          Cảm ơn bạn đã quan tâm đến dịch vụ của HopeStar.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <GoogleMap />
        <div className="grid grid-cols-1 gap-8">
          <ContactInfo />
        </div>
      </div>
      
      <div className="mt-10">
        <ContactFormSection />
      </div>
    </div>
  )
}
