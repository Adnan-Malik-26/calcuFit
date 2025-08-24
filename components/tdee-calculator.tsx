"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Plus } from "lucide-react"
import { useUnits } from "./unit-context"

interface TDEEResult {
  bmr: number
  tdee: number
  category: string
}

interface CustomActivity {
  id: string
  name: string
  factor: number
}

export function TDEECalculator() {
  const [age, setAge] = useState<string>("")
  const [gender, setGender] = useState<string>("")
  const [weight, setWeight] = useState<string>("")
  const [height, setHeight] = useState<string>("")
  const [activityLevel, setActivityLevel] = useState<string>("")
  const [customActivityName, setCustomActivityName] = useState<string>("")
  const [customActivityFactor, setCustomActivityFactor] = useState<string>("")
  const [customActivities, setCustomActivities] = useState<CustomActivity[]>([])
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false)
  const [result, setResult] = useState<TDEEResult | null>(null)
  const { weightUnit, heightUnit, energyUnit, convertWeight, convertHeight, convertEnergy } = useUnits()

  const defaultActivityFactors = {
    sedentary: { value: 1.2, label: "Sedentary (little/no exercise)" },
    light: { value: 1.375, label: "Light (light exercise 1-3 days/week)" },
    moderate: { value: 1.55, label: "Moderate (moderate exercise 3-5 days/week)" },
    active: { value: 1.725, label: "Active (hard exercise 6-7 days/week)" },
    veryActive: { value: 1.9, label: "Very Active (very hard exercise, physical job)" },
  }

  const calculateTDEE = () => {
    const w = Number.parseFloat(weight)
    const h = Number.parseFloat(height)
    const a = Number.parseInt(age)

    if (!w || !h || !a || !gender || !activityLevel) return

    // Convert to metric for calculation
    const weightKg = weightUnit === "lbs" ? convertWeight(w, "lbs", "kg") : w
    const heightCm = heightUnit === "inches" ? convertHeight(h, "inches", "cm") : h

    // Mifflin-St Jeor Equation for BMR
    let bmr: number
    if (gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * a + 5
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * a - 161
    }

    // Get activity factor
    let activityFactor: number
    if (activityLevel.startsWith("custom-")) {
      const customId = activityLevel.replace("custom-", "")
      const customActivity = customActivities.find((ca) => ca.id === customId)
      activityFactor = customActivity?.factor || 1.2
    } else {
      activityFactor = defaultActivityFactors[activityLevel as keyof typeof defaultActivityFactors].value
    }

    const tdee = bmr * activityFactor

    let category = ""
    if (tdee < 1500) category = "Low Energy Needs"
    else if (tdee < 2000) category = "Moderate Energy Needs"
    else if (tdee < 2500) category = "High Energy Needs"
    else category = "Very High Energy Needs"

    // Convert energy units if needed
    const convertedBMR = energyUnit === "kJ" ? convertEnergy(bmr, "kcal", "kJ") : bmr
    const convertedTDEE = energyUnit === "kJ" ? convertEnergy(tdee, "kcal", "kJ") : tdee

    setResult({
      bmr: Math.round(convertedBMR),
      tdee: Math.round(convertedTDEE),
      category,
    })
  }

  const addCustomActivity = () => {
    if (customActivityName && customActivityFactor) {
      const factor = Number.parseFloat(customActivityFactor)
      if (factor >= 1.0 && factor <= 3.0) {
        const newActivity: CustomActivity = {
          id: Date.now().toString(),
          name: customActivityName,
          factor: factor,
        }
        setCustomActivities([...customActivities, newActivity])
        setCustomActivityName("")
        setCustomActivityFactor("")
        setShowCustomForm(false)
      }
    }
  }

  const removeCustomActivity = (id: string) => {
    setCustomActivities(customActivities.filter((ca) => ca.id !== id))
    if (activityLevel === `custom-${id}`) {
      setActivityLevel("")
    }
  }

  // Auto-calculate when all fields are filled
  useEffect(() => {
    if (age && gender && weight && height && activityLevel) {
      calculateTDEE()
    }
  }, [age, gender, weight, height, activityLevel, customActivities, weightUnit, heightUnit, energyUnit])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Low Energy Needs":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Moderate Energy Needs":
        return "bg-green-100 text-green-800 border-green-200"
      case "High Energy Needs":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "Very High Energy Needs":
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
          <div className="flex items-center justify-between">
            <Label htmlFor="activity">Activity Level</Label>
            <Button variant="outline" size="sm" onClick={() => setShowCustomForm(!showCustomForm)} className="gap-2">
              <Plus className="w-4 h-4" />
              Custom
            </Button>
          </div>
          <Select value={activityLevel} onValueChange={setActivityLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select your activity level" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(defaultActivityFactors).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
              {customActivities.map((activity) => (
                <SelectItem key={`custom-${activity.id}`} value={`custom-${activity.id}`}>
                  {activity.name} (×{activity.factor})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Custom Activity Form */}
      {showCustomForm && (
        <Card className="bg-muted/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Add Custom Activity Level</CardTitle>
            <CardDescription>Define your own activity multiplier (1.0 - 3.0)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="custom-name">Activity Name</Label>
                <Input
                  id="custom-name"
                  placeholder="e.g., Construction Worker"
                  value={customActivityName}
                  onChange={(e) => setCustomActivityName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-factor">Activity Factor</Label>
                <Input
                  id="custom-factor"
                  type="number"
                  placeholder="1.8"
                  value={customActivityFactor}
                  onChange={(e) => setCustomActivityFactor(e.target.value)}
                  min="1.0"
                  max="3.0"
                  step="0.1"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addCustomActivity} disabled={!customActivityName || !customActivityFactor}>
                Add Activity
              </Button>
              <Button variant="outline" onClick={() => setShowCustomForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Activities List */}
      {customActivities.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Your Custom Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {customActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">
                    {activity.name} (×{activity.factor})
                  </span>
                  <Button variant="outline" size="sm" onClick={() => removeCustomActivity(activity.id)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Zap className="w-5 h-5" />
              Your Daily Energy Needs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{result.bmr}</div>
                <div className="text-sm text-muted-foreground">BMR ({energyUnit}/day)</div>
                <div className="text-xs text-muted-foreground mt-1">Calories at rest</div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-3xl font-bold text-primary">{result.tdee}</div>
                <div className="text-sm text-card-foreground">TDEE ({energyUnit}/day)</div>
                <div className="text-xs text-muted-foreground mt-1">Total daily calories</div>
              </div>
            </div>

            <div className="flex justify-center">
              <Badge className={getCategoryColor(result.category)}>{result.category}</Badge>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>For weight maintenance:</strong> Consume {result.tdee} {energyUnit} per day
              </p>
              <p>
                <strong>For weight loss:</strong> Consume {Math.round(result.tdee - (energyUnit === "kJ" ? 2092 : 500))}{" "}
                {energyUnit} per day (0.5 kg/week)
              </p>
              <p>
                <strong>For weight gain:</strong> Consume {Math.round(result.tdee + (energyUnit === "kJ" ? 2092 : 500))}{" "}
                {energyUnit} per day (0.5 kg/week)
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Level Reference */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Activity Level Guide</CardTitle>
          <CardDescription>Choose the level that best describes your lifestyle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {Object.entries(defaultActivityFactors).map(([key, { value, label }]) => (
              <div key={key} className="flex justify-between">
                <span>{label}</span>
                <span className="text-muted-foreground">×{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
