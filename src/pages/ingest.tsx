import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Loader2, Globe, Brain, Search } from "lucide-react";
import { motion } from "framer-motion";

const urlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

type UrlForm = z.infer<typeof urlSchema>;

const steps = [
  { label: "Fetching website content...", duration: 1200 },
  { label: "Analyzing page structure...", duration: 1000 },
  { label: "Extracting ICP signals...", duration: 1400 },
  { label: "Finalizing profile...", duration: 800 },
];

export default function Ingest() {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UrlForm>({
    resolver: zodResolver(urlSchema),
    defaultValues: { url: "" },
  });

  async function onSubmit(_data: UrlForm) {
    setProcessing(true);
    setCurrentStep(0);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, steps[i].duration));
      setCompletedSteps((prev) => [...prev, i]);
    }

    navigate("/icp/mock-icp-1");
  }

  return (
    <div className="mx-auto max-w-[640px] py-12">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Reverse-engineer any company&apos;s ICP</h1>
        <p className="mt-2 text-muted-foreground">
          Paste a company URL. Outpulse will read their website and extract their ideal customer
          profile in seconds.
        </p>
      </div>

      <Card className="mt-8">
        <CardContent>
          {!processing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="url">Company URL</Label>
                <div className="flex items-center gap-0 rounded-md border border-input bg-background">
                  <span className="shrink-0 border-r border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                    https://
                  </span>
                  <Input
                    id="url"
                    {...register("url")}
                    placeholder="linear.app"
                    className="border-0 shadow-none focus-visible:ring-0"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val.startsWith("http")) {
                        e.target.value = "https://" + val.replace(/^https?:\/\//, "");
                      }
                      register("url").onChange(e);
                    }}
                  />
                </div>
                {errors.url && (
                  <p className="text-xs text-destructive">{errors.url.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Extract ICP
              </Button>
            </form>
          ) : (
            <div className="space-y-3 py-2">
              {steps.map((step, i) => {
                const completed = completedSteps.includes(i);
                const active = currentStep === i && !completed;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className="flex size-5 items-center justify-center">
                      {completed ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check className="size-4 text-[hsl(150_50%_55%)]" />
                        </motion.div>
                      ) : active ? (
                        <Loader2 className="size-4 animate-spin text-primary" />
                      ) : (
                        <div className="size-1.5 rounded-full bg-muted-foreground/30" />
                      )}
                    </div>
                    <span
                      className={
                        completed
                          ? "text-foreground"
                          : active
                          ? "text-foreground"
                          : "text-muted-foreground/50"
                      }
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trust signals */}
      <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Globe className="size-3.5" />
          Powered by Exa
        </span>
        <span className="flex items-center gap-1.5">
          <Brain className="size-3.5" />
          Claude Sonnet 4
        </span>
        <span className="flex items-center gap-1.5">
          <Search className="size-3.5" />
          Real-time web discovery
        </span>
      </div>
    </div>
  );
}
