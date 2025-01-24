from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts.prompt import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from transformers import pipeline


def translate_text():
    prompt = (
        "Translate the following sentence into {language} as literally as possible, "
        "preserving structure and meaning without adding interpretations: {sentence}"
    )
    prompt_template = PromptTemplate(
        input_variables=["language", "sentence"],
        template=prompt
    )
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        api_key="AIzaSyD0g0psx7fU7rfAGgp3uD5fKnKN7Df3zeU"
    )
    chain = prompt_template | llm | StrOutputParser()

    # Extract text from audio
    whisper = pipeline('automatic-speech-recognition', model = 'openai/whisper-medium', device = 0)
    text = whisper('english.mp3')['text']
    return_timestamps=True

    # Translate text
    # language = input("Enter the target language (e.g., French, Spanish): ")
    language = "French"
    res = chain.invoke({"language": language, "sentence": text})
    print(f"Translated sentence: {res}")

if __name__ == "__main__":
    translate_text()