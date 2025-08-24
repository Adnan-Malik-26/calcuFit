"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Target } from "lucide-react"
import { useUnits } from "./unit-context"

interface IdealWeightResult {
  devine: number
  robinson: number
  miller: number
  hamwi: number
  average: number
  range: { min: number; max: number }
}

export function IdealWeightCalculator() {
  const [height, setHeight] = useState<string>("")
  const [gender, setGender] = useState<string>("")
  const [result, setResult] = useState<IdealWeightResult | null>(null)
  const { weightUnit, heightUnit, convertWeight, convertHeight } = useUnits()

  const calculateIdealWeight = () => {
    const h = Number.parseFloat(height)

    if (!h || !gender) return

    // Convert height to cm for calculation
    const heightCm = heightUnit === "inches" ? convertHeight(h, "inches", "cm") : h
    const heightInches = heightCm / 2.54 // Convert cm to inches
    const heightOverFive = heightInches - 60 // Height over 5 feet in inches

    let devine: number, robinson: number, miller: number, hamwi: number

    if (gender === "male") {
      // Male formulas (results in kg)
      devine = 50 + 2.3 * heightOverFive
      robinson = 52 + 1.9 * heightOverFive
      miller = 56.2 + 1.41 * heightOverFive
      hamwi = 48 + 2.7 * heightOverFive
    } else {
      // Female formulas (results in kg)
      devine = 45.5 + 2.3 * heightOverFive
      robinson = 49 + 1.7 * heightOverFive
      miller = 53.1 + 1.36 * heightOverFive
      hamwi = 45.5 + 2.2 * heightOverFive
    }

    // Ensure minimum weights
    devine = Math.max(devine, gender === "male" ? 50 : 45.5)
    robinson = Math.max(robinson, gender === "male" ? 52 : 49)
    miller = Math.max(miller, gender === "male" ? 56.2 : 53.1)
    hamwi = Math.max(hamwi, gender === "male" ? 48 : 45.5)

    // Convert to user's preferred weight unit
    if (weightUnit === "lbs") {
      devine = convertWeight(devine, "kg", "lbs")
      robinson = convertWeight(robinson, "kg", "lbs")
      miller = convertWeight(miller, "kg", "lbs")
      hamwi = convertWeight(hamwi, "kg", "lbs")
    }

    const average = (devine + robinson + miller + hamwi) / 4
    const weights = [devine, robinson, miller, hamwi]
    const range = {
      min: Math.min(...weights) - (weightUnit === "lbs" ? 11 : 5),
      max: Math.max(...weights) + (weightUnit === "lbs" ? 11 : 5),
    }

    setResult({
      devine: Math.round(devine * 10) / 10,
      robinson: Math.round(robinson * 10) / 10,
      miller: Math.round(miller * 10) / 10,
      hamwi: Math.round(hamwi * 10) / 10,
      average: Math.round(average * 10) / 10,
      range: {
        min: Math.round(range.min * 10) / 10,
        max: Math.round(range.max * 10) / 10,
      },
    })
  }

  // Auto-calculate when all fields are filled
  useEffect(() => {
    if (height && gender) {
      calculateIdealWeight()
    }
  }, [height, gender, weightUnit, heightUnit])

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">Height ({heightUnit})</Label>
          <Input
            id="height"
            type="number"
            placeholder={heightUnit === "cm" ? "170" : "67"}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            min="100"
            max="250"
          />
        </div>

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
      </div>

      {/* Results */}
      {result && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Target className="w-5 h-5" />
              Your Ideal Weight Range
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 bg-primary/10 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">
                {result.average} {weightUnit}
              </div>
              <div className="text-sm text-muted-foreground mb-2">Average ideal weight</div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Range: {result.range.min} - {result.range.max} {weightUnit}
              </Badge>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Ideal Weight by Formula:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm">Devine Formula</span>
                  <span className="font-semibold">
                    {result.devine} {weightUnit}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm">Robinson Formula</span>
                  <span className="font-semibold">
                    {result.robinson} {weightUnit}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm">Miller Formula</span>
                  <span className="font-semibold">
                    {result.miller} {weightUnit}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm">Hamwi Formula</span>
                  <span className="font-semibold">
                    {result.hamwi} {weightUnit}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Important Notes:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• These are estimates based on height and gender only</li>
                <li>• Individual factors like muscle mass and bone density matter</li>
                <li>• Consult healthcare professionals for personalized advice</li>
                <li>• Focus on overall health rather than just weight numbers</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formula Information */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">About the Formulas</CardTitle>
          <CardDescription>Different methods for calculating ideal weight</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Devine Formula:</span> Most commonly used in medical settings
            </div>
            <div>
              <span className="font-medium">Robinson Formula:</span> Modification of Devine formula
            </div>
            <div>
              <span className="font-medium">Miller Formula:</span> Based on large population studies
            </div>
            <div>
              <span className="font-medium">Hamwi Formula:</span> Used for quick clinical estimates
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
