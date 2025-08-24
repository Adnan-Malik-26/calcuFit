"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useUnits } from "./unit-context"

interface GoalResult {
  currentBMR: number
  currentTDEE: number
  targetCalories: number
  weeklyDeficit: number
  dailyDeficit: number
  timeToGoal: number
  targetDate: string
}

export function GoalCalculator() {
  const [currentWeight, setCurrentWeight] = useState<number>(70)
  const [targetWeight, setTargetWeight] = useState<number>(65)
  const [height, setHeight] = useState<number>(170)
  const [age, setAge] = useState<number>(30)
  const [gender, setGender] = useState<string>("male")
  const [activityLevel, setActivityLevel] = useState<string>("1.55")
  const [timeframe, setTimeframe] = useState<number>(12)
  const [result, setResult] = useState<GoalResult | null>(null)
  const { weightUnit, heightUnit, energyUnit, convertWeight, convertHeight, convertEnergy } = useUnits()

  const activityLevels = [
    { value: "1.2", label: "Sedentary (desk job, no exercise)" },
    { value: "1.375", label: "Lightly active (light exercise 1-3 days/week)" },
    { value: "1.55", label: "Moderately active (moderate exercise 3-5 days/week)" },
    { value: "1.725", label: "Very active (hard exercise 6-7 days/week)" },
    { value: "1.9", label: "Extremely active (very hard exercise, physical job)" },
  ]

  const calculateGoal = () => {
    if (currentWeight > 0 && targetWeight > 0 && height > 0 && age > 0 && timeframe > 0) {
      // Convert units to metric for calculation
      const weightKg = weightUnit === "lbs" ? convertWeight(currentWeight, "lbs", "kg") : currentWeight
      const targetWeightKg = weightUnit === "lbs" ? convertWeight(targetWeight, "lbs", "kg") : targetWeight
      const heightCm = heightUnit === "inches" ? convertHeight(height, "inches", "cm") : height

      // Calculate BMR using Mifflin-St Jeor equation
      const bmr =
        gender === "male"
          ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
          : 10 * weightKg + 6.25 * heightCm - 5 * age - 161

      // Calculate TDEE
      const tdee = bmr * Number.parseFloat(activityLevel)

      // Calculate weight difference and required deficit
      const weightDifference = weightKg - targetWeightKg // positive = weight loss, negative = weight gain
      const totalCaloriesNeeded = weightDifference * 7700 // 7700 calories per kg of fat
      const weeklyDeficit = totalCaloriesNeeded / timeframe
      const dailyDeficit = weeklyDeficit / 7

      // Calculate target daily calories
      const targetCalories = tdee - dailyDeficit

      // Calculate target date
      const targetDate = new Date()
      targetDate.setDate(targetDate.getDate() + timeframe * 7)

      // Convert energy units if needed
      const convertedBMR = energyUnit === "kJ" ? convertEnergy(bmr, "kcal", "kJ") : bmr
      const convertedTDEE = energyUnit === "kJ" ? convertEnergy(tdee, "kcal", "kJ") : tdee
      const convertedTargetCalories = energyUnit === "kJ" ? convertEnergy(targetCalories, "kcal", "kJ") : targetCalories
      const convertedDailyDeficit =
        energyUnit === "kJ" ? convertEnergy(Math.abs(dailyDeficit), "kcal", "kJ") : Math.abs(dailyDeficit)

      setResult({
        currentBMR: convertedBMR,
        currentTDEE: convertedTDEE,
        targetCalories: convertedTargetCalories,
        weeklyDeficit,
        dailyDeficit: convertedDailyDeficit,
        timeToGoal: timeframe,
        targetDate: targetDate.toLocaleDateString(),
      })
    } else {
      setResult(null)
    }
  }

  useEffect(() => {
    calculateGoal()
  }, [currentWeight, targetWeight, height, age, gender, activityLevel, timeframe, weightUnit, heightUnit, energyUnit])

  const getGoalType = () => {
    if (currentWeight > targetWeight) return "loss"
    if (currentWeight < targetWeight) return "gain"
    return "maintain"
  }

  const getGoalColor = () => {
    const goalType = getGoalType()
    if (goalType === "loss") return "bg-red-500"
    if (goalType === "gain") return "bg-green-500"
    return "bg-blue-500"
  }

  const getGoalLabel = () => {
    const goalType = getGoalType()
    if (goalType === "loss") return "Weight Loss"
    if (goalType === "gain") return "Weight Gain"
    return "Weight Maintenance"
  }

  const getSafetyWarning = () => {
    if (!result) return null

    const weeklyWeightChange = Math.abs(currentWeight - targetWeight) / timeframe
    const maxSafeWeeklyLoss = weightUnit === "kg" ? 1 : 2.2 // 1kg or 2.2lbs per week

    if (getGoalType() === "loss" && weeklyWeightChange > maxSafeWeeklyLoss) {
      return "Warning: This rate of weight loss may be too aggressive. Consider a longer timeframe."
    }

    if (result.targetCalories < (energyUnit === "kJ" ? 5000 : 1200)) {
      return "Warning: Target calories are very low. Consult a healthcare professional."
    }

    return null
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="current-weight">Current Weight ({weightUnit})</Label>
          <Input
            id="current-weight"
            type="number"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(Number(e.target.value))}
            placeholder={`Weight in ${weightUnit}`}
            min="1"
            step="0.1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="target-weight">Target Weight ({weightUnit})</Label>
          <Input
            id="target-weight"
            type="number"
            value={targetWeight}
            onChange={(e) => setTargetWeight(Number(e.target.value))}
            placeholder={`Target in ${weightUnit}`}
            min="1"
            step="0.1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Height ({heightUnit})</Label>
          <Input
            id="height"
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            placeholder={`Height in ${heightUnit}`}
            min="1"
            step="0.1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            placeholder="Age in years"
            min="1"
            max="120"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="timeframe">Timeframe (weeks)</Label>
          <Input
            id="timeframe"
            type="number"
            value={timeframe}
            onChange={(e) => setTimeframe(Number(e.target.value))}
            placeholder="Weeks to goal"
            min="1"
            max="104"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="activity">Activity Level</Label>
        <Select value={activityLevel} onValueChange={setActivityLevel}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {activityLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-4">
          {/* Goal Overview */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Goal Overview</CardTitle>
                <Badge className={`${getGoalColor()} text-white`}>{getGoalLabel()}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Weight Change:</span>
                <span className="font-medium">
                  {Math.abs(currentWeight - targetWeight).toFixed(1)} {weightUnit}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Target Date:</span>
                <span className="font-medium">{result.targetDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Weekly Rate:</span>
                <span className="font-medium">
                  {(Math.abs(currentWeight - targetWeight) / timeframe).toFixed(2)} {weightUnit}/week
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Calorie Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Current Metabolism</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>BMR:</span>
                  <span className="font-medium">
                    {result.currentBMR.toFixed(0)} {energyUnit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>TDEE:</span>
                  <span className="font-medium">
                    {result.currentTDEE.toFixed(0)} {energyUnit}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Target Intake</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Daily Calories:</span>
                  <span className="font-medium text-primary">
                    {result.targetCalories.toFixed(0)} {energyUnit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Daily {getGoalType() === "loss" ? "Deficit" : "Surplus"}:</span>
                  <span className="font-medium">
                    {result.dailyDeficit.toFixed(0)} {energyUnit}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Safety Warning */}
          {getSafetyWarning() && (
            <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <CardContent className="pt-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">{getSafetyWarning()}</p>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Tips for Success</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Track your food intake and weight consistently</li>
                <li>• Adjust calories based on actual progress</li>
                <li>• Include strength training to preserve muscle mass</li>
                <li>• Stay hydrated and get adequate sleep</li>
                <li>• Consider consulting a healthcare professional for personalized advice</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
