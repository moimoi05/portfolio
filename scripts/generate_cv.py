"""Build the downloadable one-page CV and its web preview."""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "cv"
PDF = OUTPUT / "CV_Nguyen_Phuong_Nam.pdf"
PREVIEW = OUTPUT / "cv-preview.webp"
INK = colors.HexColor("#17212b")
MUTED = colors.HexColor("#4d6070")
ACCENT = colors.HexColor("#274d6d")

NAME = ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=18, leading=22, alignment=TA_CENTER, textColor=INK)
CONTACT = ParagraphStyle("contact", fontName="Helvetica", fontSize=8.1, leading=11, alignment=TA_CENTER, textColor=MUTED)
SECTION = ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=9.2, leading=12, spaceBefore=10, spaceAfter=4, textColor=ACCENT)
COMPANY = ParagraphStyle("company", fontName="Helvetica-Bold", fontSize=9.2, leading=11.8, textColor=INK)
DATE = ParagraphStyle("date", fontName="Helvetica", fontSize=8.4, leading=11.8, alignment=2, textColor=MUTED)
ROLE = ParagraphStyle("role", fontName="Helvetica-Oblique", fontSize=8.5, leading=11, spaceAfter=2, textColor=MUTED)
BODY = ParagraphStyle("body", fontName="Helvetica", fontSize=8.5, leading=11.8, textColor=INK)
BULLET = ParagraphStyle("bullet", parent=BODY, leftIndent=10, firstLineIndent=-8, spaceAfter=1)


def heading(name: str, date: str = "", url: str | None = None) -> Table:
    title = f'<link href="{url}" color="#17212b">{name}</link>' if url else name
    table = Table([[Paragraph(title, COMPANY), Paragraph(date, DATE)]], colWidths=[4.65 * inch, 2.0 * inch])
    table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
    return table


def section(story: list, label: str) -> None:
    story.append(Paragraph(label, SECTION))
    story.append(HRFlowable(width="100%", thickness=0.55, color=colors.HexColor("#c6d2dc"), spaceAfter=5))


def bullets(story: list, items: list[str]) -> None:
    for item in items:
        story.append(Paragraph(f"&#8226; {item}", BULLET))


def build_pdf() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    story: list = [
        Paragraph("NGUYEN PHUONG NAM", NAME),
        Paragraph('0878141528 &nbsp;|&nbsp; <link href="mailto:nnam.hp2005@gmail.com">nnam.hp2005@gmail.com</link> &nbsp;|&nbsp; <link href="https://github.com/moimoi05">github.com/moimoi05</link> &nbsp;|&nbsp; Hanoi, Vietnam', CONTACT),
        Spacer(1, 4),
    ]

    section(story, "EDUCATION")
    story.append(heading("University of Engineering and Technology - Vietnam National University, Hanoi", "Sep 2023 - Dec 2026", "https://uet.edu.vn/"))
    story.append(Paragraph("Major: Artificial Intelligence &nbsp;|&nbsp; GPA: 3.28 &nbsp;|&nbsp; IELTS: 6.0", BODY))
    story.append(Paragraph("Honors: Top 10% Finalist, Naver Hackathon; Consolation Prize, UET Makathon; Outstanding Student Certificate (2026).", BODY))
    story.append(Paragraph('Portfolio: <link href="https://nnam05.id.vn/">nnam05.id.vn</link>', BODY))

    section(story, "EXPERIENCE")
    story.append(heading("Viettel High Tech", "Dec 2025 - Jul 2026", "https://www.viettelhightech.com/"))
    story.append(Paragraph("AI Intern, UAV Perception and Navigation Department", ROLE))
    bullets(story, [
        "Developed computer vision for UAV target detection using thermal and infrared camera data.",
        "Integrated thermal imagery into simulated aerial environments and developed an X-Plane 11 camera simulation plug-in.",
    ])
    story.append(Spacer(1, 5))

    story.append(heading("Central Military Hospital 108", "Dec 2025 - Sep 2026", "https://www.benhvien108.vn/"))
    story.append(Paragraph("Junior Software Developer, Equipment Department", ROLE))
    bullets(story, [
        "Built an end-to-end medical supply management system in Golang for use across hospital departments.",
        "Designed the database, REST APIs and backend logic; added WebSocket live updates and a Gemini-powered RAG chatbot.",
        "Deployed and integrated the system in the hospital's internal web environment.",
    ])
    story.append(Spacer(1, 5))

    story.append(heading("RTC Technology Vietnam", "September 2026 - Present", "https://rtctechnology.com.vn/"))
    story.append(Paragraph("Technical Intern, R&amp;D/Vision Division", ROLE))
    bullets(story, [
        "Supported image processing and deep learning for product defect inspection; QR, Data Matrix and barcode reading; and OCR.",
        "Supported vision-guided product positioning for robotic pick-and-place.",
        "Configured vision systems and selected cameras, lenses and lighting for each application.",
    ])
    story.append(Spacer(1, 5))

    story.append(heading("AVITECH Research Group, VNU-UET", "Present", "https://avitechresearch.vn/"))
    story.append(Paragraph("Undergraduate Thesis Researcher - Alzheimer's Disease Prognosis", ROLE))
    bullets(story, [
        "Researching Alzheimer's prognosis with deep learning and longitudinal, multimodal data to model disease progression over time.",
    ])
    story.append(Paragraph('Research profile: <link href="https://avitechresearch.vn/nguyen-phuong-nam/">avitechresearch.vn/nguyen-phuong-nam/</link>', BODY))

    section(story, "TECHNICAL SKILLS")
    for label, value in [
        ("Programming", "Python, Golang"),
        ("Machine &amp; Deep Learning", "PyTorch, scikit-learn, Hugging Face, CNN, RNN, LSTM, Transformer, BERT, GPT"),
        ("Computer Vision", "YOLOv8, FaceNet, MTCNN, InceptionResnetV1"),
        ("Data &amp; Scientific Computing", "NumPy, Matplotlib, SQL, NoSQL"),
        ("Tools", "Docker, Colab, CI/CD"),
    ]:
        story.append(Paragraph(f"<b>{label}:</b> {value}", BODY))

    doc = SimpleDocTemplate(str(PDF), pagesize=letter, rightMargin=45, leftMargin=45, topMargin=34, bottomMargin=34, title="Nguyen Phuong Nam - CV", author="Nguyen Phuong Nam")
    doc.build(story)


def build_preview() -> None:
    import pypdfium2 as pdfium

    document = pdfium.PdfDocument(str(PDF))
    if len(document) != 1:
        raise ValueError(f"Expected a one-page CV, got {len(document)} pages")
    image = document[0].render(scale=2.55).to_pil().convert("RGB")
    image.save(PREVIEW, "WEBP", quality=88, method=6)


if __name__ == "__main__":
    build_pdf()
    build_preview()
