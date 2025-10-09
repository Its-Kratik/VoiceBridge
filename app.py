import streamlit as st
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from gtts import gTTS
import tempfile

st.set_page_config(page_title="Hindi ↔ Sanskrit Translator", page_icon="🪔", layout="centered")

st.title("🪔 Hindi ↔ Sanskrit Text & Voice Translator")

# --- Load model (small, public) ---
@st.cache_resource
def load_model():
    model_name = "sanskrit-ai/hindi-sanskrit-translation"  # small + fast
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    return model, tokenizer

model, tokenizer = load_model()

# --- Translation function ---
def translate_text(text, src="hin", tgt="san"):
    if not text.strip():
        return ""
    inputs = tokenizer(text, return_tensors="pt", truncation=True)
    outputs = model.generate(**inputs, max_length=200)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# --- UI selection ---
direction = st.radio("Select Translation Direction:", ["Hindi → Sanskrit", "Sanskrit → Hindi"])
text_input = st.text_area("Enter text here:", placeholder="Type your Hindi or Sanskrit text...")

if st.button("Translate"):
    with st.spinner("Translating..."):
        if direction == "Hindi → Sanskrit":
            translated = translate_text(text_input, src="hin", tgt="san")
        else:
            translated = translate_text(text_input, src="san", tgt="hin")

    if translated:
        st.success("✅ Translation complete:")
        st.write(translated)

        # --- Convert to Speech ---
        try:
            lang_code = "sa" if direction == "Hindi → Sanskrit" else "hi"
            tts = gTTS(text=translated, lang=lang_code)
            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as fp:
                tts.save(fp.name)
                st.audio(fp.name, format="audio/mp3")
        except Exception as e:
            st.warning("Text-to-speech not available for this language on gTTS.")
    else:
        st.warning("No translation found. Please try again.")

st.markdown("---")
st.markdown("👩‍💻 *Built using Streamlit + Transformers + gTTS*")
