#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { spawn } from "child_process";
import { existsSync } from "fs";

const PDF2MD = "/Users/tima/.cargo/bin/pdf2md";

const server = new Server(
  { name: "pdf2md", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "pdf_to_markdown",
      description:
        "Convert a PDF file to Markdown. Uses pdf2md (pdf-inspector) for fast, AI-optimized extraction. " +
        "Returns structured markdown with tables, headings, lists, and code blocks detected automatically. " +
        "Detects scanned PDFs (returns early if OCR needed).",
      inputSchema: {
        type: "object",
        properties: {
          pdf_path: {
            type: "string",
            description: "Absolute path to the PDF file to convert",
          },
          pages: {
            type: "string",
            description: "Optional. Page range like '1,3,5-10' (passed to --select-pages)",
          },
          raw: {
            type: "boolean",
            description: "Optional. Output raw markdown without type/quality headers (--raw flag)",
          },
          json_output: {
            type: "boolean",
            description: "Optional. Output structured JSON with full metadata (--json flag)",
          },
          compact: {
            type: "boolean",
            description: "Optional. Collapse dot leaders and other token-heavy formatting (--compact flag)",
          },
          page_breaks: {
            type: "boolean",
            description: "Optional. Insert <!-- Page N --> markers between pages (--pages flag)",
          },
        },
        required: ["pdf_path"],
      },
    },
    {
      name: "detect_pdf_type",
      description:
        "Detect PDF type without full extraction. Returns classification: TextBased, Scanned, Mixed, or ImageBased. " +
        "Use to decide whether a PDF is extractable before running full conversion.",
      inputSchema: {
        type: "object",
        properties: {
          pdf_path: {
            type: "string",
            description: "Absolute path to the PDF file to analyze",
          },
        },
        required: ["pdf_path"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "pdf_to_markdown": {
      const { pdf_path, pages, raw, json_output, compact, page_breaks } = args;

      if (!existsSync(pdf_path)) {
        return {
          content: [{ type: "text", text: `Error: file not found: ${pdf_path}` }],
          isError: true,
        };
      }

      const cmdArgs = [pdf_path];
      if (pages) cmdArgs.push("--select-pages", String(pages));
      if (compact) cmdArgs.push("--compact");
      if (page_breaks) cmdArgs.push("--pages");
      if (json_output) cmdArgs.push("--json");
      else if (raw) cmdArgs.push("--raw");

      try {
        const result = await runPdf2md(cmdArgs);
        return { content: [{ type: "text", text: result }] };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error running pdf2md: ${err.message}` }],
          isError: true,
        };
      }
    }

    case "detect_pdf_type": {
      const { pdf_path } = args;

      if (!existsSync(pdf_path)) {
        return {
          content: [{ type: "text", text: `Error: file not found: ${pdf_path}` }],
          isError: true,
        };
      }

      try {
        const result = await runPdf2md([pdf_path, "--detect-only"]);
        return { content: [{ type: "text", text: result }] };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error running detect: ${err.message}` }],
          isError: true,
        };
      }
    }

    default:
      return {
        content: [{ type: "text", text: `Unknown tool: ${name}` }],
        isError: true,
      };
  }
});

function runPdf2md(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(PDF2MD, args, {
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 120_000,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));

    child.on("close", (code) => {
      const output = (stdout + stderr).trim() || "(empty output)";
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(output));
      }
    });

    child.on("error", reject);
  });
}

const transport = new StdioServerTransport();
await server.connect(transport);
