"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Scale, Activity, Heart, Target, Dumbbell, Crosshair } from "lucide-react"
import { BMICalculator } from "@/components/bmi-calculator"
import { TDEECalculator } from "@/components/tdee-calculator"
import { BodyFatCalculator } from "@/components/body-fat-calculator"
import { BMRCalculator } from "@/components/bmr-calculator"
import { IdealWeightCalculator } from "@/components/ideal-weight-calculator"
import { OneRMCalculator } from "@/components/one-rm-calculator"
import { Footer } from "@/components/footer"
import { UnitSelector } from "@/components/unit-selector"
import { GoalCalculator } from "@/components/goal-calculator"

export default function FitnessCalculatorApp() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-start mb-4">
            <div></div>
            <UnitSelector />
          </div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">CalcuFit</h1>
          <p className="text-muted-foreground text-lg">
            Professional tools for tracking your health and fitness metrics
          </p>
        </div>

        {/* Main Calculator Tabs */}
        <Tabs defaultValue="bmi" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="bmi" className="flex items-center gap-2 text-white">
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">BMI</span>
            </TabsTrigger>
            <TabsTrigger value="tdee" className="flex items-center gap-2 text-white">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">TDEE</span>
            </TabsTrigger>
            <TabsTrigger value="bodyfat" className="flex items-center gap-2 text-white">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Body Fat</span>
            </TabsTrigger>
            <TabsTrigger value="bmr" className="flex items-center gap-2 text-white">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">BMR</span>
            </TabsTrigger>
            <TabsTrigger value="ideal" className="flex items-center gap-2 text-white">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Ideal</span>
            </TabsTrigger>
            <TabsTrigger value="onerm" className="flex items-center gap-2 text-white">
              <Dumbbell className="w-4 h-4" />
              <span className="hidden sm:inline">1RM</span>
            </TabsTrigger>
            <TabsTrigger value="goal" className="flex items-center gap-2 text-white">
              <Crosshair className="w-4 h-4" />
              <span className="hidden sm:inline">Goal</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="onerm">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">1RM Strength Calculator</CardTitle>
                <CardDescription>
                  Calculate your one-rep max and training percentages for strength programming
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OneRMCalculator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bmi">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Body Mass Index Calculator</CardTitle>
                <CardDescription>Calculate your BMI to assess if you're in a healthy weight range</CardDescription>
              </CardHeader>
              <CardContent>
                <BMICalculator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tdee">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">TDEE Calculator</CardTitle>
                <CardDescription>Calculate your Total Daily Energy Expenditure for weight management</CardDescription>
              </CardHeader>
              <CardContent>
                <TDEECalculator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bodyfat">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Body Fat Calculator</CardTitle>
                <CardDescription>Estimate your body fat percentage using the U.S. Navy method</CardDescription>
              </CardHeader>
              <CardContent>
                <BodyFatCalculator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bmr">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">BMR Calculator</CardTitle>
                <CardDescription>
                  Calculate your Basal Metabolic Rate using the Mifflin-St Jeor equation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BMRCalculator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ideal">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Ideal Weight Calculator</CardTitle>
                <CardDescription>Calculate your ideal weight using multiple proven formulas</CardDescription>
              </CardHeader>
              <CardContent>
                <IdealWeightCalculator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goal">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Goal-Oriented Calculator</CardTitle>
                <CardDescription>
                  Calculate daily calories needed to reach your weight goal within a specific timeframe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GoalCalculator />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer component */}
      <Footer />
    </div>
  )
}
