"use client"
import { createContext, useContext, useState, type ReactNode } from "react"

export type WeightUnit = "kg" | "lbs"
export type HeightUnit = "cm" | "inches"
export type EnergyUnit = "kcal" | "kJ"

interface UnitContextType {
  weightUnit: WeightUnit
  heightUnit: HeightUnit
  energyUnit: EnergyUnit
  setWeightUnit: (unit: WeightUnit) => void
  setHeightUnit: (unit: HeightUnit) => void
  setEnergyUnit: (unit: EnergyUnit) => void
  convertWeight: (value: number, from: WeightUnit, to: WeightUnit) => number
  convertHeight: (value: number, from: HeightUnit, to: HeightUnit) => number
  convertEnergy: (value: number, from: EnergyUnit, to: EnergyUnit) => number
}

const UnitContext = createContext<UnitContextType | undefined>(undefined)

export function UnitProvider({ children }: { children: ReactNode }) {
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg")
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm")
  const [energyUnit, setEnergyUnit] = useState<EnergyUnit>("kcal")

  const convertWeight = (value: number, from: WeightUnit, to: WeightUnit): number => {
    if (from === to) return value
    if (from === "kg" && to === "lbs") return value * 2.20462
    if (from === "lbs" && to === "kg") return value / 2.20462
    return value
  }

  const convertHeight = (value: number, from: HeightUnit, to: HeightUnit): number => {
    if (from === to) return value
    if (from === "cm" && to === "inches") return value / 2.54
    if (from === "inches" && to === "cm") return value * 2.54
    return value
  }

  const convertEnergy = (value: number, from: EnergyUnit, to: EnergyUnit): number => {
    if (from === to) return value
    if (from === "kcal" && to === "kJ") return value * 4.184
    if (from === "kJ" && to === "kcal") return value / 4.184
    return value
  }

  return (
    <UnitContext.Provider
      value={{
        weightUnit,
        heightUnit,
        energyUnit,
        setWeightUnit,
        setHeightUnit,
        setEnergyUnit,
        convertWeight,
        convertHeight,
        convertEnergy,
      }}
    >
      {children}
    </UnitContext.Provider>
  )
}

export function useUnits() {
  const context = useContext(UnitContext)
  if (context === undefined) {
    throw new Error("useUnits must be used within a UnitProvider")
  }
  return context
}
