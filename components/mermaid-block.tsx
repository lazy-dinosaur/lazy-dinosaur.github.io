"use client";
import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";
import { useTheme } from "next-themes";

interface MermaidBlockProps {
	code: string;
}

export default function MermaidBlock({ code }: MermaidBlockProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const { theme } = useTheme();

	useEffect(() => {
		if (containerRef.current) {
			// Mermaid 초기화
			mermaid.initialize({
				startOnLoad: true,
				theme: theme === "dark" ? "dark" : "default",
				themeVariables: {
					primaryColor: theme === "dark" ? "#60a5fa" : "#3b82f6",
					primaryTextColor: theme === "dark" ? "#e5e7eb" : "#111827",
					primaryBorderColor: theme === "dark" ? "#374151" : "#e5e7eb",
					lineColor: theme === "dark" ? "#6b7280" : "#9ca3af",
					secondaryColor: theme === "dark" ? "#374151" : "#f3f4f6",
					tertiaryColor: theme === "dark" ? "#1f2937" : "#fef3c7",
					background: theme === "dark" ? "#111827" : "#ffffff",
					mainBkg: theme === "dark" ? "#1f2937" : "#f9fafb",
					secondBkg: theme === "dark" ? "#374151" : "#f3f4f6",
					tertiaryBkg: theme === "dark" ? "#1f2937" : "#fef3c7",
					textColor: theme === "dark" ? "#e5e7eb" : "#111827",
					nodeTextColor: theme === "dark" ? "#e5e7eb" : "#111827",
					fontSize: "18px",
				},
				flowchart: {
					htmlLabels: true,
					curve: "basis",
					rankSpacing: 60,
					nodeSpacing: 40,
					padding: 15,
				},
			});

			// 고유 ID 생성
			const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
			containerRef.current.innerHTML = `<div class="mermaid" id="${id}" style="width: 100%;">${code}</div>`;

			// Mermaid 렌더링
			mermaid.run({
				nodes: [containerRef.current.querySelector(".mermaid")!],
			});
		}
	}, [code, theme]);

	return (
		<div className="spacing-section my-4 sm:my-6 md:my-8">
			<div
				ref={containerRef}
				className="w-full h-full bg-background rounded-lg border border-primary/10 
          overflow-x-auto shadow-sm"
			/>
		</div>
	);
}
