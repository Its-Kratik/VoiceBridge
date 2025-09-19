# app.py
import streamlit as st
import requests
import json

# Set page config
st.set_page_config(
    page_title="Sanskrit-Hindi Translator",
    page_icon="🌐",
    layout="wide"
)

# Title and description
st.title("🌐 Sanskrit-Hindi Translator")
st.markdown("Powered by AI4Bharat's Indictrans2 model via Hugging Face API")

# Your Hugging Face access token
HF_TOKEN = "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"  # Replace if needed
API_URL = "https://api-inference.huggingface.co/models/ai4bharat/indictrans2-indic-indic-1B"
headers = {"Authorization": f"Bearer {HF_TOKEN}"}

# Function to call Hugging Face API
def translate_with_api(text, src_lang, tgt_lang):
    """
    Translate text using Hugging Face Inference API
    """
    if not text.strip():
        return ""
    
    try:
        # Format input as required by the model
        formatted_input = f"{src_lang} {tgt_lang} {text.strip()}"
        
        # Prepare payload
        payload = {
            "inputs": formatted_input,
            "parameters": {
                "max_length": 256,
                "num_beams": 1,
                "do_sample": False
            }
        }
        
        # Make API request
        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()  # Raise error for bad status codes
        
        # Parse response
        result = response.json()
        
        if isinstance(result, list) and len(result) > 0:
            if 'generated_text' in result[0]:
                return result[0]['generated_text']
            else:
                return result[0].get('translation_text', str(result[0]))
        else:
            return "No translation returned from API"
            
    except requests.exceptions.RequestException as e:
        return f"API Error: {str(e)}"
    except Exception as e:
        return f"Error: {str(e)}"

# Main app layout
def main():
    # Input section
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Input")
        
        # Translation direction
        translation_direction = st.radio(
            "Translation Direction:",
            ["Hindi to Sanskrit", "Sanskrit to Hindi"],
            horizontal=True,
            index=0
        )
        
        # Text input
        input_text = st.text_area(
            "Enter text to translate:",
            height=150,
            placeholder="Type your text here...",
            help="Enter Hindi or Sanskrit text to translate"
        )
        
        # Translate button
        if st.button("🚀 Translate", type="primary", use_container_width=True):
            if input_text.strip():
                st.session_state.translate_clicked = True
                st.session_state.input_text = input_text
                st.session_state.direction = translation_direction
            else:
                st.warning("Please enter some text to translate")

    with col2:
        st.subheader("Output")
        
        if st.session_state.get('translate_clicked', False):
            with st.spinner("Translating via Hugging Face API..."):
                if st.session_state.direction == "Hindi to Sanskrit":
                    result = translate_with_api(
                        st.session_state.input_text, 
                        "hin_Deva", 
                        "san_Deva"
                    )
                else:
                    result = translate_with_api(
                        st.session_state.input_text, 
                        "san_Deva", 
                        "hin_Deva"
                    )
            
            # Display result
            st.text_area(
                "Translation:",
                value=result,
                height=150,
                key="output_area"
            )
            
            # Copy and download buttons
            if result and not result.startswith("Error"):
                col21, col22 = st.columns(2)
                with col21:
                    if st.button("📋 Copy to Clipboard", use_container_width=True):
                        st.session_state.copied = True
                        st.toast("Copied to clipboard!")
                with col22:
                    st.download_button(
                        "💾 Download Translation",
                        data=result,
                        file_name="translation.txt",
                        mime="text/plain",
                        use_container_width=True
                    )
        else:
            st.info("👆 Enter text and click 'Translate' to see results")

    # Examples section
    st.divider()
    st.subheader("📚 Examples")
    
    examples_col1, examples_col2 = st.columns(2)
    
    with examples_col1:
        st.markdown("**Hindi → Sanskrit Examples**")
        st.code("वह बाजार जाता है।\n→ सः विपणिं गच्छति ।")
        st.code("हमें सत्य बोलना चाहिए।\n→ अस्माभिः सत्यं वक्तव्यं ।")
        st.code("बच्ची गाना गा रही है।\n→ बालिका गीतं गायति ।")
    
    with examples_col2:
        st.markdown("**Sanskrit → Hindi Examples**")
        st.code("अहं भोजनं खादामि।\n→ मैं भोजन खाता हूँ।")
        st.code("सः विपणिं गच्छति।\n→ वह बाजार जाता है।")
        st.code("ते क्रीडन्ति।\n→ वे खेल रहे हैं।")

    # Footer
    st.divider()
    st.caption("Powered by Hugging Face Inference API • AI4Bharat Indictrans2 Model")

# Initialize session state
if 'translate_clicked' not in st.session_state:
    st.session_state.translate_clicked = False
if 'input_text' not in st.session_state:
    st.session_state.input_text = ""
if 'direction' not in st.session_state:
    st.session_state.direction = "Hindi to Sanskrit"

# Run the app
if __name__ == "__main__":
    main()
