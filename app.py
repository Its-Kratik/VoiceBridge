import streamlit as st
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from gtts import gTTS
import os
import tempfile

st.set_page_config(page_title="Hindi ↔ Sanskrit Voice Translator", layout="centered")

# Load translation model
@st.cache_resource
def load_model():
    model_name = "ai4bharat/indictrans2-en-indic"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    return model, tokenizer

model, tokenizer = load_model()

# Translation function
def translate_text(text, src_lang="hin_Deva", tgt_lang="san_Deva"):
    inputs = tokenizer(f"<2{tgt_lang}> {text}", return_tensors="pt", truncation=True)
    output_tokens = model.generate(**inputs, max_length=200)
    return tokenizer.decode(output_tokens[0], skip_special_tokens=True)

st.title("🌐 Hindi ↔ Sanskrit Text & Voice Translator")

option = st.radio("Select translation direction:", ["Hindi → Sanskrit", "Sanskrit → Hindi"])

# Text input
text_input = st.text_area("Enter your text:")

if st.button("Translate"):
    if option == "Hindi → Sanskrit":
        output = translate_text(text_input, "hin_Deva", "san_Deva")
    else:
        output = translate_text(text_input, "san_Deva", "hin_Deva")

    st.success("📝 Translated Text:")
    st.write(output)

    # Text to Speech
    tts = gTTS(text=output, lang="sa" if option == "Hindi → Sanskrit" else "hi")
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as fp:
        tts.save(fp.name)
        st.audio(fp.name, format="audio/mp3")

# Voice input (optional)
st.subheader("🎙 Upload an audio file")
uploaded_file = st.file_uploader("Upload Hindi or Sanskrit audio (.wav, .mp3)", type=["wav", "mp3"])
if uploaded_file:
    st.info("⚙️ Speech-to-text and translation can be added here using Whisper model.")
