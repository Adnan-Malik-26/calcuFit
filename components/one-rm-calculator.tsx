"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useUnits } from "./unit-context"

interface OneRMResult {
  oneRM: number
  percentages: { percentage: number; weight: number }[]
}

export function OneRMCalculator() {
  const [weight, setWeight] = useState<number>(100)
  const [reps, setReps] = useState<number>(5)
  const [result, setResult] = useState<OneRMResult | null>(null)
  const { weightUnit, convertWeight } = useUnits()

  // Common training percentages
  const trainingPercentages = [50, 60, 65, 70, 75, 80, 85, 90, 95, 100]

  const calculateOneRM = () => {
    if (weight > 0 && reps > 0 && reps <= 15) {
      // Using Epley formula: 1RM = weight × (1 + reps/30)
      const oneRM = weight * (1 + reps / 30)

      const percentages = trainingPercentages.map((percentage) => ({
        percentage,
        weight: (oneRM * percentage) / 100,
      }))

      setResult({ oneRM, percentages })
    } else {
      setResult(null)
    }
  }

  useEffect(() => {
    calculateOneRM()
  }, [weight, reps])

  const getIntensityColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 80) return "bg-orange-500"
    if (percentage >= 70) return "bg-yellow-500"
    if (percentage >= 60) return "bg-blue-500"
    return "bg-green-500"
  }

  const getIntensityLabel = (percentage: number) => {
    if (percentage >= 90) return "Max Effort"
    if (percentage >= 80) return "Heavy"
    if (percentage >= 70) return "Moderate"
    if (percentage >= 60) return "Light"
    return "Warm-up"
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Weight ({weightUnit})</Label>
          <Input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            placeholder={`Enter weight in ${weightUnit}`}
            min="1"
            step="0.5"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reps">Repetitions</Label>
          <Input
            id="reps"
            type="number"
            value={reps}
            onChange={(e) => setReps(Number(e.target.value))}
            placeholder="Enter reps (1-15)"
            min="1"
            max="15"
          />
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-4">
          {/* 1RM Result */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Estimated 1RM</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {result.oneRM.toFixed(1)} {weightUnit}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Based on {weight} {weightUnit} × {reps} reps using Epley formula
              </p>
            </CardContent>
          </Card>

          {/* Training Percentages */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Training Load Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {result.percentages.map(({ percentage, weight: trainingWeight }) => (
                  <div key={percentage} className="text-center space-y-2">
                    <Badge className={`${getIntensityColor(percentage)} text-white w-full justify-center`}>
                      {percentage}%
                    </Badge>
                    <div className="text-sm font-medium">
                      {trainingWeight.toFixed(1)} {weightUnit}
                    </div>
                    <div className="text-xs text-muted-foreground">{getIntensityLabel(percentage)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Training Guidelines */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Training Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="font-medium">50-60%:</span>
                    <span>Warm-up, technique work</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="font-medium">60-70%:</span>
                    <span>Volume training, endurance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="font-medium">70-80%:</span>
                    <span>Hypertrophy, strength endurance</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="font-medium">80-90%:</span>
                    <span>Strength training</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="font-medium">90-100%:</span>
                    <span>Max strength, powerlifting</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Validation Message */}
      {!result && weight > 0 && reps > 0 && (
        <div className="text-center text-muted-foreground text-sm">
          Please enter reps between 1-15 for accurate 1RM estimation
        </div>
      )}
    </div>
  )
}
