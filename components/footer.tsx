import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-lg text-foreground">calcuFit</h3>
            <p className="text-muted-foreground text-sm">
              Professional fitness tools to help you track and achieve your health goals with scientifically-backed
              calculations.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Calculators</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>BMI Calculator</li>
              <li>TDEE Calculator</li>
              <li>Body Fat Calculator</li>
              <li>BMR Calculator</li>
              <li>Ideal Weight Calculator</li>
            </ul>
          </div>

          {/* Contact/Info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Information</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>All calculations use scientifically proven formulas</p>
              <p>Results are for <span className="font-extrabold">informational purposes only</span></p>
              <p>Consult healthcare professionals for medical advice</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 FitCalc Built with precision and care.</p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-sm">Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span className="text-sm">for your health</span>
            <span className="text-sm">by Mohd Adnan Malik</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
