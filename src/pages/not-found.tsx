import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <span className="font-mono text-6xl font-medium text-muted-foreground">404</span>
      <h1 className="mt-4 text-xl font-semibold">This page doesn&apos;t exist</h1>
      <Button render={<Link to="/" />} className="mt-6">
        Go home
      </Button>
    </div>
  );
}
