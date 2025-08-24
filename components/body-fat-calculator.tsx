"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"
import { useUnits } from "./unit-context"

interface BodyFatResult {
  bodyFatPercentage: number
  category: string
  description: string
}

export function BodyFatCalculator() {
  const { heightUnit, convertHeight } = useUnits()
  const [gender, setGender] = useState<string>("")
  const [height, setHeight] = useState<string>("")
  const [waist, setWaist] = useState<string>("")
  const [neck, setNeck] = useState<string>("")
  const [hip, setHip] = useState<string>("")
  const [result, setResult] = useState<BodyFatResult | null>(null)

  const bodyFatCategories = {
    male: {
      essential: {
        min: 2,
        max: 5,
        label: "Essential Fat",
        description: "Minimum fat needed for basic physical and physiological health",
      },
      athletes: { min: 6, max: 13, label: "Athletes", description: "Typical range for male athletes" },
      fitness: { min: 14, max: 17, label: "Fitness", description: "Fit, non-athlete individuals" },
      average: { min: 18, max: 24, label: "Average", description: "Acceptable range for average men" },
      obese: { min: 25, max: 100, label: "Obese", description: "Above average, may indicate health risks" },
    },
    female: {
      essential: {
        min: 10,
        max: 13,
        label: "Essential Fat",
        description: "Minimum fat needed for basic physical and physiological health",
      },
      athletes: { min: 14, max: 20, label: "Athletes", description: "Typical range for female athletes" },
      fitness: { min: 21, max: 24, label: "Fitness", description: "Fit, non-athlete individuals" },
      average: { min: 25, max: 31, label: "Average", description: "Acceptable range for average women" },
      obese: { min: 32, max: 100, label: "Obese", description: "Above average, may indicate health risks" },
    },
  }

  const calculateBodyFat = () => {
    const h = Number.parseFloat(height)
    const w = Number.parseFloat(waist)
    const n = Number.parseFloat(neck)
    const hp = Number.parseFloat(hip)

    if (!h || !w || !n || !gender) return
    if (gender === "female" && !hp) return

    const heightInCm = convertHeight(h, heightUnit, "cm")
    const waistInCm = convertHeight(w, heightUnit, "cm")
    const neckInCm = convertHeight(n, heightUnit, "cm")
    const hipInCm = gender === "female" ? convertHeight(hp, heightUnit, "cm") : 0

    let bodyFatPercentage: number

    if (gender === "male") {
      bodyFatPercentage = 86.01 * Math.log10(waistInCm - neckInCm) - 70.041 * Math.log10(heightInCm) + 36.76
    } else {
      bodyFatPercentage =
        163.205 * Math.log10(waistInCm + hipInCm - neckInCm) - 97.684 * Math.log10(heightInCm) - 78.387
    }

    bodyFatPercentage = Math.max(0, Math.min(100, bodyFatPercentage))

    const categories = bodyFatCategories[gender as keyof typeof bodyFatCategories]
    let category = "Unknown"
    let description = ""

    for (const [key, range] of Object.entries(categories)) {
      if (bodyFatPercentage >= range.min && bodyFatPercentage <= range.max) {
        category = range.label
        description = range.description
        break
      }
    }

    setResult({
      bodyFatPercentage: Math.round(bodyFatPercentage * 10) / 10,
      category,
      description,
    })
  }

  useEffect(() => {
    if (gender === "male" && height && waist && neck) {
      calculateBodyFat()
    } else if (gender === "female" && height && waist && neck && hip) {
      calculateBodyFat()
    }
  }, [gender, height, waist, neck, hip])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Essential Fat":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Athletes":
        return "bg-green-100 text-green-800 border-green-200"
      case "Fitness":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "Average":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "Obese":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
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

        <div className="space-y-2">
          <Label htmlFor="waist">Waist Circumference ({heightUnit})</Label>
          <Input
            id="waist"
            type="number"
            placeholder={heightUnit === "cm" ? "80" : "31"}
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            min={heightUnit === "cm" ? "30" : "12"}
            max={heightUnit === "cm" ? "200" : "79"}
            step="0.1"
          />
          <p className="text-xs text-muted-foreground">Measure at the narrowest point</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="neck">Neck Circumference ({heightUnit})</Label>
          <Input
            id="neck"
            type="number"
            placeholder={heightUnit === "cm" ? "35" : "14"}
            value={neck}
            onChange={(e) => setNeck(e.target.value)}
            min={heightUnit === "cm" ? "20" : "8"}
            max={heightUnit === "cm" ? "60" : "24"}
            step="0.1"
          />
          <p className="text-xs text-muted-foreground">Measure just below the larynx</p>
        </div>

        {gender === "female" && (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="hip">Hip Circumference ({heightUnit})</Label>
            <Input
              id="hip"
              type="number"
              placeholder={heightUnit === "cm" ? "95" : "37"}
              value={hip}
              onChange={(e) => setHip(e.target.value)}
              min={heightUnit === "cm" ? "50" : "20"}
              max={heightUnit === "cm" ? "200" : "79"}
              step="0.1"
            />
            <p className="text-xs text-muted-foreground">Measure at the widest point of the hips</p>
          </div>
        )}
      </div>

      {result && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Activity className="w-5 h-5" />
              Your Body Fat Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 bg-primary/10 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">{result.bodyFatPercentage}%</div>
              <Badge className={getCategoryColor(result.category)}>{result.category}</Badge>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>{result.description}</p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Important Notes:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• This calculation uses the U.S. Navy method</li>
                <li>• Results are estimates and may vary from other methods</li>
                <li>• For accurate measurements, consult a healthcare professional</li>
                <li>• Body fat percentage naturally varies with age and genetics</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Body Fat Categories</CardTitle>
          <CardDescription>Reference ranges for {gender || "men and women"}</CardDescription>
        </CardHeader>
        <CardContent>
          {gender && (
            <div className="space-y-3">
              {Object.entries(bodyFatCategories[gender as keyof typeof bodyFatCategories]).map(([key, range]) => (
                <div key={key} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{range.label}</span>
                    <p className="text-xs text-muted-foreground">{range.description}</p>
                  </div>
                  <Badge variant="outline">
                    {range.min}% - {range.max === 100 ? "∞" : `${range.max}%`}
                  </Badge>
                </div>
              ))}
            </div>
          )}
          {!gender && <p className="text-muted-foreground text-center">Select gender to see category ranges</p>}
        </CardContent>
      </Card>
    </div>
  )
}
