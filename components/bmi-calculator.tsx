"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scale } from "lucide-react"
import { useUnits } from "./unit-context"

interface BMIResult {
  bmi: number
  category: string
  description: string
}

export function BMICalculator() {
  const { weightUnit, heightUnit, convertWeight, convertHeight } = useUnits()
  const [weight, setWeight] = useState<string>("")
  const [height, setHeight] = useState<string>("")
  const [result, setResult] = useState<BMIResult | null>(null)

  const bmiCategories = {
    underweight: { min: 0, max: 18.4, label: "Underweight", description: "Below normal weight" },
    normal: { min: 18.5, max: 24.9, label: "Normal Weight", description: "Healthy weight range" },
    overweight: { min: 25, max: 29.9, label: "Overweight", description: "Above normal weight" },
    obese: { min: 30, max: 100, label: "Obese", description: "Significantly above normal weight" },
  }

  const calculateBMI = () => {
    const w = Number.parseFloat(weight)
    const h = Number.parseFloat(height)

    if (!w || !h) return

    const weightInKg = convertWeight(w, weightUnit, "kg")
    const heightInCm = convertHeight(h, heightUnit, "cm")
    const heightInM = heightInCm / 100 // Convert cm to meters

    const bmi = weightInKg / (heightInM * heightInM)

    // Determine category
    let category = "Unknown"
    let description = ""

    for (const [key, range] of Object.entries(bmiCategories)) {
      if (bmi >= range.min && bmi <= range.max) {
        category = range.label
        description = range.description
        break
      }
    }

    setResult({
      bmi: Math.round(bmi * 10) / 10,
      category,
      description,
    })
  }

  // Auto-calculate when both fields are filled
  useEffect(() => {
    if (weight && height) {
      calculateBMI()
    }
  }, [weight, height])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Underweight":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Normal Weight":
        return "bg-green-100 text-green-800 border-green-200"
      case "Overweight":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "Obese":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Weight ({weightUnit})</Label>
          <Input
            id="weight"
            type="number"
            placeholder={weightUnit === "kg" ? "70" : "154"}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            min="1"
            max={weightUnit === "kg" ? "500" : "1100"}
            step="0.1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Height ({heightUnit})</Label>
          <Input
            id="height"
            type="number"
            placeholder={heightUnit === "cm" ? "170" : "67"}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            min={heightUnit === "cm" ? "50" : "20"}
            max={heightUnit === "cm" ? "250" : "98"}
            step={heightUnit === "cm" ? "1" : "0.1"}
          />
        </div>
      </div>

      {/* Results */}
      {result && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Scale className="w-5 h-5" />
              Your BMI Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 bg-primary/10 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">{result.bmi}</div>
              <Badge className={getCategoryColor(result.category)}>{result.category}</Badge>
            </div>

            <div className="text-sm text-muted-foreground text-center">
              <p>{result.description}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* BMI Categories Reference */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">BMI Categories</CardTitle>
          <CardDescription>Reference ranges for adults</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(bmiCategories).map(([key, range]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="font-medium">{range.label}</span>
                <Badge variant="outline">
                  {range.min} - {range.max === 100 ? "∞" : range.max}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
