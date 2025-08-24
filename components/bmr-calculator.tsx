"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Heart } from "lucide-react"
import { useUnits } from "./unit-context"

interface BMRResult {
  mifflinStJeor: number
  harrisBenedict: number
  katchMcArdle?: number
  category: string
  dailyCalories: {
    sedentary: number
    light: number
    moderate: number
    active: number
    veryActive: number
  }
}

export function BMRCalculator() {
  const [age, setAge] = useState<string>("")
  const [gender, setGender] = useState<string>("")
  const [weight, setWeight] = useState<string>("")
  const [height, setHeight] = useState<string>("")
  const [bodyFat, setBodyFat] = useState<string>("")
  const [result, setResult] = useState<BMRResult | null>(null)
  const { weightUnit, heightUnit, convertWeight, convertHeight } = useUnits()

  const calculateBMR = () => {
    const w = Number.parseFloat(weight)
    const h = Number.parseFloat(height)
    const a = Number.parseInt(age)
    const bf = Number.parseFloat(bodyFat)

    if (!w || !h || !a || !gender) return

    // Convert to metric for calculations
    const weightKg = weightUnit === "lbs" ? convertWeight(w, "lbs", "kg") : w
    const heightCm = heightUnit === "inches" ? convertHeight(h, "inches", "cm") : h

    // Mifflin-St Jeor Equation
    let mifflinStJeor: number
    if (gender === "male") {
      mifflinStJeor = 10 * weightKg + 6.25 * heightCm - 5 * a + 5
    } else {
      mifflinStJeor = 10 * weightKg + 6.25 * heightCm - 5 * a - 161
    }

    // Harris-Benedict Equation (Revised)
    let harrisBenedict: number
    if (gender === "male") {
      harrisBenedict = 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * a
    } else {
      harrisBenedict = 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * a
    }

    // Katch-McArdle Equation (requires body fat percentage)
    let katchMcArdle: number | undefined
    if (bf && bf > 0 && bf < 50) {
      const leanBodyMass = weightKg * (1 - bf / 100)
      katchMcArdle = 370 + 21.6 * leanBodyMass
    }

    // Use Mifflin-St Jeor as primary for category and daily calories
    let category = ""
    if (mifflinStJeor < 1200) category = "Low Metabolic Rate"
    else if (mifflinStJeor < 1500) category = "Below Average"
    else if (mifflinStJeor < 1800) category = "Average"
    else if (mifflinStJeor < 2200) category = "Above Average"
    else category = "High Metabolic Rate"

    const dailyCalories = {
      sedentary: Math.round(mifflinStJeor * 1.2),
      light: Math.round(mifflinStJeor * 1.375),
      moderate: Math.round(mifflinStJeor * 1.55),
      active: Math.round(mifflinStJeor * 1.725),
      veryActive: Math.round(mifflinStJeor * 1.9),
    }

    setResult({
      mifflinStJeor: Math.round(mifflinStJeor),
      harrisBenedict: Math.round(harrisBenedict),
      katchMcArdle: katchMcArdle ? Math.round(katchMcArdle) : undefined,
      category,
      dailyCalories,
    })
  }

  // Auto-calculate when all fields are filled
  useEffect(() => {
    if (age && gender && weight && height) {
      calculateBMR()
    }
  }, [age, gender, weight, height, bodyFat, weightUnit, heightUnit])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Low Metabolic Rate":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Below Average":
        return "bg-cyan-100 text-cyan-800 border-cyan-200"
      case "Average":
        return "bg-green-100 text-green-800 border-green-200"
      case "Above Average":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "High Metabolic Rate":
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
          <Label htmlFor="age">Age (years)</Label>
          <Input
            id="age"
            type="number"
            placeholder="25"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="1"
            max="120"
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

        <div className="space-y-2">
          <Label htmlFor="weight">Weight ({weightUnit})</Label>
          <Input
            id="weight"
            type="number"
            placeholder={weightUnit === "kg" ? "70" : "154"}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            min="1"
            max="500"
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
            min="50"
            max="250"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bodyFat">Body Fat Percentage (optional, for Katch-McArdle)</Label>
          <Input
            id="bodyFat"
            type="number"
            placeholder="15"
            value={bodyFat}
            onChange={(e) => setBodyFat(e.target.value)}
            min="1"
            max="50"
            step="0.1"
          />
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Heart className="w-5 h-5" />
                BMR Comparison (Multiple Formulas)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">{result.mifflinStJeor}</div>
                  <div className="text-sm font-medium">Mifflin-St Jeor</div>
                  <div className="text-xs text-muted-foreground">Most accurate</div>
                </div>

                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold mb-1">{result.harrisBenedict}</div>
                  <div className="text-sm font-medium">Harris-Benedict</div>
                  <div className="text-xs text-muted-foreground">Traditional formula</div>
                </div>

                {result.katchMcArdle && (
                  <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-700 dark:text-green-400 mb-1">
                      {result.katchMcArdle}
                    </div>
                    <div className="text-sm font-medium">Katch-McArdle</div>
                    <div className="text-xs text-muted-foreground">Lean body mass</div>
                  </div>
                )}
              </div>

              <div className="text-center">
                <Badge className={getCategoryColor(result.category)}>{result.category}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Daily Calorie Needs */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Calorie Needs by Activity Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm">Sedentary</span>
                  <span className="font-semibold">{result.dailyCalories.sedentary}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm">Light Activity</span>
                  <span className="font-semibold">{result.dailyCalories.light}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm">Moderate Activity</span>
                  <span className="font-semibold">{result.dailyCalories.moderate}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm">Active</span>
                  <span className="font-semibold">{result.dailyCalories.active}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg sm:col-span-2">
                  <span className="text-sm">Very Active</span>
                  <span className="font-semibold">{result.dailyCalories.veryActive}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formula Information */}
          <Card>
            <CardHeader>
              <CardTitle>Formula Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Mifflin-St Jeor:</span> Most accurate for general population.
                  Recommended by most nutritionists.
                </div>
                <div>
                  <span className="font-medium">Harris-Benedict:</span> Older formula, tends to overestimate BMR
                  slightly.
                </div>
                {result.katchMcArdle && (
                  <div>
                    <span className="font-medium">Katch-McArdle:</span> Most accurate for lean individuals with known
                    body fat percentage.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
