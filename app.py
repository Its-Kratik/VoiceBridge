import streamlit as st
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

@st.cache_resource(show_spinner=True)
def load_model():
    model_name = "ai4bharat/indictrans2-indic-indic-1B@24d7329"
    tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name, trust_remote_code=True)
    model = model.to("cpu")
    model.eval()
    return tokenizer, model

def translate(texts, src_lang, tgt_lang, tokenizer, model):
    outputs = []
    for text in texts:
        try:
            formatted_input = f"{src_lang} {tgt_lang} {text.strip()}"
            inputs = tokenizer(formatted_input, return_tensors="pt", truncation=True).to("cpu")
            with torch.no_grad():
                output = model.generate(
                    input_ids=inputs.input_ids,
                    attention_mask=inputs.attention_mask,
                    max_length=256,
                    num_beams=1,
                    do_sample=False,
                    use_cache=False
                )
            decoded = tokenizer.decode(output[0], skip_special_tokens=True)
            outputs.append(decoded)
        except Exception as e:
            outputs.append("Translation failed")
    return outputs

def main():
    st.title("Hindi ↔ Sanskrit Translation App")

    tokenizer, model = load_model()

    lang_map = {
        "Hindi Devanagari": "hin_Deva",
        "Sanskrit Devanagari": "san_Deva",
    }

    # Language selectors
    src_lang_name = st.selectbox("Source Language", list(lang_map.keys()), index=0)
    tgt_lang_name = st.selectbox("Target Language", list(lang_map.keys()), index=1)

    if src_lang_name == tgt_lang_name:
        st.warning("Source and target languages must be different.")
        return

    src_lang = lang_map[src_lang_name]
    tgt_lang = lang_map[tgt_lang_name]

    input_text = st.text_area("Enter text (each sentence on a new line)", height=200)

    if st.button("Translate"):
        if input_text.strip():
            input_lines = input_text.strip().split('\n')
            translations = translate(input_lines, src_lang, tgt_lang, tokenizer, model)
            st.subheader("Translations")
            for orig, trans in zip(input_lines, translations):
                st.markdown(f"**{orig}** → {trans}")
        else:
            st.warning("Please enter text to translate.")

if __name__ == "__main__":
    main()
