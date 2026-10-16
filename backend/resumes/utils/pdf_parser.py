from pypdf import PdfReader


def extract_text_from_pdf(file):
    """
    Extract text from an uploaded PDF file.
    """

    try:
        reader = PdfReader(file)

        text = []

        for page in reader.pages:
            page_text = page.extract_text()

            if page_text:
                text.append(page_text)

        return "\n".join(text).strip()

    except Exception as e:
        raise ValueError(f"Failed to extract PDF text: {str(e)}")