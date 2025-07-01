import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

import { toast } from "sonner"
interface ApprovalDialogProps {
  reviewInfo: Record<string, string>
  onSubmit: () => void
}

export function ApprovalDialog({ onSubmit, reviewInfo }: ApprovalDialogProps)
{
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  const handleConfirm = () => {
    setSubmitted(true)
    toast.success("Sent for Approval ✅")

    // 🟡 Save to localStorage

    localStorage.setItem("userRegistrationData", JSON.stringify(reviewInfo))
    // 🟢 Placeholder for future API call
    // await submitUserToAPI(reviewInfo)

    onSubmit?.()
    navigate("/user-details")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
      <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base py-2 px-3 sm:px-4 h-auto">
        Send for Approval
      </Button>
    </DialogTrigger>
      <DialogContent className="sm:max-w-md text-center">
        {!submitted ? (
          <>
            <DialogHeader className="flex flex-col items-center gap-2">
              <AlertTriangle className="w-10 h-10 text-warning-foreground" />
              <DialogTitle>Confirmation</DialogTitle>
              <DialogDescription>Please check all the details before submitting for approval.</DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-center gap-4 mt-4">
              <Button
                className="bg-background hover:bg-secondary text-foreground border border-border"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirm} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Submit
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-8">
            <h2 className="text-lg font-semibold text-primary mb-2">Sent for Approval</h2>
            <p className="text-sm text-muted-foreground">Details are sent for approval</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
