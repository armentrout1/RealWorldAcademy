import React from "react";
import { Link, useLocation } from "wouter";
import { AlertTriangle, FileText, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type LegalPageKind = "privacy" | "terms" | "safety";

const pageContent: Record<LegalPageKind, {
  title: string;
  eyebrow: string;
  icon: React.ReactNode;
  intro: string;
  sections: { title: string; body: string }[];
}> = {
  privacy: {
    title: "Privacy Policy",
    eyebrow: "Beta Policy",
    icon: <ShieldCheck className="h-5 w-5 text-primary" />,
    intro: "Real World Academy collects only the account and learning information needed to run student pathways, progress tracking, parent review, and credential records.",
    sections: [
      {
        title: "Information We Collect",
        body: "We may collect account details, profile information, lesson progress, reflection responses, parent-child relationships, curriculum submissions, and credential records.",
      },
      {
        title: "How Information Is Used",
        body: "Information is used to authenticate accounts, save progress, show parent dashboards, review curriculum submissions, issue credentials, and improve the beta experience.",
      },
      {
        title: "Student and Minor Data",
        body: "Families should use parent-supervised accounts for minors. Parent review tools are intended to help guardians understand student progress and submitted work.",
      },
      {
        title: "Sharing",
        body: "Credential and portfolio information is private by default. Public sharing controls should be added before any public transcript or portfolio sharing feature is enabled.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    eyebrow: "Use Terms",
    icon: <FileText className="h-5 w-5 text-primary" />,
    intro: "Real World Academy is a homeschool support and practical skills learning platform. It is not an accredited school and does not grant official school credit.",
    sections: [
      {
        title: "Educational Use",
        body: "Lessons, pathways, resources, and credentials are provided for general educational purposes. Families remain responsible for meeting any local homeschool or school requirements.",
      },
      {
        title: "Credentials",
        body: "Real World Academy credentials represent completion of listed platform requirements only. They do not represent accreditation, licensure, certification, or official academic credit.",
      },
      {
        title: "Contributor Content",
        body: "Submitted curriculum may be reviewed, rejected, edited, archived, or approved before publication. Contributors should only submit original content or content they have permission to share.",
      },
      {
        title: "Account Responsibility",
        body: "Users are responsible for keeping account credentials secure and for making sure student use is appropriate for age, maturity, and family expectations.",
      },
    ],
  },
  safety: {
    title: "Safety for Families",
    eyebrow: "Family Safety",
    icon: <AlertTriangle className="h-5 w-5 text-primary" />,
    intro: "Real World Academy is designed for family-guided learning. The beta should be used with adult awareness, especially for younger students.",
    sections: [
      {
        title: "Parent Supervision",
        body: "Parents or guardians should review student progress, reflections, external video resources, and any curriculum recommendations before relying on them for homeschool planning.",
      },
      {
        title: "External Resources",
        body: "Some lessons may use external videos or websites. External content can change, so families should verify that linked resources remain appropriate and available.",
      },
      {
        title: "No Professional Advice",
        body: "Content about money, careers, wellness, or life skills is general education. It should not replace professional financial, legal, medical, or mental health advice.",
      },
      {
        title: "Reporting Concerns",
        body: "During beta, families and contributors should report inappropriate, inaccurate, or unsafe curriculum so it can be reviewed before broader publication.",
      },
    ],
  },
};

export default function LegalInfo() {
  const [location] = useLocation();
  const pageKind: LegalPageKind = location.includes("privacy")
    ? "privacy"
    : location.includes("safety")
      ? "safety"
      : "terms";
  const content = pageContent[pageKind];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 max-w-3xl">
        <Badge className="mb-3">{content.eyebrow}</Badge>
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
          {content.icon}
          {content.title}
        </h1>
        <p className="mt-3 text-muted-foreground">{content.intro}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          {content.sections.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{section.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Public Beta Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              These pages are plain-language beta policies and should be reviewed before a larger public launch.
            </p>
            <div className="grid gap-2">
              <Button variant="outline" asChild>
                <Link href="/privacy">Privacy</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/terms">Terms</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/safety">Safety</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
