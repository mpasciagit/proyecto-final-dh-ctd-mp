import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

// Extrae todos los headings de nivel 2 y sus contenidos
function getSections(md) {
  const lines = md.split("\n");
  const sections = [];
  let currentTitle = null;
  let currentContent = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      // Si ya había una sección abierta, la guardamos
      if (currentTitle) {
        sections.push({
          title: currentTitle,
          content: currentContent.join("\n").trim()
        });
      }
      // Nuevo título
      currentTitle = line.replace("## ", "").trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // Última sección
  if (currentTitle) {
    sections.push({
      title: currentTitle,
      content: currentContent.join("\n").trim()
    });
  }

  return sections;
}

export default function AdminHelp() {
  const [markdown, setMarkdown] = useState("");
  const [sections, setSections] = useState([]);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    fetch("/MANUAL-PANEL-ADMIN.md")
      .then(res => res.text())
      .then(md => {
        setMarkdown(md);
        setSections(getSections(md));
      });
  }, []);

  const toggle = idx => {
    setOpen(open => open === idx ? null : idx);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 24px 24px" }}>
      <h1>Manual del Panel Admin</h1>
      <div style={{ marginBottom: 24 }}>
        {sections.map((section, idx) => (
          <div key={section.title}>
            <button
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "12px 16px",
                marginBottom: 8,
                background: open === idx ? "#e3f2fd" : "#f5f5f5",
                border: "1px solid #ddd",
                borderRadius: 6,
                fontWeight: "bold",
                cursor: "pointer"
              }}
              onClick={() => toggle(idx)}
            >
              {section.title}
            </button>
            {open === idx && (
              <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", padding: 24, marginBottom: 16 }}>
                <ReactMarkdown>
                  {section.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}