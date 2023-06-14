from django.shortcuts import render
from django.http import HttpResponse
from .forms import CompanyForm
import docx

def replace_text(document, placeholder, replacement):
    for paragraph in document.paragraphs:
        if placeholder in paragraph.text:
            paragraph.text = paragraph.text.replace(placeholder, replacement)

def company_form(request):
    if request.method == 'POST':
        form = CompanyForm(request.POST)
        if form.is_valid():
            company_name = form.cleaned_data['company_name']
            company_internet_address = form.cleaned_data['company_internet_address']
            company_address = form.cleaned_data['company_address']
            company_post_number = form.cleaned_data['company_post_number']
            company_e_mail_address = form.cleaned_data['company_e_mail_address']
            entrepreneur = form.cleaned_data['entrepreneur']
            company_phone = form.cleaned_data['company_phone']
            company_NIP = form.cleaned_data['company_NIP']
            company_KRS = form.cleaned_data['company_KRS']
            company_REGON = form.cleaned_data['company_REGON']
            kapital_skladowy = form.cleaned_data['kapital_skladowy']
            company_bank_number = form.cleaned_data['company_bank_number']
            sad_rejonowy = form.cleaned_data['sad_rejonowy']
            nr_sadu_rejonowego = form.cleaned_data['nr_sadu_rejonowego']

            # Wczytaj plik szablonu .docx
            doc = docx.Document('template.docx')

            # Wyszukaj i zastąp tekst
            replace_text(doc, '{company_name}', company_name)
            replace_text(doc, '{company_internet_address}', company_internet_address)
            replace_text(doc, '{company_address}', company_address)
            replace_text(doc, '{company_post_number}', company_post_number)
            replace_text(doc, '{company_e_mail_address}', company_e_mail_address)
            replace_text(doc, '{entrepreneur}', entrepreneur)
            replace_text(doc, '{company_phone}', company_phone)
            replace_text(doc, '{company_NIP}', company_NIP)
            replace_text(doc, '{company_KRS}', company_KRS)
            replace_text(doc, '{company_REGON}', company_REGON)
            replace_text(doc, '{kapital_skladowy}', kapital_skladowy)
            replace_text(doc, '{company_bank_number}', company_bank_number)
            replace_text(doc, '{sad_rejonow}', sad_rejonowy)
            replace_text(doc, '{nr_sadu_rejonowego}', nr_sadu_rejonowego)

            # Zapisz zmodyfikowany dokument
            doc.save('filled_template.docx')

            return HttpResponse('Wypełniony szablon został zapisany.')
    else:
        form = CompanyForm()

    return render(request, 'company_form.html', {'form': form})
