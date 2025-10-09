import streamlit as st
from gtts import gTTS
import tempfile

st.set_page_config(page_title="Hindi ↔ Sanskrit Translator", page_icon="🪔", layout="centered")
st.title("🪔 Hindi ↔ Sanskrit Text & Voice Translator (Lite Version)")

# --- Simple rule-based Hindi ↔ Sanskrit dictionary ---
hindi_to_sanskrit = {
    "नमस्ते": "नमः",
    "आप": "त्वम्",
    "कैसे": "कथम्",
    "हैं": "असि",
    "मैं": "अहम्",
    "मेरा": "मम",
    "घर": "गृहः",
    "जल": "वारि",
    "पुस्तक": "पुस्तकम्",
    "विद्यालय": "पाठशाला",
    "धन्यवाद": "धन्यः",
    "खाना": "भोजनम्"
}

sanskrit_to_hindi = {v: k for k, v in hindi_to_sanskrit.items()}

def translate_text(text, direction):
    words = text.strip().split()
    translated = []
    for w in words:
        if direction == "Hindi → Sanskrit":
            translated.append(hindi_to_sanskrit.get(w, w))
        else:
            translated.append(sanskrit_to_hindi.get(w, w))
    return " ".join(translated)

# --- UI ---
direction = st.radio("Select Translation Direction:", ["Hindi → Sanskrit", "Sanskrit → Hindi"])
text_input = st.text_area("Enter text here:", placeholder="Type your Hindi or Sanskrit text...")

if st.button("Translate"):
    if text_input.strip():
        translated = translate_text(text_input, direction)
        st.success("✅ Translation complete:")
        st.write(translated)

        # --- Text-to-speech ---
        try:
            lang_code = "sa" if direction == "Hindi → Sanskrit" else "hi"
            tts = gTTS(text=translated, lang=lang_code)
            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as fp:
                tts.save(fp.name)
                st.audio(fp.name, format="audio/mp3")
        except Exception:
            st.warning("Text-to-speech not available for this language.")
    else:
        st.warning("Please enter some text to translate.")

st.markdown("---")
st.markdown("💡 *Offline-compatible lightweight version — perfect for Streamlit Cloud Free Tier*")
