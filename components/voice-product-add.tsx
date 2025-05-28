"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, MicOff, Volume2, Plus } from "lucide-react"

interface VoiceProductAddProps {
  onProductAdd: (product: { name: string; quantity: number; price: number }) => void
}

export default function VoiceProductAdd({ onProductAdd }: VoiceProductAddProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedProduct, setExtractedProduct] = useState<{
    name: string
    quantity: number
    price: number
  } | null>(null)

  const recognition = useRef<any>(null)

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Tarayıcınız ses tanıma özelliğini desteklemiyor")
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    recognition.current = new SpeechRecognition()

    recognition.current.continuous = true
    recognition.current.interimResults = true
    recognition.current.lang = "tr-TR"

    recognition.current.onstart = () => {
      setIsListening(true)
      setTranscript("")
    }

    recognition.current.onresult = (event: any) => {
      let finalTranscript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript)
        processVoiceCommand(finalTranscript)
      }
    }

    recognition.current.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      setIsListening(false)
    }

    recognition.current.onend = () => {
      setIsListening(false)
    }

    recognition.current.start()
  }

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop()
    }
    setIsListening(false)
  }

  const processVoiceCommand = async (text: string) => {
    setIsProcessing(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simple pattern matching for Turkish
    const patterns = [
      /(\d+)\s*adet\s*(.+?)\s*(\d+)\s*lira/i,
      /(.+?)\s*(\d+)\s*adet\s*(\d+)\s*lira/i,
      /(.+?)\s*(\d+)\s*tane\s*(\d+)\s*tl/i,
    ]

    let extracted = null

    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        if (pattern.source.includes("adet.*lira")) {
          extracted = {
            name: match[2].trim(),
            quantity: Number.parseInt(match[1]),
            price: Number.parseInt(match[3]),
          }
        } else {
          extracted = {
            name: match[1].trim(),
            quantity: Number.parseInt(match[2]),
            price: Number.parseInt(match[3]),
          }
        }
        break
      }
    }

    // Fallback extraction
    if (!extracted) {
      const words = text.toLowerCase().split(" ")
      const quantities = words.filter((w) => /^\d+$/.test(w)).map(Number)
      const productWords = words.filter((w) => !/^\d+$/.test(w) && !["adet", "tane", "lira", "tl"].includes(w))

      if (quantities.length >= 2 && productWords.length > 0) {
        extracted = {
          name: productWords.join(" "),
          quantity: quantities[0],
          price: quantities[1],
        }
      }
    }

    setExtractedProduct(extracted)
    setIsProcessing(false)
  }

  const addProduct = () => {
    if (extractedProduct) {
      onProductAdd(extractedProduct)
      setExtractedProduct(null)
      setTranscript("")
    }
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "tr-TR"
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mic className="h-5 w-5 mr-2" />
          Sesli Ürün Ekleme
        </CardTitle>
        <CardDescription>
          Sesli komutla ürün ekleyin. Örnek: "2 adet iPhone 45000 lira" veya "MacBook 1 tane 55000 TL"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? "destructive" : "default"}
            className="flex-1"
          >
            {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
            {isListening ? "Dinlemeyi Durdur" : "Dinlemeye Başla"}
          </Button>
          <Button
            variant="outline"
            onClick={() => speakText("Ürün adı, miktar ve fiyat söyleyin")}
            disabled={isListening}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>

        {isListening && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="animate-pulse bg-red-500 rounded-full h-3 w-3 mr-2"></div>
              <span className="text-red-700 font-medium">Dinleniyor...</span>
            </div>
          </div>
        )}

        {transcript && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Algılanan:</strong> {transcript}
            </p>
          </div>
        )}

        {isProcessing && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700">Ses komutu işleniyor...</p>
          </div>
        )}

        {extractedProduct && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
            <h4 className="font-medium text-green-800">Çıkarılan Ürün Bilgisi:</h4>
            <div className="space-y-1">
              <p className="text-sm">
                <strong>Ürün:</strong> {extractedProduct.name}
              </p>
              <p className="text-sm">
                <strong>Miktar:</strong> {extractedProduct.quantity} adet
              </p>
              <p className="text-sm">
                <strong>Fiyat:</strong> ₺{extractedProduct.price.toLocaleString()}
              </p>
            </div>
            <div className="flex space-x-2 mt-3">
              <Button onClick={addProduct} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Ürünü Ekle
              </Button>
              <Button variant="outline" size="sm" onClick={() => setExtractedProduct(null)}>
                İptal
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>Örnek komutlar:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>"2 adet iPhone 45000 lira"</li>
            <li>"MacBook 1 tane 55000 TL"</li>
            <li>"Samsung telefon 3 adet 25000 lira"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
