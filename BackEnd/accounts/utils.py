from io import BytesIO
import requests
from pdfminer.high_level import extract_text
import spacy
import re
import phonenumbers
import os
import pandas as pd
from .constant import PROVINCES, PROVINCES_1, PROVINCES_2


def check_pass(password):
    if len(password) < 8:
        return False
    return True


def same_pass(new_password, repeat_password):
    if new_password != repeat_password:
        return False
    return True
    
def extract_text_from_pdf(pdf_path):
    response = requests.get(pdf_path)
    pdf_bytes = BytesIO(response.content)
    text = extract_text(pdf_bytes)
    return text

def extract_phone_number(text) -> list:
    phone_numbers = []
    for match in phonenumbers.PhoneNumberMatcher(text, "VN"):
        phone_numbers.append(re.sub(r'\D', '', phonenumbers.format_number(match.number, phonenumbers.PhoneNumberFormat.E164)))
    return phone_numbers.append(None)

def extract_location(text):
    # List of location names in Vietnamese
    matches = [None]
    locations = PROVINCES
    # Find all matches of the location names in the text
    matches = [loc for loc in locations if re.search(loc, text, re.IGNORECASE)]
    if matches[0] in PROVINCES_2:
        index = PROVINCES_2.index(matches[0])
        return PROVINCES_1[index]
    return matches[0]

nlp = spacy.load("en_core_web_sm")
def extract_skills(nlp_text):
    data = pd.read_csv(os.path.join(os.path.dirname(__file__), 'skills.csv'))
    SKILLS = list(data.columns.values)
    doc = nlp(nlp_text)
    skills = []
    for token in doc:
        if token.text.lower() in SKILLS:
            skills.append(token.text)
    for chunk in doc.noun_chunks:
        chunk_text = chunk.text.lower()
        for skill in SKILLS:
            if skill in chunk_text:
                skills.append(skill)
    lowered_list = [item.lower() for item in skills]
    unique_list = list(set(lowered_list))
    return ", ".join(unique_list)
